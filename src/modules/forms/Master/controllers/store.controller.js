import db from "../../../../models/index.js";

const { Store } = db;

export const createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: stores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Store.update(req.body, { where: { id } });
    if (updated) {
      const updatedStore = await Store.findByPk(id);
      return res.status(200).json({ success: true, data: updatedStore });
    }
    throw new Error("Store not found");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.destroy({ where: { id } });
    if (deleted) {
      return res.status(200).json({ success: true, message: "Store deleted" });
    }
    throw new Error("Store not found");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
