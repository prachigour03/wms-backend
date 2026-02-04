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

async function checkSchema() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful.");

    const queryResult = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role';");

    if (queryResult[0].length > 0) {
      console.log("✅ 'users' table has 'role' column.");
      process.exit(0);
    } else {
      console.log("❌ 'users' table does NOT have 'role' column.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error checking schema:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
