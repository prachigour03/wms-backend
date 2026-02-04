import bcrypt from "bcryptjs";
import db from "../../../../models/index.js";

const { Employee } = db;
/**
 * ✅ Create Employee
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      designation,
      status,
    } = req.body;

    // check required fields
    if (!firstName || !lastName || !email || !phone || !password || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing email
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      designation,
      status: status || "Active",
    });

    res.status(201).json({
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ Get All Employees
 */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ data: employees });
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
};

/**
 * ✅ Get Employee By ID
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ data: employee });
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
};

/**
 * ✅ Update Employee
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedData = { ...req.body };

    // if password is being updated
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    await employee.update(updatedData);

    res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error" });
  }
};

/**
 * ✅ Delete Employee
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({error, message: "Internal server error" });
  }
};
