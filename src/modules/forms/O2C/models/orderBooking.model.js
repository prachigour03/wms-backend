export default (sequelize, DataTypes) => {
  const OrderBooking = sequelize.define(
    "OrderBooking",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tranditionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: DataTypes.STRING,
      location: DataTypes.STRING,
      finalRate: DataTypes.STRING,
    },
    {
      tableName: "order_bookings",
      timestamps: true,
    }
  );

  return OrderBooking;
};
