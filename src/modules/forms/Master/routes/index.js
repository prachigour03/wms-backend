import express from "express";

import accountTypeRoutes from "./accountType.routes.js";
import chartOfAccountRoutes from "./chartOfAccount.routes.js";
import customerRoutes from "./customer.routes.js";
import itemRoutes from "./item.routes.js";
import itemGroupRoutes from "./itemGroup.routes.js";
import employeeRoutes from "./employees.routes.js";
import warehouseRoutes from "./warehouse.routes.js";
import vendorRoutes from "./vendor.routes.js";

const router = express.Router();

router.use("/account-types", accountTypeRoutes);
router.use("/chart-of-accounts", chartOfAccountRoutes);
router.use("/customers", customerRoutes);
router.use("/items", itemRoutes);
router.use("/item-groups", itemGroupRoutes);
router.use("/employees", employeeRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/vendors", vendorRoutes);

export default router;
