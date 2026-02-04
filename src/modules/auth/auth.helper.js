import db from "../models/index.js";
const { Permission } = db;

/**
 * Returns a list of permission strings for a user
 * e.g. ["users:create", "users:read"]
 */
export const getUserPermissions = async (user) => {
  if (!user || !user.Role) return [];

  // SUPER_ADMIN → all permissions
  if (user.Role.name?.toLowerCase() === "super admin") {
    const all = await Permission.findAll();
    return all.map(p => `${p.module}:${p.action}`.toLowerCase());
  }

  // Normal user
  if (Array.isArray(user.Role.Permissions)) {
    return user.Role.Permissions.map(
      p => `${p.module}:${p.action}`.toLowerCase()
    );
  }

  return [];
};
