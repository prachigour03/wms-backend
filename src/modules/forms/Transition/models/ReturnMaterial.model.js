export default (sequelize, DataTypes) => {
  const ReturnMaterial = sequelize.define(
    "ReturnMaterial",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      returnNo: {
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

      returnedFrom: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "return_materials",
      timestamps: true,
    }
  );

  return ReturnMaterial;
};
