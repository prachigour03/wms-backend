export default (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },

      itemCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },

      itemGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "items",
      timestamps: true,
      underscored: true,
      indexes: [
        { unique: true, fields: ["item_code"] },
      ],
    }
  );

  return Item;
};
