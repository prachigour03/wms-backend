import db from "../../../../models/index.js";

const { VendorIssueMaterial, VendorIssueMaterialItem, sequelize } = db;

export const createVendorIssueMaterial = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, ...headerData } = req.body;
    const header = await VendorIssueMaterial.create(headerData, { transaction: t });
    if (items && items.length > 0) {
      const itemsWithId = items.map(item => ({ ...item, vendorIssueMaterialId: header.id }));
      await VendorIssueMaterialItem.bulkCreate(itemsWithId, { transaction: t });
    }
    await t.commit();
    const result = await VendorIssueMaterial.findByPk(header.id, { include: [{ model: VendorIssueMaterialItem, as: "items" }] });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorIssueMaterials = async (req, res) => {
  try {
    const results = await VendorIssueMaterial.findAll({ 
      include: [{ model: VendorIssueMaterialItem, as: "items" }],
      order: [["createdAt", "DESC"]] 
    });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorIssueMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await VendorIssueMaterial.findByPk(id, { include: [{ model: VendorIssueMaterialItem, as: "items" }] });
    if (!result) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVendorIssueMaterial = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { items, ...headerData } = req.body;
    const header = await VendorIssueMaterial.findByPk(id);
    if (!header || header.status !== "Draft") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Cannot update" });
    }
    await header.update(headerData, { transaction: t });
    if (items) {
      await VendorIssueMaterialItem.destroy({ where: { vendorIssueMaterialId: id }, transaction: t });
      if (items.length > 0) {
        const itemsWithId = items.map(item => ({ ...item, vendorIssueMaterialId: id }));
        await VendorIssueMaterialItem.bulkCreate(itemsWithId, { transaction: t });
      }
    }
    await t.commit();
    const result = await VendorIssueMaterial.findByPk(id, { include: [{ model: VendorIssueMaterialItem, as: "items" }] });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVendorIssueMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await VendorIssueMaterial.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot delete" });
    await header.destroy();
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmVendorIssueMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await VendorIssueMaterial.findByPk(id);
    if (!header || header.status !== "Draft") return res.status(400).json({ success: false, message: "Cannot confirm" });
    await header.update({ status: "Confirmed" });
    res.status(200).json({ success: true, message: "Confirmed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelVendorIssueMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await VendorIssueMaterial.findByPk(id);
    if (!header) return res.status(404).json({ success: false, message: "Not found" });
    await header.update({ status: "Cancelled" });
    res.status(200).json({ success: true, message: "Cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
