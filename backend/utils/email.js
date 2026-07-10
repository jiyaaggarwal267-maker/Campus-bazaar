import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("EMAIL ENV CHECK", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "OK" : "MISSING",
});

// ---------------- TRANSPORTER ----------------
// SMTP configuration for Render deployment
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ---------------- DEBUG CHECK ----------------
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email server is ready");
  }
});

// ---------------- SEND VERIFICATION EMAIL ----------------
export const sendVerificationEmail = async (to, name, verifyUrl) => {
  try {
    if (!to || !verifyUrl) {
      throw new Error("Missing email or verification URL");
    }

    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: auto; padding: 24px;">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #7E22CE; margin: 0;">Campus Bazaar</h1>
        </div>

        <h2 style="color: #111827;">Hi ${name},</h2>

        <p style="color: #4B5563; line-height: 1.6;">
          Welcome to Campus Bazaar! Please verify your college email to start trading on campus.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}"
             style="display: inline-block; padding: 14px 32px; background: #7E22CE; color: white; border-radius: 12px; text-decoration: none; font-weight: 600;">
            Verify my email
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 12px;">
          Or copy and paste this link:
        </p>

        <p style="word-break: break-all; font-size: 12px; color: #6B7280;">
          ${verifyUrl}
        </p>

        <p style="color: #9CA3AF; font-size: 12px; margin-top: 16px;">
          This link expires in 24 hours.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Verify your Campus Bazaar account",
      html,
    });

    console.log("📧 Verification email sent:", info.messageId);

  } catch (err) {
    console.error("❌ Verification email failed:", err.message);
    throw err;
  }
};


// ---------------- WELCOME EMAIL ----------------
export const sendWelcomeEmail = async (to, name) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Welcome to Campus Bazaar! 🎉",
      html: `
        <div style="font-family: -apple-system, sans-serif;">
          <h2>Hi ${name},</h2>
          <p>Your email is verified 🎉 You can now list items and chat with sellers.</p>
        </div>
      `,
    });

    console.log("🎉 Welcome email sent:", info.messageId);

  } catch (err) {
    console.error("❌ Welcome email failed:", err.message);
  }
};