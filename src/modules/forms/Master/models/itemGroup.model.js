export default (sequelize, DataTypes) => {
  const ItemGroup = sequelize.define(
    "ItemGroup",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      groupCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },

      groupName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
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
      tableName: "item_groups",
      timestamps: true,
      underscored: true,
      indexes: [
        { unique: true, fields: ["group_code"] },
      ],
    }
  );

  return ItemGroup;
};
