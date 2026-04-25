import express from "express";
import {
  createReturnMaterial,
  getReturnMaterials,
  getReturnMaterialById,
  updateReturnMaterial,
  deleteReturnMaterial,
  confirmReturnMaterial,
  cancelReturnMaterial,
} from "../controllers/ReturnMaterial.controller.js";

const router = express.Router();

router.post("/", createReturnMaterial);
router.get("/", getReturnMaterials);
router.get("/:id", getReturnMaterialById);
router.put("/:id", updateReturnMaterial);
router.delete("/:id", deleteReturnMaterial);
router.patch("/:id/confirm", confirmReturnMaterial);
router.patch("/:id/cancel", cancelReturnMaterial);

export default router;
