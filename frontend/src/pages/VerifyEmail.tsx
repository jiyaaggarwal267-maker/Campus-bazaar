import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmail() {
  const { user, verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [cooldown, setCooldown] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);
  const [loadingResend, setLoadingResend] = useState<boolean>(false);

  // ---------------- VERIFY ----------------
  const handleVerifyToken = useCallback(async (token: string) => {
    setError("");
    setLoadingVerify(true);

    try {
      await verifyEmail(token);
      navigate("/complete-profile");
    } catch (e: any) {
      setError(e.response?.data?.error || "Verification failed");
    } finally {
      setLoadingVerify(false);
    }
  }, [verifyEmail, navigate]);

  useEffect(() => {
    const token = params.get("token");
    if (token) handleVerifyToken(token);
  }, [params, handleVerifyToken]);

  // ---------------- COOLDOWN TIMER ----------------
  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ---------------- RESEND ----------------
  const handleResend = async () => {
    setError("");
    setLoadingResend(true);

    try {
      await resendVerification();
      setCooldown(30);
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to resend");
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-ink-50/50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-2xl bg-primary-50 mx-auto mb-6 flex items-center justify-center"
          >
            <Mail className="text-primary-600" size={32} />
          </motion.div>

          <h1 className="text-2xl font-bold text-ink-950 mb-2">
            Check your inbox
          </h1>

          <p className="text-ink-600 text-sm mb-1">
            We sent a verification link to
          </p>

          <p className="font-semibold text-ink-900 mb-6">
            {user?.email}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2 justify-center">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6 text-left">
            💡 Click the link in your email or paste it in browser.
          </div>

          <div className="mt-6 pt-6 border-t border-ink-100">
            <p className="text-sm text-ink-600 mb-3">
              Didn't get the email?
            </p>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleResend}
              disabled={cooldown > 0 || loadingResend}
            >
              <RefreshCw
                size={14}
                className={loadingResend ? "animate-spin" : ""}
              />

              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : loadingResend
                ? "Sending..."
                : "Resend email"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}