import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from "sequelize";
import db from "../../models/index.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/sendEmail.js";

const User = db.User;

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role: "user" });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      console.log("❌ Password missing in DB");
      return res.status(500).json({ message: "Password not set for user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* FORGOT PASSWORD (OTP EMAIL) */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 1. Check user exists
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "Email not found" });

  // 2. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Save OTP in DB OR memory
  user.otp = otp; 
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  // 4. Send OTP via email
  const sent = await sendEmail(user.email, "Reset OTP", `Your OTP: ${otp}`);
  if (!sent) return res.status(500).json({ message: "Failed to send OTP" });

  res.json({ message: "OTP sent successfully" });
};

/* VERIFY OTP */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  if (Date.now() > user.otpExpiry)
    return res.status(400).json({ message: "OTP expired" });

  res.json({ message: "OTP verified" });
};

/* RESET PASSWORD + AUTO LOGIN */
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = generateToken(user);

  res.json({
    message: "Password reset successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};
