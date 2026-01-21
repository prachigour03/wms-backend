import db from "../../../../models/index.js";

const { Warehouse } = db;

/* ================= CREATE WAREHOUSE ================= */
export const createWarehouse = async (req, res) => {
  try {
    const {
      warehouseCode,
      warehouseName,
      location,
      incharge,
      contactNo,
      address,
      status,
    } = req.body;

    // basic validation
    if (!warehouseCode || !warehouseName || !location || !contactNo) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // check duplicate code
    const existing = await Warehouse.findOne({
      where: { warehouseCode, isDeleted: false },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Warehouse code already exists",
      });
    }

    const warehouse = await Warehouse.create({
      warehouseCode,
      warehouseName,
      location,
      incharge,
      contactNo,
      address,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create warehouse",
      error: error.message,
    });
  }
};

/* ================= GET ALL WAREHOUSES ================= */
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      where: { isDeleted: false },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch warehouses",
      error: error.message,
    });
  }
};

/* ================= GET WAREHOUSE BY ID ================= */
export const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOne({
      where: { id, isDeleted: false },
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch warehouse",
      error: error.message,
    });
  }
};

/* ================= UPDATE WAREHOUSE ================= */
export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOne({
      where: { id, isDeleted: false },
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    await warehouse.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update warehouse",
      error: error.message,
    });
  }
};

/* ================= DELETE WAREHOUSE (SOFT DELETE) ================= */
export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findOne({
      where: { id, isDeleted: false },
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    await warehouse.update({ isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete warehouse",
      error: error.message,
    });
  }
};
