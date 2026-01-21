import db from "../../../../models/index.js";

const { ChartOfAccount } = db;

export const createChartOfAccount = async (req, res) => {
  try {
    const {
      accountName,
      accountCode,
      accountTypeId,
      parentAccountId,
      openingBalance = 0,
      status = "Active",
    } = req.body;

    if (!accountName || !accountCode || !accountTypeId) {
      return res.status(400).json({
        success: false,
        message: "Account Name, Code and Type are required",
      });
    }

    const existingCode = await ChartOfAccount.findOne({
      where: { accountCode },
    });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Account Code already exists",
      });
    }

    if (parentAccountId) {
      const parent = await ChartOfAccount.findByPk(parentAccountId);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent account not found",
        });
      }
    }

    const data = await ChartOfAccount.create({
      accountName,
      accountCode,
      accountTypeId,
      parentAccountId,
      openingBalance,
      status,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

/**
 * READ ALL
 */
export const getChartOfAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const data = await ChartOfAccount.findAndCountAll({
      include: ["accountType", "parentAccount"],
      limit: Number(limit),
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: data.count,
      data: data.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts",
    });
  }
};


/**
 * READ BY ID
 */
export const getChartOfAccountById = async (req, res) => {
  try {
    const data = await ChartOfAccount.findByPk(req.params.id, {
      include: ["accountType", "parentAccount"],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Chart Of Account not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};


/**
 * UPDATE
 */
export const updateChartOfAccount = async (req, res) => {
  try {
    const account = await ChartOfAccount.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Chart Of Account not found",
      });
    }

    await account.update(req.body);

    res.status(200).json({
      success: true,
      message: "Chart Of Account updated successfully",
      data: account,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/**
 * DELETE
 */
export const deleteChartOfAccount = async (req, res) => {
  try {
    const account = await ChartOfAccount.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Chart Of Account not found",
      });
    }

    await account.update({ status: "Inactive" });

    res.status(200).json({
      success: true,
      message: "Chart Of Account deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
