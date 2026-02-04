import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { Permission } = db;

/**
 * Generate JWT token
 *
 * @param {Object} payload
 * @param {string} payload.id - User ID
 * @param {string} payload.role - User role
 * @param {string} payload.email - User email
 * @param {Array} [payload.permissions] - Optional, ignored for SUPER_ADMIN
 * @returns {string} JWT token
 */
export const generateToken = async ({ id, role, email, permissions = [] }) => {
  // SUPER_ADMIN bypass → fetch all permissions dynamically
  if (role === "super admin") {
    const allPermissions = await Permission.findAll();
    permissions = allPermissions.map(p => `${p.module}:${p.action}`);
  }

  return jwt.sign(
    { id, role, email, permissions },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 24 hours
  );
};
   