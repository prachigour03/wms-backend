import db from "../../../models/index.js";
import { Op, fn, col, literal } from "sequelize";

const {
  User,
  Order,
  OrderItem,
  Activity,
  Task,
} = db;

const getDateRange = (range) => {
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const dashboardService = async (range) => {
  const startDate = getDateRange(range);

  /* ================= TOP STATS ================= */
  const [
    totalRevenue,
    activeUsers,
    totalProjects,
  ] = await Promise.all([
    Order?.sum("totalAmount", {
      where: { createdAt: { [Op.gte]: startDate } },
    }),
    User.count(),
    db.Project?.count() || 0,
  ]);

  /* ================= REVENUE LINE CHART ================= */
  const revenueChart = Order
    ? await Order.findAll({
        attributes: [
          [
            fn(
              "TO_CHAR",
              fn("DATE_TRUNC", "month", col("createdAt")),
              "Mon"
            ),
            "period",
          ],
          [fn("SUM", col("totalAmount")), "revenue"],
        ],
        where: {
          createdAt: { [Op.gte]: startDate },
        },
        group: ["period"],
        order: [[literal("MIN(createdAt)"), "ASC"]],
        raw: true,
      })
    : [];

  /* ================= SALES BY CATEGORY ================= */
  const salesByCategory = OrderItem
    ? await OrderItem.findAll({
        attributes: [
          "category",
          [fn("SUM", col("price")), "sales"],
        ],
        group: ["category"],
        raw: true,
      })
    : [];

  /* ================= TASK PROGRESS ================= */
  const taskProgress = Task
    ? await Task.findAll({
        attributes: ["name", "progress"],
        limit: 5,
        order: [["updatedAt", "DESC"]],
        raw: true,
      })
    : [];

  /* ================= RECENT ACTIVITIES ================= */
  const activities = Activity
    ? await Activity.findAll({
        attributes: ["title", "type", "createdAt"],
        limit: 5,
        order: [["createdAt", "DESC"]],
        raw: true,
      })
    : [];

  return {
    stats: {
      totalRevenue: totalRevenue || 0,
      activeUsers,
      projects: totalProjects,
      growth: 24.5,
    },
    revenueChart,          // ✅ FIXED
    salesByCategory,
    taskProgress: taskProgress.map(t => ({
      label: t.name,
      value: t.progress,
    })),
    activities: activities.map(a => ({
      title: a.title,
      type: a.type,
      time: a.createdAt,
    })),

    progress: taskProgress.map(t => ({
      label: t.name,
      value: t.progress,
    })),
  };
};
