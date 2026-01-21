import db from "../../../../models/index.js";

const { Subsidiary } = db;

/**
 * CREATE Subsidiary
 */
export const createSubsidiary = async (req, res) => {
  const {
    name,
    currency,
    parentSubsidiary,
    state,
    gstNumber,
    validFrom,
    address,
    status,
  } = req.body;

  if (!name || !currency || !state || !validFrom) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing",
    });
  }

  try {
    const data = await Subsidiary.create({
      name,
      currency,
      parentSubsidiary,
      state,
      gstNumber,
      validFrom,
      address,
      status,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Subsidiaries
 */
export const getSubsidiaries = async (req, res) => {
  try {
    const data = await Subsidiary.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET Subsidiary by ID
 */
export const getSubsidiaryById = async (req, res) => {
  try {
    const data = await Subsidiary.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Subsidiary not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Subsidiary
 */
export const updateSubsidiary = async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByPk(req.params.id);

    if (!subsidiary) {
      return res.status(404).json({
        success: false,
        message: "Subsidiary not found",
      });
    }

    await subsidiary.update(req.body);

    res.status(200).json({ success: true, data: subsidiary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Subsidiary
 */
export const deleteSubsidiary = async (req, res) => {
  try {
    const deleted = await Subsidiary.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subsidiary not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
