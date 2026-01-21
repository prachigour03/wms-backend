import db from "../../../../models/index.js";

const { ItemGroup } = db;

/**
 * CREATE Item Group
 */
export const createItemGroup = async (req, res) => {
  const { groupCode, groupName, description, status } = req.body;

  if (!groupCode || !groupName) {
    return res.status(400).json({
      success: false,
      message: "Group Code and Group Name are required",
    });
  }

  try {
    const itemGroup = await ItemGroup.create({
      groupCode,
      groupName,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Item Group created successfully",
      data: itemGroup,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Group Code already exists",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ ALL Item Groups
 */
export const getItemGroups = async (req, res) => {
  try {
    const groups = await ItemGroup.findAll({
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ Item Group BY ID
 */
export const getItemGroupById = async (req, res) => {
  try {
    const group = await ItemGroup.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Item Group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Item Group
 */
export const updateItemGroup = async (req, res) => {
  try {
    const [updated] = await ItemGroup.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Item Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item Group updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Item Group
 */
export const deleteItemGroup = async (req, res) => {
  try {
    const deleted = await ItemGroup.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item Group not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
