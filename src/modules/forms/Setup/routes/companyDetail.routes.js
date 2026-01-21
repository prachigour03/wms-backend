import express from "express";
import {
  createCompanyDetail,
  getCompanyDetails,
  updateCompanyDetail,
} from "../controllers/companyDetail.controller.js";

const router = express.Router();

router.post("/", createCompanyDetail);
router.get("/", getCompanyDetails);
router.put("/:id", updateCompanyDetail);


export default router;
