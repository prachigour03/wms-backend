import express from "express";
import {
  createReturnMaterial,
  getReturnMaterials,
  updateReturnMaterial,
  deleteReturnMaterial,
} from "../controllers/ReturnMaterial.controller.js"; // <-- add .js

const router = express.Router();

router.post("/", createReturnMaterial);
router.get("/", getReturnMaterials);
router.put("/:id", updateReturnMaterial);
router.delete("/:id", deleteReturnMaterial);

export default router;
