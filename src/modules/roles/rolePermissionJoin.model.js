export default (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      roleId: {
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
      tableName: "role_permissions",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return RolePermission;
};
