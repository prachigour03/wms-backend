export default (sequelize, DataTypes) => {
  const VendorBill = sequelize.define(
    "VendorBill",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      billNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      billDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      vendorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      invoiceNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      invoiceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      gstAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Paid"),
        defaultValue: "Pending",
      },
    },
    {
      tableName: "vendor_bills",
      timestamps: true,
    }
  );

  return VendorBill;
};
