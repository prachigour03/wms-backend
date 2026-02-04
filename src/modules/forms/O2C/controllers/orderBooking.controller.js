import db from "../../../../models/index.js";

const { OrderBooking } = db;

/* ===================== CREATE ORDER ===================== */
export const createOrder = async (req, res) => {
  try {
    const { tranditionId, customer, itemName, date, location, finalRate } = req.body;

    // Validation
    if (!tranditionId || !customer || !itemName) {
      return res.status(400).json({
        success: false,
        message: "tranditionId, customer, and itemName are required",
      });
    }

    const order = await OrderBooking.create({
      tranditionId,
      customer,
      itemName,
      date,
      location,
      finalRate,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================== GET ALL ORDERS ===================== */
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderBooking.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================== GET ORDER BY ID ===================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderBooking.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================== UPDATE ORDER ===================== */
export const updateOrder = async (req, res) => {
  try {
    const { tranditionId, customer, itemName, date, location, finalRate } = req.body;

    const order = await OrderBooking.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.update({
      tranditionId,
      customer,
      itemName,
      date,
      location,
      finalRate,
    });

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================== DELETE ORDER ===================== */
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderBooking.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.destroy();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
