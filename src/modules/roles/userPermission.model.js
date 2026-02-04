export default (sequelize, DataTypes) => {
  const UserPermission = sequelize.define(
    "UserPermission",
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "user_permissions",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return UserPermission;
};
