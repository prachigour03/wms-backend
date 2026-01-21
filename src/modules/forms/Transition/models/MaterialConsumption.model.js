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
