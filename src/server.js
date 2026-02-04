import dotenv from "dotenv";
dotenv.config(); // ✅ SABSE UPAR (MOST IMPORTANT)

import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.PORT || 10000; // Render-safe

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
