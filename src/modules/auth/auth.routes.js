import express from "express";
import {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js"; // fixed folder name
import { loginSchema } from "./auth.validation.js";
import { rateLimiter } from "../../middleware/rateLimiter.middleware.js";
import { z } from "zod";

const router = express.Router();

/* ======================================================
   AUTH ROUTES
====================================================== */

/**
 * LOGIN
 * Public
 */
router.post(
  "/login",
  rateLimiter(5, 15 * 60 * 1000), // 5 attempts / 15 min
  validate(loginSchema),
  login
);

/**
 * FORGOT PASSWORD
 * Public
 */
router.post(
  "/forgot-password",
  rateLimiter(3, 10 * 60 * 1000),
  forgotPassword
);

/**
 * VERIFY OTP
 * Public
 */
router.post(
  "/verify-otp",
  rateLimiter(5, 10 * 60 * 1000),
  verifyOtp
);

/**
 * RESET PASSWORD
 * Public (after OTP)
 * Validate strong new password
 */
const resetPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);



export default router;
