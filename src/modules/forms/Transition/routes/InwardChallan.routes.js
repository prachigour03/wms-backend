import express from "express";
import {
  createInwardChallan,
  getInwardChallans,
  updateInwardChallan,
  deleteInwardChallan,
} from "../controllers/InwardChallan.controller.js"; // <-- note the .js

const router = express.Router();

router.post("/", createInwardChallan);
router.get("/", getInwardChallans);
router.put("/:id", updateInwardChallan);
router.delete("/:id", deleteInwardChallan);

export default router;
