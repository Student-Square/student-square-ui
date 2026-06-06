"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}

type Stage = "form" | "sent";

function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [stage, setStage] = useState<Stage>("form");
  const [sentEmail, setSentEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /* ── Minimal client-side strength score ── */
  const strengthScore = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0-4
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-emerald-500",
  ][strengthScore];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await register({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
      }).unwrap();

      setSentEmail(trimmedEmail);
      setStage("sent");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Registration failed. Please try again.";
      setFormError(msg);
    }
  }

  /* ══════════════ SUCCESS STATE ══════════════ */
  if (stage === "sent") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
        <Backdrop />

        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-8 sm:p-10">
            {/* Animated icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Check your inbox
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We&apos;ve sent a verification link to{" "}
              <span className="font-semibold text-foreground">{sentEmail}</span>.
              Click the link in the email to activate your account.
            </p>

            <div className="mt-6 rounded-xl bg-muted/50 border border-border px-4 py-3.5 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">What to do next:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
                <li>Open the email from Student Square.</li>
                <li>Click the <span className="font-medium text-foreground">"Verify Email"</span> button.</li>
                <li>You&apos;ll be taken to the login page automatically.</li>
              </ol>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                onClick={() => setStage("form")}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
              >
                try again
              </button>
              .
            </p>

            <div className="mt-6 pt-5 border-t border-border">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ══════════════ FORM STATE ══════════════ */
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <Backdrop />

      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Student Square
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join Student Square — it&apos;s free.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            {/* Full Name */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name
              </span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </label>

            {/* Email */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          n <= strengthScore ? strengthColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Strength:{" "}
                    <span
                      className={`font-semibold ${
                        strengthScore <= 1
                          ? "text-red-500"
                          : strengthScore === 2
                          ? "text-yellow-500"
                          : strengthScore === 3
                          ? "text-blue-500"
                          : "text-emerald-600"
                      }`}
                    >
                      {strengthLabel}
                    </span>
                  </p>
                </div>
              )}
            </label>

            {/* Confirm Password */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Confirm Password
              </span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border transition-colors focus:outline-none focus:ring-2 ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                      : confirmPassword.length > 0 && confirmPassword === password
                      ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      : "border-border focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                  Passwords do not match.
                </p>
              )}
            </label>

            {/* Inline error */}
            {formError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Backdrop() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
    </div>
  );
}
