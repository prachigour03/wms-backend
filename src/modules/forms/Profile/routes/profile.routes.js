import express from "express";
import {
  createAdminProfile,
  getAdminProfileById,
  getMyProfile,
  updateAdminProfile,
  deleteAdminProfile,
} from "../controllers/profile.controller.js";

import { uploadProfileImage } from "../../../../utils/upload.js";
import { protect } from "../../../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../../../middleware/role.middleware.js";

const router = express.Router();

/* ================================
   CREATE PROFILE (ADMIN ONLY)
================================ */
router.post(
  "/",
  protect,
  roleMiddleware("admin"),
  uploadProfileImage.single("profileImage"),
  createAdminProfile
);

/* ================================
   GET LOGGED-IN PROFILE
   (ADMIN + USER)
================================ */
router.get(
  "/me",
  protect,
  roleMiddleware("admin", "user"),
  getMyProfile
);

/* ================================
   UPDATE OWN PROFILE
   (ADMIN + USER)
================================ */
router.put(
  "/:id",
  protect,
  roleMiddleware("admin", "user"),
  uploadProfileImage.single("profileImage"),
  updateAdminProfile
);

/* ================================
   GET PROFILE BY ID (ADMIN ONLY)
================================ */
router.get(
  "/:id",
  protect,
  roleMiddleware("admin"),
  getAdminProfileById
);

/* ================================
   DELETE PROFILE (ADMIN ONLY)
================================ */
router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteAdminProfile
);

export default router;
