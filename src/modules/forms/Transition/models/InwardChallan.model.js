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

      vendor: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      challanDate: {
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

      warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      workOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      workCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      store: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      customer: {
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

      vehicleNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      transporter: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      deliveryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      grandTotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      materialStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Pending", "Received", "Cancelled"),
        defaultValue: "Pending",
      },
    },
    {
      tableName: "inward_challans",
      timestamps: true,
    }
  );

  return InwardChallan;
};
