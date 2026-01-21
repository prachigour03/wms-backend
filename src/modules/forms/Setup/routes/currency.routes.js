import express from "express";
import {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../controllers/currency.controller.js";

const router = express.Router();

// GET all currencies
router.get("/", getCurrencies);
router.get("/:id", getCurrencyById);
router.post("/", createCurrency);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export default router;
