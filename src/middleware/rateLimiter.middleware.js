import rateLimit from "express-rate-limit";

/**
 * Usage:
 * app.use("/api/auth", rateLimiter(5, 15 * 60 * 1000)) // 5 requests per 15 minutes
 */
export const rateLimiter = (maxRequests, windowMs) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
    standardHeaders: true, 
    legacyHeaders: false,  
  });
