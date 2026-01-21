import express from "express";
import {
  createInventoryCount,
  getInventoryCounts,
  updateInventoryCount,
  deleteInventoryCount,
} from "../controllers/InventoryCount.controller.js";

const router = express.Router();

router.post("/", createInventoryCount);
router.get("/", getInventoryCounts);
router.put("/:id", updateInventoryCount);
router.delete("/:id", deleteInventoryCount);

export default router;
