import db from "../../../../models/index.js";

const { AdminProfile } = db;

/**
 * ================================
 * CREATE Admin Profile
 * ================================
 */
export const createAdminProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      bio,
      status,
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const existingProfile = await AdminProfile.findOne({ where: { email } });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists with this email",
      });
    }

    const profileImage = req.file
      ? `/uploads/profile/${req.file.filename}`
      : null;

    const profile = await AdminProfile.create({
      firstName,
      lastName,
      email,
      phone,
      role: req.user.role || "user", // 🔐 TRUST JWT
      department,
      bio,
      profileImage,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ================================
 * GET LOGGED-IN USER PROFILE
 * ================================
 */
export const getMyProfile = async (req, res) => {
  try {
    const { email, role } = req.user;

    let profile = await AdminProfile.findOne({ where: { email } });

    // ✅ AUTO CREATE PROFILE (IMPORTANT FIX)
    if (!profile) {
      profile = await AdminProfile.create({
        email,
        role,
        firstName: "",
        lastName: "",
        phone: "",
        department: "",
        bio: "",
        status: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ================================
 * GET PROFILE BY ID
 * ================================
 */
export const getAdminProfileById = async (req, res) => {
  try {
    const profile = await AdminProfile.findByPk(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ================================
 * UPDATE PROFILE
 * ================================
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await AdminProfile.findByPk(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // 🔐 SECURITY CHECK
    // Admin can update anyone
    // User can update ONLY their own profile
    if (
      req.user.role !== "admin" &&
      profile.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    const updatedData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      department: req.body.department,
      bio: req.body.bio,
      status: req.body.status,
    };

    if (req.file) {
      updatedData.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    await profile.update(updatedData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ================================
 * DELETE PROFILE
 * ================================
 */
export const deleteAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findByPk(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    await profile.destroy();

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
