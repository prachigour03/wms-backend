import express from "express";
import {
  createMaterialConsumption,
  getMaterialConsumptions,
  getMaterialConsumptionById,
  updateMaterialConsumption,
  deleteMaterialConsumption,
  confirmMaterialConsumption,
  cancelMaterialConsumption,
} from "../controllers/MaterialConsumption.controller.js";

const router = express.Router();

router.post("/", createMaterialConsumption);
router.get("/", getMaterialConsumptions);
router.get("/:id", getMaterialConsumptionById);
router.put("/:id", updateMaterialConsumption);
router.delete("/:id", deleteMaterialConsumption);
router.patch("/:id/confirm", confirmMaterialConsumption);
router.patch("/:id/cancel", cancelMaterialConsumption);

export default router;
