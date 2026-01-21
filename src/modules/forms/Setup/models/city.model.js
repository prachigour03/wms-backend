export default (sequelize, DataTypes) => {
  const City = sequelize.define(
    "City",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cityName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stateName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stateCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "cities",
      timestamps: true,
    }
  );

  return City;
};