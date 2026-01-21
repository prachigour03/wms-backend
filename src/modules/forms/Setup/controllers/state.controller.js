import db from "../../../../models/index.js";

const { State } = db;

/**
 * CREATE State
 */
export const createState = async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: "Name and Code are required",
    });
  }

  try {
    const state = await State.create({ name, code });
    res.status(201).json({
      success: true,
      data: state,
      message: "State created successfully",
    });
  } catch (error) {
    // Handle unique constraint error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "State name or code must be unique",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL States
 */
export const getStates = async (req, res) => {
  try {
    const states = await State.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: states,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE State by ID
 */
export const getStateById = async (req, res) => {
  try {
    const state = await State.findByPk(req.params.id);

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    res.status(200).json({
      success: true,
      data: state,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE State
 */
export const updateState = async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: "Name and Code are required",
    });
  }

  try {
    const state = await State.findByPk(req.params.id);

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    await state.update({ name, code });

    res.status(200).json({
      success: true,
      message: "State updated successfully",
      data: state,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "State name or code must be unique",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE State
 */
export const deleteState = async (req, res) => {
  try {
    const deleted = await State.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    res.status(200).json({
      success: true,
      message: "State deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
