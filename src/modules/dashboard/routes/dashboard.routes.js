import { Router } from "express";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/overview",
  getDashboardOverview
);

export default router;
