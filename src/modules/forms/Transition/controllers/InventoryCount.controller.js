import db from "../../../../models/index.js";

const {
  InwardChallan,
  InwardChallanItem,
  VendorIssueMaterial,
  VendorIssueMaterialItem,
  MaterialConsumption,
  MaterialConsumptionItem,
  ReturnMaterial,
  ReturnMaterialItem,
} = db;

const DEFAULT_LOW_STOCK_THRESHOLD = Number(process.env.INVENTORY_LOW_STOCK_THRESHOLD || 10);

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const round2 = (value) => Number(toNumber(value).toFixed(2));

const normalizeText = (value) => String(value || "").trim();

const makeAggregateKey = (row) =>
  [
    row.itemCode,
    row.itemName,
    row.workOrderNo,
    row.customer,
    row.workCategory,
    row.materialStatus,
    row.lotNumber,
    row.store,
    row.city,
    row.site,
  ]
    .map(normalizeText)
    .join("||");

const getStockStatus = (quantity, threshold) => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= threshold) return "Low Stock";
  return "In Stock";
};

const getInventoryAgeDays = (dateValue) => {
  if (!dateValue) return 0;
  const updatedAt = new Date(dateValue);
  if (Number.isNaN(updatedAt.getTime())) return 0;
  const diff = Date.now() - updatedAt.getTime();
  if (diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const normalizeIssueQuantity = (item) => {
  const qtyIssued = toNumber(item?.qtyIssued);
  if (qtyIssued > 0) return qtyIssued;
  return toNumber(item?.quantity);
};

const buildInventoryRows = (inwardDocs, issueDocs, consumptionDocs, returnDocs, threshold) => {
  const grouped = new Map();

  const upsertMovement = ({
    itemCode = "",
    itemName = "",
    workOrderNo = "",
    customer = "",
    workCategory = "",
    materialStatus = "",
    lotNumber = "",
    store = "",
    city = "",
    site = "",
    quantityDelta = 0,
    rate = 0,
    updatedAt,
  }) => {
    const baseRow = {
      itemCode: normalizeText(itemCode),
      itemName: normalizeText(itemName),
      workOrderNo: normalizeText(workOrderNo),
      customer: normalizeText(customer),
      workCategory: normalizeText(workCategory),
      materialStatus: normalizeText(materialStatus),
      lotNumber: normalizeText(lotNumber),
      store: normalizeText(store),
      city: normalizeText(city),
      site: normalizeText(site),
    };

    const key = makeAggregateKey(baseRow);
    const eventTs = updatedAt ? new Date(updatedAt).getTime() : 0;
    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        ...baseRow,
        quantity: toNumber(quantityDelta),
        rate: toNumber(rate),
        lastUpdatedTs: eventTs,
      });
      return;
    }

    existing.quantity += toNumber(quantityDelta);
    if (eventTs >= (existing.lastUpdatedTs || 0)) {
      existing.rate = toNumber(rate);
      existing.lastUpdatedTs = eventTs;
    }
  };

  inwardDocs.forEach((header) => {
    const items = Array.isArray(header.items) ? header.items : [];
    items.forEach((item) => {
      const quantityDelta = toNumber(item?.quantity);
      if (quantityDelta === 0) return;
      upsertMovement({
        itemCode: item?.itemCode,
        itemName: item?.itemName,
        workOrderNo: item?.workOrderNo || header?.workOrderNo,
        customer: header?.customer,
        workCategory: item?.workCategory,
        materialStatus: item?.materialStatus,
        lotNumber: item?.lotNumber,
        store: item?.store || header?.store,
        city: header?.city,
        site: header?.site,
        quantityDelta,
        rate: item?.rate,
        updatedAt: item?.updatedAt || header?.updatedAt,
      });
    });
  });

  issueDocs.forEach((header) => {
    const items = Array.isArray(header.items) ? header.items : [];
    items.forEach((item) => {
      const issuedQty = normalizeIssueQuantity(item);
      if (issuedQty === 0) return;
      upsertMovement({
        itemCode: item?.itemCode,
        itemName: item?.itemName,
        workOrderNo: item?.workOrderNo,
        customer: header?.customer,
        workCategory: item?.workCategory,
        materialStatus: item?.materialStatus,
        lotNumber: item?.lotNumber,
        store: item?.store || header?.store,
        city: header?.city,
        site: header?.site,
        quantityDelta: -issuedQty,
        rate: item?.rate,
        updatedAt: item?.updatedAt || header?.updatedAt,
      });
    });
  });

  consumptionDocs.forEach((header) => {
    const items = Array.isArray(header.items) ? header.items : [];
    items.forEach((item) => {
      const quantityDelta = toNumber(item?.quantity);
      if (quantityDelta === 0) return;
      upsertMovement({
        itemCode: item?.itemCode,
        itemName: item?.itemName,
        workOrderNo: item?.workOrderNo,
        customer: "", // MaterialConsumption doesn't have customer
        workCategory: item?.workCategory,
        materialStatus: item?.materialStatus,
        lotNumber: item?.lotNumber,
        store: item?.store || header?.store,
        city: header?.city,
        site: header?.site,
        quantityDelta: -quantityDelta,
        rate: item?.rate,
        updatedAt: item?.updatedAt || header?.updatedAt,
      });
    });
  });

  returnDocs.forEach((header) => {
    const items = Array.isArray(header.items) ? header.items : [];
    items.forEach((item) => {
      const returnedQty = toNumber(item?.quantity);
      if (returnedQty === 0) return;
      upsertMovement({
        itemCode: item?.itemCode,
        itemName: item?.itemName,
        workOrderNo: item?.workOrderNo,
        customer: "", // ReturnMaterial doesn't have customer
        workCategory: item?.workCategory,
        materialStatus: item?.materialStatus,
        lotNumber: item?.lotNumber,
        store: item?.store || header?.store,
        city: header?.city,
        site: header?.site,
        quantityDelta: returnedQty,
        rate: item?.rate,
        updatedAt: item?.updatedAt || header?.updatedAt,
      });
    });
  });

  return Array.from(grouped.values())
    .map((entry) => {
      const quantity = round2(entry.quantity);
      const rate = round2(entry.rate);
      const amount = round2(quantity * rate);
      const inventoryAgeDays = getInventoryAgeDays(entry.lastUpdatedTs);
      return {
        itemCode: entry.itemCode,
        itemName: entry.itemName,
        workOrderNo: entry.workOrderNo,
        customer: entry.customer,
        workCategory: entry.workCategory,
        materialStatus: entry.materialStatus,
        lotNumber: entry.lotNumber,
        quantity,
        rate,
        amount,
        store: entry.store,
        city: entry.city,
        site: entry.site,
        status: getStockStatus(quantity, threshold),
        inventoryAgeDays,
        lastUpdated: entry.lastUpdatedTs ? new Date(entry.lastUpdatedTs).toISOString() : null,
      };
    })
    .sort((a, b) => {
      const aTs = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const bTs = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      if (aTs !== bTs) return bTs - aTs;
      return (a.itemCode || "").localeCompare(b.itemCode || "");
    });
};

const summarizeInventoryRows = (rows, threshold) => {
  const itemsInInventory = rows.filter((row) => row.quantity > 0).length;
  const totalInventoryQuantity = round2(
    rows.reduce((sum, row) => sum + toNumber(row.quantity), 0)
  );
  const itemsBelowThreshold = rows.filter(
    (row) => row.quantity > 0 && row.quantity <= threshold
  ).length;
  const itemsOutOfStock = rows.filter((row) => row.quantity <= 0).length;

  return {
    inventoryCount: rows.length,
    itemsInInventory,
    totalInventoryQuantity,
    itemsBelowThreshold,
    itemsOutOfStock,
    lowStockThreshold: threshold,
  };
};

/* ================= CREATE ================= */
export const createInventoryCount = async (req, res) => {
  return res.status(405).json({
    success: false,
    message:
      "Inventory is auto-calculated from confirmed Inward Challan, Vendor Issue Material, and Return Material entries.",
  });
};

/* ================= READ ================= */
export const getInventoryCounts = async (req, res) => {
  try {
    const inwardDocs = await InwardChallan.findAll({
      where: { status: "Confirmed" },
      attributes: ["id", "customer", "workOrderNo", "store", "city", "site", "updatedAt"],
      include: [
        {
          model: InwardChallanItem,
          as: "items",
          attributes: [
            "itemCode",
            "itemName",
            "workOrderNo",
            "workCategory",
            "materialStatus",
            "lotNumber",
            "store",
            "quantity",
            "rate",
            "updatedAt",
          ],
          required: false,
        },
      ],
    });

    const issueDocs = await VendorIssueMaterial.findAll({
      where: { status: "Confirmed" },
      attributes: ["id", "customer", "store", "city", "site", "updatedAt"],
      include: [
        {
          model: VendorIssueMaterialItem,
          as: "items",
          attributes: [
            "itemCode",
            "itemName",
            "workOrderNo",
            "workCategory",
            "materialStatus",
            "lotNumber",
            "store",
            "qtyIssued",
            "quantity",
            "rate",
            "updatedAt",
          ],
          required: false,
        },
      ],
    });

    const consumptionDocs = await MaterialConsumption.findAll({
      where: { status: "Confirmed" },
      attributes: ["id", "store", "city", "site", "updatedAt"],
      include: [
        {
          model: MaterialConsumptionItem,
          as: "items",
          attributes: [
            "itemCode",
            "itemName",
            "workOrderNo",
            "workCategory",
            "materialStatus",
            "lotNumber",
            "store",
            "quantity",
            "rate",
            "updatedAt",
          ],
          required: false,
        },
      ],
    });

    const returnDocs = await ReturnMaterial.findAll({
      where: { status: "Confirmed" },
      attributes: ["id", "store", "city", "site", "updatedAt"],
      include: [
        {
          model: ReturnMaterialItem,
          as: "items",
          attributes: [
            "itemCode",
            "itemName",
            "workOrderNo",
            "workCategory",
            "materialStatus",
            "lotNumber",
            "store",
            "quantity",
            "rate",
            "updatedAt",
          ],
          required: false,
        },
      ],
    });

    const threshold = Number(req.query.lowStockThreshold) || DEFAULT_LOW_STOCK_THRESHOLD;
    const rows = buildInventoryRows(inwardDocs, issueDocs, consumptionDocs, returnDocs, threshold);
    const summary = summarizeInventoryRows(rows, threshold);

    return res.status(200).json({ success: true, data: rows, summary });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateInventoryCount = async (req, res) => {
  return res.status(405).json({
    success: false,
    message:
      "Inventory records cannot be updated manually. Update source transaction entries instead.",
  });
};

/* ================= DELETE ================= */
export const deleteInventoryCount = async (req, res) => {
  return res.status(405).json({
    success: false,
    message:
      "Inventory records cannot be deleted manually. Delete/cancel source transaction entries instead.",
  });
};
