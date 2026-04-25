export default (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subsidiary: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "stores",
      timestamps: true,
    }
  );

  return Store;
};
