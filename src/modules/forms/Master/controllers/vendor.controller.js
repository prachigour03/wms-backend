import db from "../../../../models/index.js";

const { Vendor } = db;

/* ================= CREATE VENDOR ================= */
export const createVendor = async (req, res) => {
  try {
    const {
      vendorCode,
      vendorName,
      contactPerson,
      phone,
      email,
      gstNumber,
      address,
      status,
    } = req.body;

    // Required field validation
    if (!vendorCode || !vendorName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check duplicate vendor code
    const existingVendor = await Vendor.findOne({
      where: { vendorCode, isDeleted: false },
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor code already exists",
      });
    }

    const vendor = await Vendor.create({
      vendorCode,
      vendorName,
      contactPerson,
      phone,
      email,
      gstNumber,
      address,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

/* ================= GET ALL VENDORS ================= */
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      where: { isDeleted: false },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
};

/* ================= GET VENDOR BY ID ================= */
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findOne({
      where: { id, isDeleted: false },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor",
      error: error.message,
    });
  }
};

/* ================= UPDATE VENDOR ================= */
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findOne({
      where: { id, isDeleted: false },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await vendor.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update vendor",
      error: error.message,
    });
  }
};

/* ================= DELETE VENDOR (SOFT DELETE) ================= */
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findOne({
      where: { id, isDeleted: false },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await vendor.update({ isDeleted: true });

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
      error: error.message,
    });
  }
};
