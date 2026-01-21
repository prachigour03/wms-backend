export default (sequelize, DataTypes) => {
  const SystemLog = sequelize.define(
    "SystemLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      module: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      level: {
        type: DataTypes.ENUM("Info", "Warning", "Error"),
        allowNull: false,
      },

      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "system_logs",
      timestamps: true,
    }
  );

  return SystemLog;
};
