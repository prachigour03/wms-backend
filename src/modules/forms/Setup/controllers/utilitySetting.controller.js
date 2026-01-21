import db from "../../../../models/index.js";

const { UtilitySetting } = db;

/**
 * UPSERT SINGLE SETTING (key-value)
 */
export const upsertUtilitySetting = async (req, res) => {
  const { key, value } = req.body;

  if (!key) {
    return res.status(400).json({
      success: false,
      message: "Setting key is required",
    });
  }

  try {
    const [setting, created] = await UtilitySetting.findOrCreate({
      where: { key },
      defaults: { value },
    });

    if (!created) {
      await setting.update({ value });
    }

    res.status(200).json({
      success: true,
      message: created ? "Setting created successfully" : "Setting updated successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Upsert utility setting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save setting",
    });
  }
};

export const upsertBulkUtilitySettings = async (req, res) => {
  try {
    const entries = Object.entries(req.body);

    for (const [key, value] of entries) {
      await UtilitySetting.upsert({ key, value });
    }

    res.status(200).json({
      success: true,
      message: "Utility settings updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upsertMultipleUtilitySettings = async (req, res) => {
  const settings = req.body;

  if (!settings || typeof settings !== "object") {
    return res.status(400).json({
      success: false,
      message: "Invalid settings payload",
    });
  }

  try {
    const operations = Object.entries(settings).map(
      async ([key, value]) => {
        const [setting, created] = await UtilitySetting.findOrCreate({
          where: { key },
          defaults: { value },
        });

        if (!created) {
          await setting.update({ value });
        }

        return setting;
      }
    );

    const results = await Promise.all(operations);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: results,
    });
  } catch (error) {
    console.error("Bulk settings update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

/**
 * GET ALL SETTINGS
 */
export const getUtilitySettings = async (req, res) => {
  try {
    const settings = await UtilitySetting.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get utility settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

/**
 * GET SETTING BY KEY
 */
export const getUtilitySettingByKey = async (req, res) => {
  try {
    const setting = await UtilitySetting.findOne({
      where: { key: req.params.key },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("Get setting by key error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch setting",
    });
  }
};

/**
 * DELETE SETTING BY KEY
 */
export const deleteUtilitySetting = async (req, res) => {
  try {
    const deleted = await UtilitySetting.destroy({
      where: { key: req.params.key },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error("Delete utility setting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete setting",
    });
  }
};
