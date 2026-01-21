import express from "express";
import {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} from "../controllers/warehouse.controller.js";

const router = express.Router();

/* ================= WAREHOUSE ROUTES ================= */

// Create warehouse
router.post("/", createWarehouse);

// Get all warehouses
router.get("/", getWarehouses);

// Get warehouse by id
router.get("/:id", getWarehouseById);

// Update warehouse
router.put("/:id", updateWarehouse);

// Delete warehouse (soft delete)
router.delete("/:id", deleteWarehouse);

export default router;
