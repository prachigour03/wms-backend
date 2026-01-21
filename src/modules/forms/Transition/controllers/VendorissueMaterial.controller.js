import db from "../../../../models/index.js";

const { VendorIssueMaterial } = db;

/**
 * CREATE Vendor Issue Material
 */
export const createVendorIssueMaterial = async (req, res) => {
  const { issueNo, issueDate, vendorName, materialName, quantity, unit, status } = req.body || {};

  if (!issueNo || !issueDate || !vendorName || !materialName || quantity == null || !unit) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    const record = await VendorIssueMaterial.create({
      issueNo,
      issueDate,
      vendorName,
      materialName,
      quantity,
      unit,
      status,
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Issue number already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Vendor Issue Materials
 */
export const getVendorIssueMaterials = async (req, res) => {
  try {
    const records = await VendorIssueMaterial.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET by ID
 */
export const getVendorIssueMaterialById = async (req, res) => {
  try {
    const record = await VendorIssueMaterial.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE
 */
export const updateVendorIssueMaterial = async (req, res) => {
  try {
    const record = await VendorIssueMaterial.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });

    await record.update(req.body);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE
 */
export const deleteVendorIssueMaterial = async (req, res) => {
  try {
    const deleted = await VendorIssueMaterial.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Record not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
