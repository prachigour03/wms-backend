import db from "../../../../models/index.js";

const { City } = db;

/**
 * CREATE a City
 */
export const createCity = async (req, res) => {
  const { cityName, stateName, stateCode } = req.body || {};

  if (!cityName || !stateName || !stateCode) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const city = await City.create({ cityName, stateName, stateCode });
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Cities
 */
export const getCities = async (req, res) => {
  try {
    const cities = await City.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET City by ID
 */
export const getCityById = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: "City not found" });
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE City
 */
export const updateCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: "City not found" });

    await city.update(req.body);
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE City
 */
export const deleteCity = async (req, res) => {
  try {
    const deleted = await City.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "City not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
