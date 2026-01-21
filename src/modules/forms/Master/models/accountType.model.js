export default (sequelize, DataTypes) => {
  const AccountType = sequelize.define(
    "AccountType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountTypeName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      accountCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "account_types",
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

  return AccountType;
};
