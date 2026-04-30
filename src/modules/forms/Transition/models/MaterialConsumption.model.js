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
        type: DataTypes.DATE,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      consumedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("Vendor", "Employee"),
        defaultValue: "Vendor",
      },
      vendorEmployeeName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subsidiary: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      store: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Draft", "Confirmed", "Cancelled"),
        defaultValue: "Draft",
      },
      grandTotal: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      totalTax: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },
    },
    {
      tableName: "material_consumptions",
      timestamps: true,
    }
  );

  MaterialConsumption.associate = (models) => {
    MaterialConsumption.hasMany(models.MaterialConsumptionItem, {
      foreignKey: "materialConsumptionId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return MaterialConsumption;
};
