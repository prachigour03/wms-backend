import db from "../../../../models/index.js";

const { Item } = db;

/**
 * CREATE Item
 */
export const createItem = async (req, res) => {
  const { itemName, itemCode, itemGroupId, status } = req.body;

  // Validation
  if (!itemName || !itemCode || !itemGroupId) {
    return res.status(400).json({
      success: false,
      message: "Item Name, Item Code, and Item Group are required",
    });
  }

  try {
    const data = await Item.create({
      itemName,
      itemCode,
      itemGroupId,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data,
    });
  } catch (error) {
    // Handle unique constraint
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Item Code already exists",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ ALL Items
 */
export const getItems = async (req, res) => {
  try {
    const data = await Item.findAll({
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ Item BY ID
 */
export const getItemById = async (req, res) => {
  try {
    const data = await Item.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Item
 */
export const updateItem = async (req, res) => {
  try {
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account Type updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Item
 */
export const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
