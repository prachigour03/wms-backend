import express from "express";
import {
  createChartOfAccount,
  getChartOfAccounts,
  getChartOfAccountById,
  updateChartOfAccount,
  deleteChartOfAccount,
} from "../controllers/chartOfAccount.controller.js";

const router = express.Router();

router.post("/", createChartOfAccount);
router.get("/", getChartOfAccounts);
router.get("/:id", getChartOfAccountById);
router.put("/:id", updateChartOfAccount);
router.delete("/:id", deleteChartOfAccount);

export default router;
