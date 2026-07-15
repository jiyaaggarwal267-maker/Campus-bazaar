import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/email.js";

//---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();


    // -------- COLLEGE EMAIL VALIDATION --------
    const allowedDomains = process.env.ALLOWED_DOMAINS
      ? process.env.ALLOWED_DOMAINS.split(",").map(domain => domain.trim())
      : [];

    const emailDomain = cleanEmail.split("@")[1];

    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      return res.status(400).json({
        error: "Only college email addresses are allowed",
      });
    }
    // -------------------------------------------

    const exists = await User.findOne({ email: cleanEmail });

    if (exists) {
      return res.status(400).json({
        error: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,

      college: "",

      isVerified: false,
      verifyToken,
      verifyTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    console.log("Sending verification email to:", cleanEmail);

    await sendVerificationEmail(cleanEmail, name, verifyUrl);

    const token = signToken(user._id);

    return res.status(201).json({
      message: "Signup successful. Please verify your email.",
      token,
      user,
    });

  } catch (err) {
    console.error("Signup error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};
// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email first",
      });
    }

    const token = signToken(user._id);

    user.password = undefined;

    return res.json({
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;

    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (err) {
      console.log("Welcome email failed:", err.message);
    }

    const jwt = signToken(user._id);

    return res.json({
      message: "Email verified successfully",
      token: jwt,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ---------------- RESEND VERIFICATION ----------------
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Already verified",
      });
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    user.verifyToken = newToken;
    user.verifyTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${newToken}`;

    await sendVerificationEmail(
      user.email,
      user.name,
      verifyUrl
    );

    return res.json({
      message: "Verification email resent",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ---------------- ME ----------------
export const getMe = async (req, res) => {
  res.json(req.user);
};