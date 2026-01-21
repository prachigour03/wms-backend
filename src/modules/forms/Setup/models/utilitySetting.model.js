export default (sequelize, DataTypes) => {
  const Settings = sequelize.define(
    "settings",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      dateFormat: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      timeZone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      autoLogout: {
        type: DataTypes.INTEGER, // minutes
        allowNull: false,
      },
    },
    {
      tableName: "settings",
      timestamps: true,
    }
  );

  return Settings;
};
