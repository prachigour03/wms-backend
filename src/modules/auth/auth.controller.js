import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/sendEmail.js";

const { User, Role, Permission } = db;

/* ======================================================
   HELPER: BUILD PERMISSIONS
====================================================== */
const buildPermissions = async (user) => {
  const roleName = user.Role?.name?.toLowerCase();

  // SUPER ADMIN => all permissions
  if (roleName === "super admin") {
    const allPermissions = await Permission.findAll();
    return allPermissions.map((p) => `${p.module}:${p.action}`);
  }

  // User-specific overrides (if any)
  if (Array.isArray(user.UserPermissions) && user.UserPermissions.length > 0) {
    return user.UserPermissions.map((p) => `${p.module}:${p.action}`);
  }

  return Array.isArray(user.Role?.Permissions)
    ? user.Role.Permissions.map((p) => `${p.module}:${p.action}`)
    : [];
};

/* ======================================================
   REGISTER (NORMAL USER)
====================================================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (exists)
      return res.status(409).json({ success: false, message: "Email already exists" });

    const userRole = await Role.findOne({ where: { name: "user" } }); 
    if (!userRole)
      return res.status(500).json({ success: false, message: "USER role missing" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      roleId: userRole.id,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

/* ======================================================
   LOGIN
====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        {
          model: Role,
          include: [{ model: Permission, through: { attributes: [] } }],
        },
        {
          model: Permission,
          as: "UserPermissions",
          through: { attributes: [] },
        },
      ],
    });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const permissions = await buildPermissions(user);

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.Role?.name,
      permissions,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role?.name,
        permissions,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

/* ======================================================
   FORGOT PASSWORD (OTP)
====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user)
      return res.status(404).json({ success: false, message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    if (user.otpVerified === undefined) user.otpVerified = false; // safe default
    await user.save();

    await sendEmail(user.email, "Password Reset OTP", `Your OTP is ${otp}. Valid for 5 minutes.`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

/* ======================================================
   VERIFY OTP
====================================================== */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user || user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (Date.now() > new Date(user.otpExpiry).getTime())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.otpVerified = true;
    await user.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

   //RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [
        { model: Role, include: [Permission] },
        { model: Permission, as: "UserPermissions", through: { attributes: [] } },
      ],
    });

    if (!user || !user.otpVerified)
      return res.status(403).json({ success: false, message: "OTP verification required" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = false;
    await user.save();

    const permissions = await buildPermissions(user);

    const token = await generateToken({
      id: user.id,
      email: user.email,
      role: user.Role?.name,
      permissions,
    });

    res.json({
      success: true,
      message: "Password reset successful",
      token,
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

