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

      recordId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      changedFields: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      level: {
        type: DataTypes.ENUM("Info", "Warning", "Error"),
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      durationMs: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
