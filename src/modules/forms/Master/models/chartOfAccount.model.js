export default (sequelize, DataTypes) => {
  const ChartOfAccount = sequelize.define(
    "ChartOfAccount",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },

      accountCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },

      accountTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      parentAccountId: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      openingBalance: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "chart_of_accounts",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["account_code"],
        },
      ],
    }
  );

  return ChartOfAccount;
};
