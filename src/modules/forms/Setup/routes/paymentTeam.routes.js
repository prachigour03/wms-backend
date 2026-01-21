import express from "express";
import {
  createPaymentTeam,
  getPaymentTeams,
  getPaymentTeamById,
  updatePaymentTeam,
  deletePaymentTeam,
} from "../controllers/paymentTeam.controller.js";

const router = express.Router();

router.post("/", createPaymentTeam);
router.get("/", getPaymentTeams);
router.get("/:id", getPaymentTeamById);
router.put("/:id", updatePaymentTeam);
router.delete("/:id", deletePaymentTeam);

export default router;
