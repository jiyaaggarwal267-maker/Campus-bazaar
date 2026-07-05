import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    password: string;
  }>();

  const pwd = watch("password") || "";

  const pwdScore = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ].filter(Boolean).length;

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");

    try {
      await signup(data.name, data.email, data.password);
      navigate("/verify-email");
    } catch (e: any) {
      setError(
        e.response?.data?.error ||
          e.response?.data?.message ||
          e.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-ink-50/50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink-950 mb-1">
            Create your account
          </h1>

          <p className="text-ink-500 text-sm mb-6">
            Join Campus Bazaar.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Aarav Sharma"
              icon={<User size={16} />}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Too short",
                },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              hint="We'll verify your email before activating your account."
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              placeholder="At least 8 characters"
              icon={<Lock size={16} />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters",
                },
              })}
              error={errors.password?.message}
            />

            {pwd && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        pwdScore >= i
                          ? pwdScore <= 2
                            ? "bg-red-400"
                            : pwdScore === 3
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                          : "bg-ink-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-ink-500">
                  Strength:{" "}
                  <span className="font-semibold">
                    {["Weak", "Fair", "Good", "Strong"][pwdScore - 1] ||
                      "Too short"}
                  </span>
                </p>
              </div>
            )}

            <label className="flex items-start gap-2 text-xs text-ink-600">
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded border-ink-300"
              />

              <span>
                I agree to the{" "}
                <a href="#" className="text-primary-600 font-medium">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary-600 font-medium">
                  Privacy Policy
                </a>.
              </span>
            </label>

            <Button
              type="submit"
              variant="purple"
              fullWidth
              size="lg"
              loading={loading}
              iconRight={!loading && <ArrowRight size={16} />}
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-center text-xs text-ink-500">
          <Check size={12} className="text-emerald-500" />
          Email verification required
        </div>
      </motion.div>
    </div>
  );
}