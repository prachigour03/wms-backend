export default (sequelize, DataTypes) => {
  const InwardChallan = sequelize.define(
    "InwardChallan",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      challanNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      customer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workOrderNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workOrderEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      shippedFrom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shippedTo: {
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
      store: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subsidiary: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transportationMode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lrNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tptId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tptName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryDate: {
        type: DataTypes.DATE,
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
      tableName: "inward_challans",
      timestamps: true,
    }
  );

  InwardChallan.associate = (models) => {
    InwardChallan.hasMany(models.InwardChallanItem, {
      foreignKey: "inwardChallanId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return InwardChallan;
};
