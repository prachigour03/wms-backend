import db from "../../../../models/index.js";

const { ReturnMaterial } = db;

/**
 * CREATE Return Material
 */
export const createReturnMaterial = async (req, res) => {
  const { returnNo, date, itemName, quantity, returnedFrom, warehouse, reason } =
    req.body || {};

  if (!returnNo || !date || !itemName || quantity == null || !returnedFrom || !warehouse) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  try {
    const material = await ReturnMaterial.create({
      returnNo,
      date,
      itemName,
      quantity,
      returnedFrom,
      warehouse,
      reason,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Return number already exists",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET All
 */
export const getReturnMaterials = async (req, res) => {
  try {
    const data = await ReturnMaterial.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET BY ID
 */
export const getReturnMaterialById = async (req, res) => {
  try {
    const record = await ReturnMaterial.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE
 */
export const updateReturnMaterial = async (req, res) => {
  try {
    const record = await ReturnMaterial.findByPk(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Not found" });

    await record.update(req.body);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE
 */
export const deleteReturnMaterial = async (req, res) => {
  try {
    const deleted = await ReturnMaterial.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
