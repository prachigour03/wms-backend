import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Ensure Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2️⃣ Attach normalized user object to request
    req.user = {
      id: decoded.id,
      email: decoded.email?.toLowerCase(),
      role: decoded.role?.toLowerCase(),
      permissions: Array.isArray(decoded.permissions)
        ? decoded.permissions.map(p => p.toLowerCase())
        : [],
    };

    next();
  } catch (err) {
    console.error("VERIFY TOKEN ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
