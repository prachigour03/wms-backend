import exprees from "express";
import {
  createEmployee,   
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controllers/employees.controller.js";    

const router = exprees.Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);  
export default router;