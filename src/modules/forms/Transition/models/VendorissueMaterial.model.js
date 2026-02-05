export default (sequelize, DataTypes) => {
  const VendorIssueMaterial = sequelize.define(
    "VendorIssueMaterial",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      issueNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      vendorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      materialName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      workOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      customer: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      issuedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Pending", "Issued", "Completed"),
        defaultValue: "Pending",
      },
    },
    {
      tableName: "vendor_issue_materials",
      timestamps: true,
    }
  );

  return VendorIssueMaterial;
};
