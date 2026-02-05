export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.ENUM(
          "super admin",
          "admin",
          "manager",
          "employee",
          "vendor",
        ),
        allowNull: false,
      },
    },
    {
      tableName: "roles",
      freezeTableName: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  return Role;
};
