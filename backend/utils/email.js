import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

console.log("RESEND ENV CHECK", {
  key: process.env.RESEND_API_KEY ? "OK" : "MISSING",
});

const resend = new Resend(process.env.RESEND_API_KEY);


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


    const result = await resend.emails.send({
      from: "Campus Bazaar <onboarding@resend.dev>",
      to,
      subject: "Verify your Campus Bazaar account",
      html,
    });

    console.log("📧 Verification email sent:", result.data?.id);

  } catch (err) {
    console.error("❌ Verification email failed:", err.message);
    throw err;
  }
};


// ---------------- SEND WELCOME EMAIL ----------------
export const sendWelcomeEmail = async (to, name) => {
  try {

    const result = await resend.emails.send({
      from: "Campus Bazaar <onboarding@resend.dev>",
      to,
      subject: "Welcome to Campus Bazaar! 🎉",
      html: `
        <div style="font-family: -apple-system, sans-serif;">
          <h2>Hi ${name},</h2>
          <p>Your email is verified 🎉 You can now list items and chat with sellers.</p>
        </div>
      `,
    });

    console.log("🎉 Welcome email sent:", result.data?.id);

  } catch (err) {
    console.error("❌ Welcome email failed:", err.message);
  }
};