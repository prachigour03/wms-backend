export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      module: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },

      action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    {
      tableName: "permissions",
      freezeTableName: true,
      timestamps: false,
      indexes: [
        {
          fields: ["module", "action"],
          unique: true,
        },
      ],
    }
  );

  return Permission;
};
