export default (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
},
      departmentCode: {
        type: DataTypes.STRING,
        field: "department_code",
      },
      departmentName: {
        type: DataTypes.STRING,
        field: "department_name", 
      },
    },
    {
      tableName: "departments",
      timestamps: true,
      underscored: true, 
    }
  );

  return Department;
};
