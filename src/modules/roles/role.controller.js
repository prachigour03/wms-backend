import { Op } from "sequelize";
import db from "../../models/index.js";

const { Role, Permission } = db;

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

/* ======================================================
   GET ALL ROLES
====================================================== */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: {
        model: Permission,
        through: { attributes: [] },
      },
    });

    return res.json({ success: true, roles });
  } catch (error) {
    console.error("GET ROLES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};

/* ======================================================
   GET ROLE BY ID
====================================================== */
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: {
        model: Permission,
        through: { attributes: [] },
      },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.json({ success: true, role });
  } catch (error) {
    console.error("GET ROLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch role",
    });
  }
};

/* ======================================================
   CREATE ROLE (SUPER ADMIN ONLY)
====================================================== */
export const createRole = async (req, res) => {
  try {
    const { name, permissionKeys } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    let resolved = null;
    if (Array.isArray(permissionKeys)) {
      resolved = await resolvePermissions(permissionKeys);
      if (resolved.missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid permission keys",
          missing: resolved.missing,
        });
      }
    }

    const role = await Role.create({
      name: name.toLowerCase().trim(),
    });

    if (resolved) {
      await role.setPermissions(resolved.permissions);
    }

    return res.status(201).json({ success: true, role });
  } catch (error) {
    console.error("CREATE ROLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create role",
    });
  }
};

/* ======================================================
   UPDATE ROLE
====================================================== */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissionKeys } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (name?.trim()) {
      role.name = name.toLowerCase().trim();
    }

    await role.save();

    if (Array.isArray(permissionKeys)) {
      const { permissions, missing } = await resolvePermissions(permissionKeys);
      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid permission keys",
          missing,
        });
      }
      await role.setPermissions(permissions);
    }

    return res.json({ success: true, role });
  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update role",
    });
  }
};

/* ======================================================
   DELETE ROLE
====================================================== */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await role.destroy();

    return res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ROLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete role",
    });
  }
};

/* ======================================================
   ASSIGN PERMISSION TO ROLE (USING permissionKey)
====================================================== */
export const addPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionKey } = req.body;

    if (!roleId || !permissionKey) {
      return res.status(400).json({
        success: false,
        message: "roleId and permissionKey are required",
      });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const [module, action] = permissionKey
      .toLowerCase()
      .trim()
      .split(":");

    if (!module || !action) {
      return res.status(400).json({
        success: false,
        message: "Invalid permission format (module:action)",
      });
    }

    const permission = await Permission.findOne({
      where: { module, action },
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: `Permission '${permissionKey}' not found`,
      });
    }

    const alreadyAssigned = await role.hasPermission(permission);
    if (alreadyAssigned) {
      return res.json({
        success: true,
        message: "Permission already assigned",
      });
    }

    await role.addPermission(permission);

    return res.json({
      success: true,
      message: `Permission '${permissionKey}' assigned to role '${role.name}'`,
    });
  } catch (error) {
    console.error("ADD PERMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add permission to role",
    });
  }
};

/* ======================================================
   CREATE PERMISSION
====================================================== */
export const createPermission = async (req, res) => {
  try {
    const { module, action } = req.body;

    if (!module || !action) {
      return res.status(400).json({
        success: false,
        message: "Module and action are required",
      });
    }

    const permission = await Permission.create({
      module: module.toLowerCase().trim(),
      action: action.toLowerCase().trim(),
    });

    return res.status(201).json({ success: true, permission });
  } catch (error) {
    console.error("CREATE PERMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create permission",
    });
  }
};
