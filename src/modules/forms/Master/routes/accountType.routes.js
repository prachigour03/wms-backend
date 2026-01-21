import express from "express";
import {
  createAccountType,
  getAccountTypes,
  getAccountTypeById,
  updateAccountType,
  deleteAccountType,
} from "../controllers/accountType.controller.js";

const router = express.Router();

router.post("/", createAccountType);
router.get("/", getAccountTypes);
router.get("/:id", getAccountTypeById);
router.put("/:id", updateAccountType);
router.delete("/:id", deleteAccountType);

export default router;
