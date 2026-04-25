export default (sequelize, DataTypes) => {
  const ReturnMaterialItem = sequelize.define(
    "ReturnMaterialItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      returnMaterialId: {
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
      hsnSac: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lotNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      uom: {
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
      useRate: {
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
      store: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "return_material_items",
      timestamps: true,
    }
  );

  ReturnMaterialItem.associate = (models) => {
    ReturnMaterialItem.belongsTo(models.ReturnMaterial, {
      foreignKey: "returnMaterialId",
      as: "header",
    });
  };

  return ReturnMaterialItem;
};
