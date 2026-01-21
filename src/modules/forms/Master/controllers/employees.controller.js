import db from "../../../../models/index.js";
import bcrypt from "bcrypt";

const { Employee } = db;

/* ---------------- CREATE EMPLOYEE ---------------- */
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      designation,
      locationId,
      subsidiaryId,
      status,
    } = req.body;

    // check email already exists
    const existing = await Employee.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
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
      locationId,
      subsidiaryId,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

/* ---------------- GET ALL EMPLOYEES ---------------- */
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: { exclude: ["password"] },
      include: [
        { model: Location, attributes: ["id", "name"] },
        { model: Subsidiary, attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

/* ---------------- GET EMPLOYEE BY ID ---------------- */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [Location, Subsidiary],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

/* ---------------- UPDATE EMPLOYEE ---------------- */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await employee.update(req.body);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

/* ---------------- DELETE EMPLOYEE ---------------- */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.destroy();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};
