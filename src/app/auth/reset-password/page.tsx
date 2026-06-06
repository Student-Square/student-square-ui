"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  XCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-background"><p className="text-sm text-muted-foreground">Loading…</p></main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

type Stage = "form" | "success";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [stage, setStage] = useState<Stage>("form");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const strengthScore = (() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"][strengthScore];
  const strengthTextColor = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-emerald-600"][strengthScore];

  /* ── Missing token — show error state ── */
  if (!token || !email) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <Backdrop />
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card shadow-xl shadow-red-500/5 p-8 sm:p-10">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 ring-8 ring-red-100 dark:ring-red-900/10">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Invalid reset link</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This link is missing required parameters. Please request a new one.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Request new link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Success state ── */
  if (stage === "success") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
        <Backdrop />
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-8 sm:p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Password reset!</h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.replace("/auth/login")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Continue to sign in
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (newPassword.length < 8) { setFormError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setFormError("Passwords do not match."); return; }

    try {
      await resetPassword({ token, email, password: newPassword }).unwrap();
      setStage("success");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Reset failed. The link may have expired — please request a new one.";
      setFormError(msg);
    }
  }

  /* ── Form state ── */
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <Backdrop />
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 mb-4">
            <KeyRound className="h-5 w-5 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Set new password
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Resetting password for{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* New password */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                New password
              </span>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
                <button
                  type="button"
                  aria-label={showNew ? "Hide password" : "Show password"}
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n <= strengthScore ? strengthColor : "bg-muted"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Strength: <span className={`font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
                  </p>
                </div>
              )}
            </label>

            {/* Confirm password */}
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Confirm new password
              </span>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border transition-colors focus:outline-none focus:ring-2 ${
                    confirmPassword.length > 0 && confirmPassword !== newPassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                      : confirmPassword.length > 0 && confirmPassword === newPassword
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
              {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                <p className="mt-1.5 text-[11px] text-red-500 font-medium">Passwords do not match.</p>
              )}
            </label>

            {/* Inline error */}
            {formError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Resetting…</>
              ) : (
                <>Reset password<ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Link expired?{" "}
              <Link
                href="/auth/forgot-password"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Request a new one
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
