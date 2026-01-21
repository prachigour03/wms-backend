import express from "express";
import {
  createVendorBill,
  getVendorBills,
  updateVendorBill,
  deleteVendorBill,
} from "../controllers/VendorBill.controller.js"; // <-- add .js here

const router = express.Router();

router.post("/", createVendorBill);
router.get("/", getVendorBills);
router.put("/:id", updateVendorBill);
router.delete("/:id", deleteVendorBill);

export default router;
