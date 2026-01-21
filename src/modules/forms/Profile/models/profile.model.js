export default (sequelize, DataTypes) => {
  const AdminProfile = sequelize.define(
    "AdminProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Admin",
      },

      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      /**
       * Image Storage Options:
       * 1️⃣ Base64 string (current frontend logic)
       * 2️⃣ Image URL or filename (recommended)
       */
      profileImage: {
        type: DataTypes.TEXT, // works for base64 OR URL
        allowNull: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "admin_profiles",
      timestamps: true,
    }
  );

  return AdminProfile;
};
