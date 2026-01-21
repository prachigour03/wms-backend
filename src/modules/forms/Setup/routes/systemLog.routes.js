import express from "express";
import {
  createSystemLog,
  getSystemLogs,
  deleteSystemLog,
} from "../controllers/systemLog.controller.js";

const router = express.Router();

router.post("/", createSystemLog);
router.get("/", getSystemLogs);
router.delete("/:id", deleteSystemLog);

export default router;
