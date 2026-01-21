import express from "express";
import {
  createItemGroup,
  getItemGroups,
  getItemGroupById,
  updateItemGroup,
  deleteItemGroup,
} from "../controllers/itemGroup.controller.js";

const router = express.Router();

router.post("/", createItemGroup);
router.get("/", getItemGroups);
router.get("/:id", getItemGroupById);
router.put("/:id", updateItemGroup);
router.delete("/:id", deleteItemGroup);

export default router;
