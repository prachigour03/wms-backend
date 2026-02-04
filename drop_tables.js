import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

async function dropTables() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful.");

    await sequelize.query('DROP TABLE IF EXISTS "role_permissions";');
    console.log("✅ 'role_permissions' table dropped.");

    await sequelize.query('DROP TABLE IF EXISTS "users";');
    console.log("✅ 'users' table dropped.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error dropping tables:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

dropTables();
