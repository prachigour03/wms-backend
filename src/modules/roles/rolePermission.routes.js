import express from "express";
import {
  getAllPermissions,
  assignPermissionToRole,
  deletePermission,
} from "./rolePermission.controller.js";

import { authenticateJWT } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/authorize.middleware.js";

const router = express.Router();

/* ======================================================
   ALL PERMISSIONS ROUTES
====================================================== */

// Protect all permission routes
router.use(authenticateJWT);
 
// Get all permissions
router.get("/", authorizePermission("permissions:read"), getAllPermissions);

// Assign permission to a role
router.post(
  "/assign",
  authorizePermission("roles:update"),
  assignPermissionToRole
);

// Delete a permission
router.delete("/:id", authorizePermission("permissions:delete"), deletePermission);

export default router;
