export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // SUPER_ADMIN bypass (case-insensitive)
    if (userRole === "super admin") {
      return next();
    }

    // Normalize allowedRoles to lowercase
    const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};
