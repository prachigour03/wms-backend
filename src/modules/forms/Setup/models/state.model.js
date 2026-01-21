// models/State.js
export default (sequelize, DataTypes) => {
  const State = sequelize.define(
    "State",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "states",
      timestamps: true,
    }
  );

  return State;
};
