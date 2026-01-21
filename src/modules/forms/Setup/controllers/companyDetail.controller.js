import db from "../../../../models/index.js";

const { CompanyDetail } = db;

/**
 * CREATE Company Detail (ONLY ONCE)
 */
export const createCompanyDetail = async (req, res) => {
  try {
    // 🔐 Check if already exists
    const existing = await CompanyDetail.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Company detail already exists. Use update instead.",
      });
    }

    const {
      companyName,
      companyCode,
      gstNumber,
      email,
      phone,
      country,
      state,
      city,
      pinCode,
      address,
      status,
    } = req.body;

    if (!companyName || !companyCode || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const companyDetail = await CompanyDetail.create({
      companyName,
      companyCode,
      gstNumber,
      email,
      phone,
      country,
      state,
      city,
      pinCode,
      address,
      status,
    });

    return res.status(201).json({
      success: true,
      data: companyDetail,
      message: "Company detail created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET Company Detail (SINGLE RECORD)
 */
export const getCompanyDetails = async (req, res) => {
  try {
    const companyDetail = await CompanyDetail.findOne();

    return res.status(200).json({
      success: true,
      data: companyDetail, // null if not created
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE Company Detail
 */
export const updateCompanyDetail = async (req, res) => {
  try {
    const companyDetail = await CompanyDetail.findByPk(req.params.id);

    if (!companyDetail) {
      return res.status(404).json({
        success: false,
        message: "Company detail not found",
      });
    }

    await companyDetail.update(req.body);

    return res.status(200).json({
      success: true,
      data: companyDetail,
      message: "Company detail updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
