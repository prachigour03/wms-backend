import db from "../../../../models/index.js";

const { InventoryCount } = db;

/* ================= CREATE ================= */
export const createInventoryCount = async (req, res) => {
  try {
    const {
      itemCode,
      itemName,
      warehouse,
      systemQty,
      countedQty,
      countDate,
      status = true,
    } = req.body || {};

    if (
      !itemCode ||
      !itemName ||
      !warehouse ||
      systemQty == null ||
      countedQty == null ||
      !countDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const data = await InventoryCount.create({
      itemCode,
      itemName,
      warehouse,
      systemQty: Number(systemQty),
      countedQty: Number(countedQty),
      countDate,
      status,
    });

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= READ ================= */
export const getInventoryCounts = async (req, res) => {
  try {
    const data = await InventoryCount.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateInventoryCount = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await InventoryCount.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    const {
      itemCode,
      itemName,
      warehouse,
      systemQty,
      countedQty,
      countDate,
      status,
    } = req.body;

    await record.update({
      itemCode,
      itemName,
      warehouse,
      systemQty: systemQty != null ? Number(systemQty) : record.systemQty,
      countedQty: countedQty != null ? Number(countedQty) : record.countedQty,
      countDate,
      status,
    });

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteInventoryCount = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await InventoryCount.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
