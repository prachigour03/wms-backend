export default (sequelize, DataTypes) => {
  const VendorIssueMaterialItem = sequelize.define(
    "VendorIssueMaterialItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorIssueMaterialId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      workOrderNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lotNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      materialStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availableQty: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      qtyIssued: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      quantity: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      uom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      useRateCalc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rate: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      taxRate: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      taxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      lineTotal: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      serviceType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      elementNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ticketSrNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fatNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemRemarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      store: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "vendor_issue_material_items",
      timestamps: true,
    }
  );

  VendorIssueMaterialItem.associate = (models) => {
    VendorIssueMaterialItem.belongsTo(models.VendorIssueMaterial, {
      foreignKey: "vendorIssueMaterialId",
      as: "header",
    });
  };

  return VendorIssueMaterialItem;
};
