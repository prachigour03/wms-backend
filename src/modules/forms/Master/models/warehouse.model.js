export default (sequelize, DataTypes) => {
  const Warehouse = sequelize.define(
    "Warehouse",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      warehouseCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      warehouseName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      incharge: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      contactNo: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Active",
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "warehouses",
      timestamps: true,
      underscored: true,
    }
  );

  return Warehouse;
};
