import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import db from "../../models/index.js";

const { User, Role, Permission } = db;

const normalizePermissionKeys = (permissionKeys = []) => {
  if (!Array.isArray(permissionKeys)) return [];
  return Array.from(
    new Set(
      permissionKeys
        .map((key) => key?.toString().toLowerCase().trim())
        .filter(Boolean)
    )
  );
};

const resolvePermissions = async (permissionKeys = []) => {
  const normalizedKeys = normalizePermissionKeys(permissionKeys);
  if (normalizedKeys.length === 0) return { permissions: [], missing: [] };

  const pairs = normalizedKeys
    .map((key) => {
      const [module, action] = key.split(":");
      if (!module || !action) return null;
      return { module, action };
    })
    .filter(Boolean);

  const permissions = await Permission.findAll({
    where: {
      [Op.or]: pairs,
    },
  });

  const foundKeys = new Set(
    permissions.map((p) => `${p.module}:${p.action}`.toLowerCase())
  );
  const missing = normalizedKeys.filter((key) => !foundKeys.has(key));

  return { permissions, missing };
};

/* ================= CREATE USER (ADMIN ONLY) ================= */
export const createUser = async (req, res) => {
  try {
    // Only super admin (or explicit users:create permission)
    const requesterRole = req.user?.role?.toLowerCase?.() || "";
    const permissions = Array.isArray(req.user?.permissions)
      ? req.user.permissions.map((p) => p.toLowerCase())
      : [];
    const canCreateUser =
      requesterRole === "super admin" || permissions.includes("users:create");

    if (!canCreateUser) {
      return res.status(403).json({
        success: false,
        message: "Only super admin can create users",
      });
    }

    const { name, email, password, roleId, permissionKeys } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const targetRole = await Role.findByPk(roleId);
    if (!targetRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      roleId: targetRole.id,
    });

    // Optional user-level permission overrides
    if (Array.isArray(permissionKeys)) {
      const { permissions, missing } = await resolvePermissions(permissionKeys);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid permission keys",
          missing,
        });
      }

      await user.setUserPermissions(permissions);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: targetRole.name,
      },
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};


/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp", "otpExpiry"] },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          include: [
            {
              model: Permission,
              attributes: ["module", "action"],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Permission,
          as: "UserPermissions",
          attributes: ["module", "action"],
          through: { attributes: [] },
        },
      ],
    });

    const sanitized = users.map((u) => {
      const json = u.toJSON();
      const rolePerms =
        json.Role?.Permissions?.map((p) => `${p.module}:${p.action}`) || [];
      const userPerms =
        json.UserPermissions?.map((p) => `${p.module}:${p.action}`) || [];

      return {
        ...json,
        permissions: userPerms.length > 0 ? userPerms : rolePerms,
      };
    });

    res.json({
      success: true,
      users: sanitized,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* ================= GET USER BY ID ================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "otp", "otpExpiry"] },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          include: [
            {
              model: Permission,
              attributes: ["module", "action"],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Permission,
          as: "UserPermissions",
          attributes: ["module", "action"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const json = user.toJSON();
    const rolePerms =
      json.Role?.Permissions?.map((p) => `${p.module}:${p.action}`) || [];
    const userPerms =
      json.UserPermissions?.map((p) => `${p.module}:${p.action}`) || [];

    res.json({
      success: true,
      user: {
        ...json,
        permissions: userPerms.length > 0 ? userPerms : rolePerms,
      },
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/* ================= UPDATE USER ================= */
export const updateUser = async (req, res) => {
  try {
    const { name, email, roleId, permissionKeys } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase(); // ✅ lowercase email
    if (roleId) user.roleId = roleId;

    await user.save();

    if (Array.isArray(permissionKeys)) {
      const { permissions, missing } = await resolvePermissions(permissionKeys);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid permission keys",
          missing,
        });
      }

      await user.setUserPermissions(permissions);
    }

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
