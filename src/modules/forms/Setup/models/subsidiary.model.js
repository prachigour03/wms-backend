export default (sequelize, DataTypes) => {
  const Subsidiary = sequelize.define(
    "subsidiaries",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      parentSubsidiary: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      gstNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      validFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      tableName: "subsidiaries",
      timestamps: true,
    }
  );

  return Subsidiary;
};
