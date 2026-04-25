import db from "../../../../models/index.js";

const { InwardChallan, InwardChallanItem, sequelize } = db;

/**
 * CREATE Inward Challan
 */
export const createInwardChallan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, ...headerData } = req.body;

    const challan = await InwardChallan.create(headerData, { transaction: t });

    if (items && items.length > 0) {
      const itemsWithId = items.map((item) => ({
        ...item,
        inwardChallanId: challan.id,
      }));
      await InwardChallanItem.bulkCreate(itemsWithId, { transaction: t });
    }

    await t.commit();
    
    const result = await InwardChallan.findByPk(challan.id, {
      include: [{ model: InwardChallanItem, as: "items" }],
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Challan number already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET All Inward Challans
 */
export const getInwardChallans = async (req, res) => {
  try {
    const challans = await InwardChallan.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: challans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET Inward Challan By ID
 */
export const getInwardChallanById = async (req, res) => {
  try {
    const { id } = req.params;
    const challan = await InwardChallan.findByPk(id, {
      include: [{ model: InwardChallanItem, as: "items" }],
    });

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE Inward Challan
 */
export const updateInwardChallan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { items, ...headerData } = req.body;

    const challan = await InwardChallan.findByPk(id);
    if (!challan) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    if (challan.status !== "Draft") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Only Draft entries can be updated",
      });
    }

    await challan.update(headerData, { transaction: t });

    if (items) {
      // Simple approach: delete all and recreate
      await InwardChallanItem.destroy({
        where: { inwardChallanId: id },
        transaction: t,
      });

      if (items.length > 0) {
        const itemsWithId = items.map((item) => ({
          ...item,
          inwardChallanId: id,
        }));
        await InwardChallanItem.bulkCreate(itemsWithId, { transaction: t });
      }
    }

    await t.commit();

    const result = await InwardChallan.findByPk(id, {
      include: [{ model: InwardChallanItem, as: "items" }],
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE Inward Challan
 */
export const deleteInwardChallan = async (req, res) => {
  try {
    const { id } = req.params;
    const challan = await InwardChallan.findByPk(id);

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    if (challan.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft entries can be deleted",
      });
    }

    await challan.destroy();

    res.status(200).json({
      success: true,
      message: "Inward Challan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * CONFIRM Inward Challan
 */
export const confirmInwardChallan = async (req, res) => {
  try {
    const { id } = req.params;
    const challan = await InwardChallan.findByPk(id);

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    if (challan.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft entries can be confirmed",
      });
    }

    await challan.update({ status: "Confirmed" });

    res.status(200).json({
      success: true,
      message: "Inward Challan confirmed successfully",
      data: challan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * CANCEL Inward Challan
 */
export const cancelInwardChallan = async (req, res) => {
  try {
    const { id } = req.params;
    const challan = await InwardChallan.findByPk(id);

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Inward Challan not found",
      });
    }

    if (challan.status === "Cancelled") {
        return res.status(400).json({
          success: false,
          message: "Already cancelled",
        });
    }

    await challan.update({ status: "Cancelled" });

    res.status(200).json({
      success: true,
      message: "Inward Challan cancelled successfully",
      data: challan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
