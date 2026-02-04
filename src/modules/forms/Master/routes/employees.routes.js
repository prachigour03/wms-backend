import exprees from "express";
import {
  createEmployee,   
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controllers/employees.controller.js";    

const router = exprees.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);  
export default router;