import express from "express";
import {
  createAdminProfile,
  getAdminProfileById,
  getMyProfile,
  updateAdminProfile,
  deleteAdminProfile,
} from "../controllers/profile.controller.js";

import { uploadProfileImage } from "../../../../utils/upload.js";
import { authenticateJWT } from "../../../../middleware/auth.middleware.js";
import { authorizePermission } from "../../../../middleware/authorize.middleware.js";

const router = express.Router();

/* ================================
   CREATE PROFILE (ADMIN ONLY)
================================ */
router.post(
  "/",
  authenticateJWT,
  authorizePermission("admin_profiles:create"),
  uploadProfileImage.single("profileImage"),
  createAdminProfile
);

/* ================================
   GET LOGGED-IN PROFILE
   (ADMIN + USER)
================================ */
router.get(
  "/me",
  authenticateJWT,
  authorizePermission("profile:read"),
  getMyProfile
);

/* ================================
   UPDATE OWN PROFILE
   (ADMIN + USER)
================================ */
router.put(
  "/:id",
  authenticateJWT,
  authorizePermission("profile:update"),
  uploadProfileImage.single("profileImage"),
  updateAdminProfile
);

/* ================================
   GET PROFILE BY ID (ADMIN ONLY)
================================ */
router.get(
  "/:id",
  authenticateJWT,
  authorizePermission("admin_profiles:read"),
  getAdminProfileById
);

/* ================================
   DELETE PROFILE (ADMIN ONLY)
================================ */
router.delete(
  "/:id",
  authenticateJWT,
  authorizePermission("admin_profiles:delete"),
  deleteAdminProfile
);

export default router;
