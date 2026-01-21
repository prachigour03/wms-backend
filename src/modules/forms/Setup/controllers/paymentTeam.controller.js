import db from "../../../../models/index.js";

const { PaymentTeam } = db;

/**
 * CREATE Payment Team
 */
export const createPaymentTeam = async (req, res) => {
  const { teamCode, teamName, contactPerson, email, status } = req.body;

  if (!teamCode || !teamName) {
    return res.status(400).json({
      success: false,
      message: "Team Code and Team Name are required",
    });
  }

  try {
    const paymentTeam = await PaymentTeam.create({
      teamCode,
      teamName,
      contactPerson,
      email,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      data: paymentTeam,
      message: "Payment Team created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL Payment Teams
 */
export const getPaymentTeams = async (req, res) => {
  try {
    const paymentTeams = await PaymentTeam.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: paymentTeams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE Payment Team BY ID
 */
export const getPaymentTeamById = async (req, res) => {
  try {
    const paymentTeam = await PaymentTeam.findByPk(req.params.id);

    if (!paymentTeam) {
      return res.status(404).json({
        success: false,
        message: "Payment Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data: paymentTeam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Payment Team
 */
export const updatePaymentTeam = async (req, res) => {
  const { teamCode, teamName, contactPerson, email, status } = req.body;

  if (!teamCode || !teamName) {
    return res.status(400).json({
      success: false,
      message: "Team Code and Team Name are required",
    });
  }

  try {
    const paymentTeam = await PaymentTeam.findByPk(req.params.id);

    if (!paymentTeam) {
      return res.status(404).json({
        success: false,
        message: "Payment Team not found",
      });
    }

    await paymentTeam.update({
      teamCode,
      teamName,
      contactPerson,
      email,
      status: status || paymentTeam.status,
    });

    res.status(200).json({
      success: true,
      message: "Payment Team updated successfully",
      data: paymentTeam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Payment Team
 */
export const deletePaymentTeam = async (req, res) => {
  try {
    const deleted = await PaymentTeam.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Payment Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
