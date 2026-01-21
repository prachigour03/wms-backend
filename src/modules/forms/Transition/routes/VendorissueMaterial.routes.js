import express from "express";
import {
  createVendorIssueMaterial,
  getVendorIssueMaterials,
  updateVendorIssueMaterial,
  deleteVendorIssueMaterial,
} from "../controllers/VendorissueMaterial.controller.js"; // <-- add .js here

const router = express.Router();

router.post("/", createVendorIssueMaterial);
router.get("/", getVendorIssueMaterials);
router.put("/:id", updateVendorIssueMaterial);
router.delete("/:id", deleteVendorIssueMaterial);

export default router;
