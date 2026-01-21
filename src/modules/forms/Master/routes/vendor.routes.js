import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../controllers/vendor.controller.js";

const router = express.Router();

/* ================= VENDOR ROUTES ================= */

// Create vendor
router.post("/", createVendor);

// Get all vendors
router.get("/", getVendors);

// Get vendor by id
router.get("/:id", getVendorById);

// Update vendor
router.put("/:id", updateVendor);

// Delete vendor (soft delete)
router.delete("/:id", deleteVendor);

export default router;
