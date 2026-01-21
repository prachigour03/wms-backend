export default (sequelize, DataTypes) => {
  const InventoryCount = sequelize.define(
    "InventoryCount",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      itemCode: { type: DataTypes.STRING, allowNull: false },
      itemName: { type: DataTypes.STRING, allowNull: false },
      warehouse: { type: DataTypes.STRING, allowNull: false },
      systemQty: { type: DataTypes.INTEGER, allowNull: false },
      countedQty: { type: DataTypes.INTEGER, allowNull: false },
      countDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      tableName: "inventory_counts",
      timestamps: true,
    }
  );

  return InventoryCount;
};
