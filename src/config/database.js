import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const baseConfig = {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
};

const useSsl = process.env.DB_SSL === "true";
const sslConfig = useSsl
  ? {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  : {};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, { ...baseConfig, ...sslConfig })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        ...baseConfig,
        ...sslConfig,
      }
    );

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//   }
// );

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    await sequelize.sync({ alter: true }); // 👈 THIS LINE FIXES EVERYTHING
    console.log("✅ All models synced");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
};

export default sequelize;
