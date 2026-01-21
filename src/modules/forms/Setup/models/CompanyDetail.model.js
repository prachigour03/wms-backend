export default (sequelize, DataTypes) => {
  const CompanyDetail = sequelize.define(
    "CompanyDetail",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      companyCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      gstNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pinCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "company_details",
      timestamps: true,
    }
  );

  return CompanyDetail;
};
