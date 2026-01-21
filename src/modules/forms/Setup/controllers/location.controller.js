import db from "../../../../models/index.js";

const { Location } = db;

/**
 * GET ALL
 */
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CREATE
 */
export const createLocation = async (req, res) => {
  const { locationCode, locationName, subsidiary } = req.body || {};

  console.log(locationCode,locationName, subsidiary)

  if (!locationCode || !locationName || !subsidiary) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const location = await Location.create({
      locationCode,
      locationName,
      subsidiary,
    });
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE
 */
export const updateLocation = async (req, res) => {
  try {
    const [updated] = await Location.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE
 */
export const deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
