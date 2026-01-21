// models/team.model.js
export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "PaymentTeam",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      teamCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      contactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },
    {
      tableName: "teams",
      timestamps: true,
      underscored: true,
    }
  );

  return Team;
};
