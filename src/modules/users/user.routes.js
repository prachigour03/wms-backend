import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";

import { authenticateJWT } from "../../middleware/auth.middleware.js";
import { authorizePermission } from "../../middleware/authorize.middleware.js";

const router = express.Router();

// Protect all routes first
router.use(authenticateJWT);

/* ================= USERS ROUTES ================= */

// Get all users
router.get("/", authorizePermission("users:read"), getAllUsers);

// Create a user
router.post("", authorizePermission("users:create"), createUser);

// Get user by ID
router.get("/:id", authorizePermission("users:read"), getUserById);

// Update user
router.put("/:id", authorizePermission("users:update"), updateUser);

// Delete user
router.delete("/:id", authorizePermission("users:delete"), deleteUser);

export default router;
