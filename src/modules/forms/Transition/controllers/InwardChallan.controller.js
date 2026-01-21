import db from "../../../../models/index.js";

const { InwardChallan } = db;

/**
 * CREATE Inward Challan
 */
export const createInwardChallan = async (req, res) => {
  const {
    challanNo,
    vendor,
    challanDate,
    itemName,
    quantity,
    warehouse,
    status,
  } = req.body || {};

  // Validation
  if (!challanNo || !vendor || !challanDate || !itemName || quantity == null || !warehouse) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  try {
    const challan = await InwardChallan.create({
      challanNo,
      vendor,
      challanDate,
      itemName,
      quantity,
      warehouse,
      status, // optional
    });

    res.status(201).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    // Unique challanNo error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Challan number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET All Inward Challans
 */
export const getInwardChallans = async (req, res) => {
  try {
    const challans = await InwardChallan.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: challans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE Inward Challan
 */
export const updateInwardChallan = async (req, res) => {
  try {
    const { id } = req.params;

    const challan = await InwardChallan.findByPk(id);
    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    await challan.update(req.body);

    res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE Inward Challan
 */
export const deleteInwardChallan = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await InwardChallan.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inward Challan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
