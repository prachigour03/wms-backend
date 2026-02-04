export const can = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;

    // 1️⃣ Ensure user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2️⃣ SUPER_ADMIN bypass (case-insensitive)
    if (user.role?.toLowerCase() === "super admin") {
      return next();
    }

    // 3️⃣ Permissions safety
    const permissions = Array.isArray(user.permissions)
      ? user.permissions.map(p => p.toLowerCase())
      : [];

    const permissionKey = requiredPermission.toLowerCase();

    // 4️⃣ Permission check
    if (!permissions.includes(permissionKey)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: missing ${requiredPermission}`,
      });
    }

    next();
  };
};
