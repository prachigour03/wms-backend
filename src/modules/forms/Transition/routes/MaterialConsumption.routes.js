import express from "express";
import {
  createMaterialConsumption,
  getMaterialConsumptions,
  updateMaterialConsumption,
  deleteMaterialConsumption,
} from "../controllers/MaterialConsumption.controller.js"; // <-- add .js

const router = express.Router();

router.post("/", createMaterialConsumption);
router.get("/", getMaterialConsumptions);
router.put("/:id", updateMaterialConsumption);
router.delete("/:id", deleteMaterialConsumption);

export default router;
