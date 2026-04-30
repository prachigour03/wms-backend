import db from "../../../../models/index.js";

const { MaterialConsumption, MaterialConsumptionItem, sequelize } = db;

export const createMaterialConsumption = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, ...headerData } = req.body;
    const header = await MaterialConsumption.create(headerData, { transaction: t });
    if (items && items.length > 0) {
      const itemsWithId = items.map(item => ({ ...item, materialConsumptionId: header.id }));
      await MaterialConsumptionItem.bulkCreate(itemsWithId, { transaction: t });
    }
    await t.commit();
    const result = await MaterialConsumption.findByPk(header.id, { include: [{ model: MaterialConsumptionItem, as: "items" }] });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMaterialConsumptions = async (req, res) => {
  try {
    const results = await MaterialConsumption.findAll({ 
      include: [{ model: MaterialConsumptionItem, as: "items" }],
      order: [["createdAt", "DESC"]] 
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMaterialConsumptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MaterialConsumption.findByPk(id, { include: [{ model: MaterialConsumptionItem, as: "items" }] });
    if (!result) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMaterialConsumption = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { items, ...headerData } = req.body;
    const header = await MaterialConsumption.findByPk(id);
    if (!header || header.status !== "Draft") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Cannot update" });
    }
    await header.update(headerData, { transaction: t });
    if (items) {
      await MaterialConsumptionItem.destroy({ where: { materialConsumptionId: id }, transaction: t });
      if (items.length > 0) {
        const itemsWithId = items.map(item => ({ ...item, materialConsumptionId: id }));
        await MaterialConsumptionItem.bulkCreate(itemsWithId, { transaction: t });
      }
    }
    await t.commit();
    const result = await MaterialConsumption.findByPk(id, { include: [{ model: MaterialConsumptionItem, as: "items" }] });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMaterialConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await MaterialConsumption.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot delete" });
    await header.destroy();
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmMaterialConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await MaterialConsumption.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot confirm" });
    await header.update({ status: "Confirmed" });
    res.status(200).json({ success: true, message: "Confirmed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelMaterialConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await MaterialConsumption.findByPk(id);
    if (!header) return res.status(404).json({ success: false, message: "Not found" });
    await header.update({ status: "Cancelled" });
    res.status(200).json({ success: true, message: "Cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
