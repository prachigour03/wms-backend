import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";

import rateLimit from "express-rate-limit";

// Auth
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import roleRoutes from "./modules/roles/role.routes.js";
import permissionRoutes from "./modules/roles/rolePermission.routes.js";
import dashboardRoutes from "./modules/dashboard/index.js";

// Forms
import orderBookingRoutes from "./modules/forms/O2C/routes/orderBooking.routes.js";
import transitionRoutes from "./modules/forms/Transition/routes/index.js";
import setupRoutes from "./modules/forms/Setup/routes/index.js";
import masterRoutes from "./modules/forms/Master/routes/index.js";
import profileRoutes from "./modules/forms/Profile/routes/profile.routes.js";
import notificationRoutes from "./modules/notification/routes/notification.routes.js";

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

const normalizeOrigin = (origin) => (origin ? origin.replace(/\/$/, "") : origin);

const staticOrigins = [
  process.env.FRONTEND_URL,
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = new Set(
  [...staticOrigins, ...envOrigins].map((origin) => normalizeOrigin(origin))
);

const isLocalhostOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  if (process.env.CORS_ALLOW_ALL === "true") return true;

  if (process.env.NODE_ENV !== "production") return true;

  const normalized = normalizeOrigin(origin);
  if (isLocalhostOrigin(normalized)) return true;

  return allowedOrigins.has(normalized);
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// CORS should run before rate limiter so even error responses include headers
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(compression());

/* ================== STATIC FILES ================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================== ROUTES ================== */

app.use("/api/notifications", notificationRoutes);
// Auth
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);

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
app.use((err, req, res, _next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
