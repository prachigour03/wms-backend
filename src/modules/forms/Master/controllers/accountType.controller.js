import db from "../../../../models/index.js";

const { AccountType } = db;

/**
 * CREATE Account Type
 */
export const createAccountType = async (req, res) => {
  const { accountTypeName, accountCode, description, status } = req.body;

  if (!accountTypeName || !accountCode) {
    return res
      .status(400)
      .json({ success: false, message: "Account Type Name and Code are required" });
  }

  try {
    const data = await AccountType.create({
      accountTypeName,
      accountCode,
      description,
      status,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ ALL
 */
export const getAccountTypes = async (req, res) => {
  try {
    const data = await AccountType.findAll({
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * READ BY ID
 */
export const getAccountTypeById = async (req, res) => {
  try {
    const data = await AccountType.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Account Type not found" });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE
 */
export const updateAccountType = async (req, res) => {
  try {
    const [updated] = await AccountType.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res.status(404).json({ success: false, message: "Account Type not found" });

    res.status(200).json({
      success: true,
      message: "Account Type updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE
 */
export const deleteAccountType = async (req, res) => {
  try {
    const deleted = await AccountType.destroy({
      where: { id: req.params.id },
    });

    if (!deleted)
      return res.status(404).json({ success: false, message: "Account Type not found" });

    res.status(200).json({
      success: true,
      message: "Account Type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
