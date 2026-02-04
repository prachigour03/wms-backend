import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  addPermissionToRole,
  createPermission,
} from "./role.controller.js";
import { authenticateJWT } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/authorize.middleware.js";

const router = express.Router();

/* ======================================================
   ROLE ROUTES
====================================================== */

// Protect all role routes
router.use(authenticateJWT);

// Get all roles
router.get("/", authorizePermission("roles:read"), getAllRoles);

// Get role by ID
router.get("/:id", authorizePermission("roles:read"), getRoleById);

// Create role
router.post("/", authorizePermission("roles:create"), createRole);

// Update role
router.put("/:id", authorizePermission("roles:update"), updateRole);

// Delete role
router.delete("/:id", authorizePermission("roles:delete"), deleteRole);

/* ======================================================
   PERMISSION ROUTES
====================================================== */

// Add permission to role
router.post(
  "/add-permission",
  authorizePermission("roles:update"),
  addPermissionToRole
);

// Create a new permission
router.post(
  "/permissions",
  authorizePermission("permissions:create"),
  createPermission
);

export default router;
