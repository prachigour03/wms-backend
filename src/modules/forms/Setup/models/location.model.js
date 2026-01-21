export default (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
     id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
},

      locationCode: {
        type: DataTypes.STRING,
      },
      locationName: {
        type: DataTypes.STRING,
      },
      subsidiary: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "locations",
      timestamps: true,
    }
  );

  return Location;
};