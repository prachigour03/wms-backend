import { dashboardService } from "../services/dashboard.service.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const allowedRanges = ["7d", "30d", "90d"];
    const range = allowedRanges.includes(req.query.range)
      ? req.query.range
      : "30d";

    const data = await dashboardService(range);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
