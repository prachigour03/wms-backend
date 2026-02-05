export default (sequelize, DataTypes) => {
  const MaterialConsumption = sequelize.define(
    "MaterialConsumption",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      consumptionNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vendorEmployee: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      workOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      site: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Draft", "Confirmed", "Cancelled"),
        defaultValue: "Draft",
      },

      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "material_consumptions",
      timestamps: true,
    }
  );

  return MaterialConsumption;
};
