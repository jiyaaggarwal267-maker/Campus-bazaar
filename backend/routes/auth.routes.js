import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  resendVerification,
  getMe,
} from "../controllers/auth.controller.js";

import { auth, requireVerified } from "../middleware/auth.js";

const router = Router();

// ---------------- AUTH ROUTES ----------------
router.post("/signup", signup);
router.post("/login", login);

// ✅ FIX: email verification should be GET (browser click link)
router.get("/verify-email", verifyEmail);

// resend verification (only logged-in users)
router.post("/resend-verification", auth, resendVerification);

// current user
router.get("/me", auth, requireVerified, getMe);

export default router;