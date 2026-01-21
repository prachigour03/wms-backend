export default (sequelize, DataTypes) => {
  const InwardChallan = sequelize.define(
    "InwardChallan",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      challanNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      vendor: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      challanDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("Pending", "Received"),
        defaultValue: "Pending",
      },
    },
    {
      tableName: "inward_challans",
      timestamps: true,
    }
  );

  return InwardChallan;
};
