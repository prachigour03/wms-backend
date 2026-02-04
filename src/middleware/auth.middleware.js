import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️ Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line no-unused-vars
    } catch (_err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 3️ Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email.toLowerCase(), 
      role: decoded.role?.toLowerCase(), 
      permissions: Array.isArray(decoded.permissions)
        ? decoded.permissions.map(p => p.toLowerCase())
        : [],
    };

    next();
  } catch (error) {
    console.error("PROTECT MIDDLEWARE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error in auth middleware",
    });
  }
};

// Alias for clarity in RBAC flows
export const authenticateJWT = protect;
