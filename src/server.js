import dotenv from "dotenv";
import app from "./app.js";
import db from "./models/index.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    await db.sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
    process.exit(1);
  }
};

startServer();
