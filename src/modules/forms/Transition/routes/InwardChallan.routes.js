import express from "express";
import {
  createInwardChallan,
  getInwardChallans,
  getInwardChallanById,
  updateInwardChallan,
  deleteInwardChallan,
  confirmInwardChallan,
  cancelInwardChallan,
} from "../controllers/InwardChallan.controller.js";

const router = express.Router();

router.post("/", createInwardChallan);
router.get("/", getInwardChallans);
router.get("/:id", getInwardChallanById);
router.put("/:id", updateInwardChallan);
router.delete("/:id", deleteInwardChallan);
router.patch("/:id/confirm", confirmInwardChallan);
router.patch("/:id/cancel", cancelInwardChallan);

export default router;
