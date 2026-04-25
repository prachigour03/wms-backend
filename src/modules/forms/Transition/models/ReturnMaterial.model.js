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
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnFrom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      returnType: {
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
      tableName: "return_materials",
      timestamps: true,
    }
  );

  ReturnMaterial.associate = (models) => {
    ReturnMaterial.hasMany(models.ReturnMaterialItem, {
      foreignKey: "returnMaterialId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return ReturnMaterial;
};
