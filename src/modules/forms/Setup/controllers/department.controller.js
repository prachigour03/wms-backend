import db from "../../../../models/index.js";

const { Department } = db;

/**
 * CREATE
 */
export const createDepartment = async (req, res) => {
  const { departmentCode, departmentName } = req.body || {};

  if (!departmentCode || !departmentName) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const department = await Department.create({ departmentCode, departmentName });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [["created_at", "DESC"]] });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });

    await department.update(req.body);
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE
 */
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Department not found" });

    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
