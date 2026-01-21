import express from "express";
import {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
} from "../controllers/state.controller.js";

const router = express.Router();

router.post("/", createState);
router.get("/", getStates);
router.get("/:id", getStateById);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

export default router;
