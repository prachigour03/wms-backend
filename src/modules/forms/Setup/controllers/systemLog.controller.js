import db from "../../../../models/index.js";

const { SystemLog } = db;

/**
 * CREATE LOG
 */
export const createSystemLog = async (req, res) => {
  try {
    const {
      user,
      module,
      action,
      level,
      ip,
      recordId,
      changedFields,
      status,
      durationMs,
      duration,
    } = req.body;

    const normalizedLevel = level || "Info";
    const normalizedStatus =
      status ||
      (normalizedLevel === "Error"
        ? "ERROR"
        : normalizedLevel === "Warning"
          ? "WARNING"
          : "SUCCESS");

    let normalizedDurationMs = durationMs;
    if (normalizedDurationMs == null && duration != null) {
      const asNumber = Number(duration);
      if (!Number.isNaN(asNumber)) {
        normalizedDurationMs = asNumber;
      }
    }

    const log = await SystemLog.create({
      user,
      module,
      action,
      recordId,
      changedFields,
      level: normalizedLevel,
      status: normalizedStatus,
      durationMs: normalizedDurationMs,
      ip,
      date: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "System log created successfully",
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL LOGS (with filters)
 */
export const getSystemLogs = async (req, res) => {
  try {
    const { user, level } = req.query;

    const where = {};
    if (user) where.user = user;
    if (level) where.level = level;

    const logs = await SystemLog.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE LOG
 */
export const deleteSystemLog = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SystemLog.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ success: true, message: "Log deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
