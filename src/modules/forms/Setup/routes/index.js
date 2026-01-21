import express from "express";

import companyRoutes from "./company.routes.js";
import currencyRoutes from "./currency.routes.js";
import departmentRoutes from "./department.routes.js";
import locationRoutes from "./location.routes.js";
import paymentTeamRoutes from "./paymentTeam.routes.js";
import stateRoutes from "./state.routes.js";
import subsidiaryRoutes from "./subsidiary.routes.js";
import systemLogRoutes from "./systemLog.routes.js";
import utilitySettingRoutes from "./utilitySetting.routes.js";
import citiesRoutes from "./city.routes.js";
import companyDetailRoutes from "./companyDetail.routes.js";

const router = express.Router();

router.use("/companies", companyRoutes);
router.use("/currencies", currencyRoutes);
router.use("/departments", departmentRoutes);
router.use("/locations", locationRoutes);
router.use("/payment-teams", paymentTeamRoutes);
router.use("/states", stateRoutes);
router.use("/subsidiaries", subsidiaryRoutes);
router.use("/system-logs", systemLogRoutes);
router.use("/utility-settings", utilitySettingRoutes);
router.use("/cities", citiesRoutes)
router.use("/company-detail", companyDetailRoutes)
export default router;
