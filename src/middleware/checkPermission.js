export const checkPermission = (module, action) => {
  return (req, res, next) => {
    // 1️ Ensure user exists (protect middleware should run before this)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2️ SUPER_ADMIN bypass (case-insensitive)
    if (req.user.role?.toLowerCase() === "super admin") {
      return next();
    }
 
    // 3️ Permissions safety
    const permissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];

    const permissionKey = `${module}:${action}`.toLowerCase(); 
    const normalizedPermissions = permissions.map(p => p.toLowerCase()); 

    // 4️ Permission check
    if (!normalizedPermissions.includes(permissionKey)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        required: permissionKey,
      });
    }

    next();
  };
};
