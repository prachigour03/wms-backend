import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "gourpachi330@gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // fallback sender
    pass: process.env.EMAIL_PASS, // app password
  },
});

/**
 * Send email dynamically
 *
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - email body
 * @param {string} [from] - optional sender email
 * @returns {Promise<boolean>}
 */
export const sendEmail = async (to, subject, text, from) => {
  try {
    const info = await transporter.sendMail({
      from: `"super admin" <${from || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent:", info.messageId, "to:", to);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return false;
  }
};
