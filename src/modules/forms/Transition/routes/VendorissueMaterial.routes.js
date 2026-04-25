import express from "express";
import {
  createVendorIssueMaterial,
  getVendorIssueMaterials,
  getVendorIssueMaterialById,
  updateVendorIssueMaterial,
  deleteVendorIssueMaterial,
  confirmVendorIssueMaterial,
  cancelVendorIssueMaterial,
} from "../controllers/VendorissueMaterial.controller.js";

const router = express.Router();

router.post("/", createVendorIssueMaterial);
router.get("/", getVendorIssueMaterials);
router.get("/:id", getVendorIssueMaterialById);
router.put("/:id", updateVendorIssueMaterial);
router.delete("/:id", deleteVendorIssueMaterial);
router.patch("/:id/confirm", confirmVendorIssueMaterial);
router.patch("/:id/cancel", cancelVendorIssueMaterial);

export default router;
