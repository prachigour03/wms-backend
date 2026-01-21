import db from "../../../../models/index.js";

const { VendorBill } = db;

/**
 * CREATE Vendor Bill
 */
export const createVendorBill = async (req, res) => {
  const {
    billNo,
    billDate,
    vendorName,
    invoiceNo,
    invoiceDate,
    amount,
    gstAmount,
    totalAmount,
    status,
  } = req.body || {};

  // Validate required fields
  if (
    !billNo ||
    !billDate ||
    !vendorName ||
    !invoiceNo ||
    !invoiceDate ||
    amount == null ||
    gstAmount == null ||
    totalAmount == null
  ) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    const bill = await VendorBill.create({
      billNo,
      billDate,
      vendorName,
      invoiceNo,
      invoiceDate,
      amount,
      gstAmount,
      totalAmount,
      status,
    });
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ success: false, message: "Bill number already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Vendor Bills
 */
export const getVendorBills = async (req, res) => {
  try {
    const bills = await VendorBill.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET Vendor Bill by ID
 */
export const getVendorBillById = async (req, res) => {
  try {
    const bill = await VendorBill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: "Vendor Bill not found" });
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Vendor Bill
 */
export const updateVendorBill = async (req, res) => {
  try {
    const bill = await VendorBill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: "Vendor Bill not found" });

    await bill.update(req.body);
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Vendor Bill
 */
export const deleteVendorBill = async (req, res) => {
  try {
    const deleted = await VendorBill.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Vendor Bill not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
