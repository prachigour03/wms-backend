import db from "../../../models/index.js";
import { Op, fn, col, literal, cast } from "sequelize";

const {
  User,
  OrderBooking,
  Customer,
  Item,
  InwardChallan,
  VendorIssueMaterial,
  MaterialConsumption,
  ReturnMaterial,
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
    totalRevenueRow,
    activeUsers,
    customersCount,
    ordersCount,
    inventoryCount,
  ] = await Promise.all([
    OrderBooking.findAll({
      attributes: [
        [fn("SUM", cast(col("finalRate"), "numeric")), "totalRevenue"],
      ],
      where: { createdAt: { [Op.gte]: startDate } },
      raw: true,
    }),
    User.count(),
    Customer.count({ where: { createdAt: { [Op.gte]: startDate } } }),
    OrderBooking.count({ where: { createdAt: { [Op.gte]: startDate } } }),
    Item.count({ where: { createdAt: { [Op.gte]: startDate } } }),
  ]);
  const totalRevenue = Number(totalRevenueRow?.[0]?.totalRevenue || 0);

  /* ================= REVENUE LINE CHART ================= */
  const revenueChart = await OrderBooking.findAll({
    attributes: [
      [
        fn(
          "TO_CHAR",
          fn("DATE_TRUNC", "month", col("createdAt")),
          "Mon"
        ),
        "period",
      ],
      [fn("SUM", cast(col("finalRate"), "numeric")), "revenue"],
    ],
    where: {
      createdAt: { [Op.gte]: startDate },
    },
    group: ["period"],
    order: [[literal('MIN("OrderBooking"."createdAt")'), "ASC"]],
    raw: true,
  });

  /* ================= ACTIVE USERS (NEW USERS OVER TIME) ================= */
  const activeUsersChart = await User.findAll({
    attributes: [
      [
        fn(
          "TO_CHAR",
          fn("DATE_TRUNC", "day", col("createdAt")),
          "YYYY-MM-DD"
        ),
        "period",
      ],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      createdAt: { [Op.gte]: startDate },
    },
    group: ["period"],
    order: [[literal('MIN("User"."createdAt")'), "ASC"]],
    raw: true,
  });

  /* ================= SALES BY CATEGORY ================= */
  const [
    inwardChallanCount,
    consumptionCount,
    issueMaterialCount,
    returnMaterialCount,
  ] = await Promise.all([
    InwardChallan.count({ where: { createdAt: { [Op.gte]: startDate } } }),
    MaterialConsumption.count({ where: { createdAt: { [Op.gte]: startDate } } }),
    VendorIssueMaterial.count({
      where: { createdAt: { [Op.gte]: startDate } },
    }),
    ReturnMaterial.count({ where: { createdAt: { [Op.gte]: startDate } } }),
  ]);

  /* ================= RECENT ORDERS ================= */
  const recentOrders = await OrderBooking.findAll({
    attributes: ["id", "tranditionId", "finalRate", "createdAt"],
    where: { createdAt: { [Op.gte]: startDate } },
    limit: 6,
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  return {
    stats: {
      totalRevenue,
      customers: customersCount,
      orders: ordersCount,
      inventory: inventoryCount,
      activeUsers,
      projects: 0,
    },
    revenueChart,
    activeUsersChart,
    inwardChallanCount,
    consumptionCount,
    issueMaterialCount,
    returnMaterialCount,
    recentOrders,
  };
};
