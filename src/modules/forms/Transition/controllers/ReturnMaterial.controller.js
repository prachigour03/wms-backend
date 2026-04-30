import db from "../../../../models/index.js";

const { ReturnMaterial, ReturnMaterialItem, sequelize } = db;

export const createReturnMaterial = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, ...headerData } = req.body;
    const header = await ReturnMaterial.create(headerData, { transaction: t });
    if (items && items.length > 0) {
      const itemsWithId = items.map(item => ({ ...item, returnMaterialId: header.id }));
      await ReturnMaterialItem.bulkCreate(itemsWithId, { transaction: t });
    }
    await t.commit();
    const result = await ReturnMaterial.findByPk(header.id, { include: [{ model: ReturnMaterialItem, as: "items" }] });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReturnMaterials = async (req, res) => {
  try {
    const results = await ReturnMaterial.findAll({ 
      include: [{ model: ReturnMaterialItem, as: "items" }],
      order: [["createdAt", "DESC"]] 
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReturnMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ReturnMaterial.findByPk(id, { include: [{ model: ReturnMaterialItem, as: "items" }] });
    if (!result) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReturnMaterial = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { items, ...headerData } = req.body;
    const header = await ReturnMaterial.findByPk(id);
    if (!header || header.status !== "Draft") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Cannot update" });
    }
    await header.update(headerData, { transaction: t });
    if (items) {
      await ReturnMaterialItem.destroy({ where: { returnMaterialId: id }, transaction: t });
      if (items.length > 0) {
        const itemsWithId = items.map(item => ({ ...item, returnMaterialId: id }));
        await ReturnMaterialItem.bulkCreate(itemsWithId, { transaction: t });
      }
    }
    await t.commit();
    const result = await ReturnMaterial.findByPk(id, { include: [{ model: ReturnMaterialItem, as: "items" }] });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReturnMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await ReturnMaterial.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot delete" });
    await header.destroy();
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmReturnMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await ReturnMaterial.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot confirm" });
    await header.update({ status: "Confirmed" });
    res.status(200).json({ success: true, message: "Confirmed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelReturnMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await ReturnMaterial.findByPk(id);
    if (!header) return res.status(404).json({ success: false, message: "Not found" });
    await header.update({ status: "Cancelled" });
    res.status(200).json({ success: true, message: "Cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
