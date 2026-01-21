import express from "express";
import {
  createSubsidiary,
  getSubsidiaries,
  getSubsidiaryById,
  updateSubsidiary,
  deleteSubsidiary,
} from "../controllers/subsidiary.controller.js";

const router = express.Router();

router.post("/", createSubsidiary);        // CREATE
router.get("/", getSubsidiaries);           // READ ALL
router.get("/:id", getSubsidiaryById);      // READ ONE
router.put("/:id", updateSubsidiary);       // UPDATE
router.delete("/:id", deleteSubsidiary);    // DELETE

export default router;
