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
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("Vendor", "Employee"),
        defaultValue: "Vendor",
      },
      issuedTo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supervisorName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      issueType: {
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
      tableName: "vendor_issue_materials",
      timestamps: true,
    }
  );

  VendorIssueMaterial.associate = (models) => {
    VendorIssueMaterial.hasMany(models.VendorIssueMaterialItem, {
      foreignKey: "vendorIssueMaterialId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return VendorIssueMaterial;
};
