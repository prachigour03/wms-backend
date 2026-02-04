import dotenv from "dotenv";
//import { createRequire } from "module";
import app from "./app.js";
import { connectDB } from "./config/database.js";


dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    // Seed initial data
    // const require = createRequire(import.meta.url);
    // const seeder = require("./seeders/20260126074404-initial-data.cjs");
    // const seedPermissions = require("../seeders/permissionSeeder.js")

    // await seeder.up();
    // await seedPermissions();
    console.log("Seeding completed.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
