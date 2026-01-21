import db from "../../../../models/index.js";

const { Company } = db;

/**
 * CREATE Company
 */
export const createCompany = async (req, res) => {
  const { name, email, phone, address, status } = req.body || {};

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const company = await Company.create({ name, email, phone, address, status });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Companies
 */
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET Company by ID
 */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Company
 */
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    await company.update(req.body);
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Company
 */
export const deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Company not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
