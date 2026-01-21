import db from "../../../../models/index.js";

const { Currency } = db;

/**
 * CREATE Currency
 */
export const createCurrency = async (req, res) => {
  const { code, name, symbol, country, decimals, status } = req.body;

  if (!code || !name || !symbol || decimals === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Required fields missing" });
  }

  try {
    const currency = await Currency.create({
      code,
      name,
      symbol,
      country,
      decimals,
      status: status || "Active",
    });

    res.status(201).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET all Currencies
 */
export const getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: currencies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET Currency by ID
 */
export const getCurrencyById = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id);

    if (!currency) {
      return res
        .status(404)
        .json({ success: false, message: "Currency not found" });
    }

    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Currency
 */
export const updateCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id);

    if (!currency) {
      return res
        .status(404)
        .json({ success: false, message: "Currency not found" });
    }

    await currency.update(req.body);

    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Currency
 */
export const deleteCurrency = async (req, res) => {
  try {
    const deleted = await Currency.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Currency not found" });
    }

    res.status(200).json({ success: true, message: "Currency deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
