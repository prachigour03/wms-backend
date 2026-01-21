import db from "../../../../models/index.js";

const { Customer } = db;

/**
 * CREATE Customer
 */
export const createCustomer = async (req, res) => {
  const { customerName, customerCode, mobile, email, address, status } = req.body;

  if (!customerName || !customerCode || !mobile || !email) {
    return res.status(400).json({
      success: false,
      message: "Customer Name, Code, Mobile and Email are required",
    });
  }

  try {
    const customer = await Customer.create({
      customerName,
      customerCode,
      mobile,
      email,
      address,
      status,
    });

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ ALL Customers
 */
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ Customer BY ID
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.update(req.body);

    res.status(200).json({
      success: true,
      data: customer, // ✅ IMPORTANT
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { id: req.params.id },
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: error.errors[0].message,
    });
  }
  res.status(500).json({ success: false, message: error.message });
}

};
