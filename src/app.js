import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import db from "./models/index.js";
import rateLimit from "express-rate-limit";
// Auth
import authRoutes from "./modules/auth/auth.routes.js";
import dashboardRoutes from "./modules/dashboard/index.js";

// Forms
import orderBookingRoutes from "./modules/forms/O2C/routes/orderBooking.routes.js";
import transitionRoutes from "./modules/forms/Transition/routes/index.js";
import setupRoutes from "./modules/forms/Setup/routes/index.js";
import masterRoutes from "./modules/forms/Master/routes/index.js";
import profileRoutes from "./modules/forms/Profile/routes/profile.routes.js";

const app = express();

/* ================== GLOBAL MIDDLEWARES ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const whitelist = [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., curl, postman) and allow whitelisted dev hosts
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(compression());

/* ================== STATIC FILES ================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================== ROUTES ================== */

// Auth
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

//  Profile (FIXED)
app.use("/api/forms/profile", profileRoutes);

// O2C
app.use("/api/forms/o2c/order-booking", orderBookingRoutes);

// Transition
app.use("/api/forms/transition", transitionRoutes);

// Setup
app.use("/api/forms/setup", setupRoutes);

// Master
app.use("/api/forms/master", masterRoutes);

/* ================== GLOBAL ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
