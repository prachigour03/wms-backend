import express from "express";
import {
  upsertUtilitySetting,
  getUtilitySettings,
  getUtilitySettingByKey,
  deleteUtilitySetting,
  upsertBulkUtilitySettings,
} from "../controllers/utilitySetting.controller.js";

const router = express.Router();

// CREATE / UPDATE SINGLE SETTING (UPSERT BY KEY)
router.post("/", upsertUtilitySetting);

// BULK UPDATE SETTINGS (Settings Page Save)
router.put("/bulk", upsertBulkUtilitySettings);

// GET ALL SETTINGS
router.get("/", getUtilitySettings);

// GET SETTING BY KEY
router.get("/:key", getUtilitySettingByKey);

// DELETE SETTING BY KEY
router.delete("/:key", deleteUtilitySetting);

export default router;
