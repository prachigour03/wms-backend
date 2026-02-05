import db from "../../../../models/index.js";

const { MaterialConsumption } = db;

/**
 * CREATE Material Consumption
 */
export const createMaterialConsumption = async (req, res) => {
  const {
    consumptionNo,
    date,
    type,
    vendorEmployee,
    workOrder,
    site,
    totalAmount,
    status,
    itemName,
    quantity,
    department,
    warehouse,
    remarks,
  } = req.body || {};

  // Validation
  if (
    !consumptionNo ||
    !date ||
    !itemName ||
    quantity == null ||
    !department ||
    !warehouse
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  try {
    const consumption = await MaterialConsumption.create({
      consumptionNo,
      date,
      type,
      vendorEmployee,
      workOrder,
      site,
      totalAmount,
      status,
      itemName,
      quantity,
      department,
      warehouse,
      remarks,
    });

    res.status(201).json({
      success: true,
      data: consumption,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Consumption number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET All Material Consumptions
 */
export const getMaterialConsumptions = async (req, res) => {
  try {
    const data = await MaterialConsumption.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET Material Consumption By ID
 */
export const getMaterialConsumptionById = async (req, res) => {
  try {
    const record = await MaterialConsumption.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Material Consumption not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE Material Consumption
 */
export const updateMaterialConsumption = async (req, res) => {
  try {
    const record = await MaterialConsumption.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Material Consumption not found",
      });
    }

    await record.update(req.body);

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE Material Consumption
 */
export const deleteMaterialConsumption = async (req, res) => {
  try {
    const deleted = await MaterialConsumption.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Material Consumption not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Material Consumption deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
