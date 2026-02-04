import db from "../../models/index.js";
import permissionsModule from "./permissions.cjs";

const { Permission, Role } = db;
const { allPermissions, allPermissionKeys } = permissionsModule;

const ensurePermissionsSeeded = async () => {
  const existing = await Permission.findAll({
    attributes: ["module", "action"],
  });
  const existingKeys = new Set(
    existing.map((p) => `${p.module}:${p.action}`)
  );

  const missing = allPermissionKeys.filter((key) => !existingKeys.has(key));
  if (missing.length > 0) {
    const rows = missing
      .map((key) => {
        const [module, action] = key.split(":");
        if (!module || !action) return null;
        return { module, action };
      })
      .filter(Boolean);

    if (rows.length > 0) {
      await Permission.bulkCreate(rows, { ignoreDuplicates: true });
    }
  }

  return Permission.findAll({
    attributes: ["module", "action"],
  });
};

const toGroupedPermissions = (permissions = []) => {
  return permissions.reduce((acc, p) => {
    const key = `${p.module}:${p.action}`;
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push({
      key,
      description: allPermissions[key] || key,
    });
    return acc;
  }, {});
};

/* ======================================================
   GET ALL PERMISSIONS
====================================================== */
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await ensurePermissionsSeeded();
    const grouped = toGroupedPermissions(permissions);
    return res.json({
      success: true,
      permissions: grouped,
    });
  } catch (error) {
    console.error("GET PERMISSIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
    });
  }
};

/* ======================================================
   ASSIGN PERMISSION TO ROLE
====================================================== */
export const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionKey } = req.body;

    // 1️⃣ Validate inputs
    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "Role ID is required",
      });
    }

    if (!permissionKey || typeof permissionKey !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid permissionKey is required (module:action)",
      });
    }

    // 2️⃣ Find role
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // 3️⃣ Parse permission key
    const [module, action] = permissionKey
      .toLowerCase()
      .trim()
      .split(":");

    if (!module || !action) {
      return res.status(400).json({
        success: false,
        message: "Invalid permission format. Use 'module:action'",
      });
    }

    // 4️⃣ Find permission in DB
    const permission = await Permission.findOne({
      where: { module, action },
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: `Permission '${permissionKey}' not found`,
      });
    }

    // 5️⃣ Prevent duplicate assignment
    const alreadyAssigned = await role.hasPermission(permission);
    if (alreadyAssigned) {
      return res.json({
        success: true,
        message: `Permission '${permissionKey}' already assigned`,
      });
    }

    // 6️⃣ Assign permission
    await role.addPermission(permission);

    return res.json({
      success: true,
      message: `Permission '${permissionKey}' assigned to role '${role.name}'`,
    });
  } catch (error) {
    console.error("ASSIGN PERMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign permission",
    });
  }
};

/* ======================================================
   DELETE PERMISSION
====================================================== */
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Permission ID is required",
      });
    }

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    await permission.destroy();

    return res.json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PERMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete permission",
    });
  }
};
