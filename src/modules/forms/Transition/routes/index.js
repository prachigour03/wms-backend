import express from "express";

import inventoryCountRoutes from "./InventoryCount.routes.js";
import inwardChallanRoutes from "./InwardChallan.routes.js";
import materialConsumptionRoutes from "./MaterialConsumption.routes.js";
import returnMaterialRoutes from "./ReturnMaterial.routes.js";
import vendorBillRoutes from "./VendorBill.routes.js";
import vendorissueMaterialRoutes from "./VendorissueMaterial.routes.js";

const router = express.Router();

router.use("/inventory-count", inventoryCountRoutes);
router.use("/inward-challan", inwardChallanRoutes);
router.use("/material-consumption", materialConsumptionRoutes);
router.use("/return-material", returnMaterialRoutes);
router.use("/vendor-bill", vendorBillRoutes);
router.use("/vendor-issue-material", vendorissueMaterialRoutes);

export default router;
