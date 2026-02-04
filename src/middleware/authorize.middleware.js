

/**
 * Usage:
 * authorize("users:create")
 * authorize("users:read")
 * authorize("users:update")
 * authorize("users:delete")
 */
export const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // 1️⃣ User must exist from previous middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // 2️⃣ SUPER_ADMIN bypass (case-insensitive)
      if (req.user.role?.toLowerCase() === "super admin") {
        return next();
      }

      // 3️⃣ Skip if no permission required
      if (!requiredPermission) return next();

      // 4️⃣ Permissions check (case-insensitive)
      const permissions = Array.isArray(req.user.permissions)
        ? req.user.permissions.map(p => p.toLowerCase())
        : [];

      if (!permissions.includes(requiredPermission.toLowerCase())) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          required: requiredPermission,
        });
      }

      next();
    } catch (error) {
      console.error("AUTH ERROR:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

// Backward-compatible export
export const authorize = authorizePermission;
