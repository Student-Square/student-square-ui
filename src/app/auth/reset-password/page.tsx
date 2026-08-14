"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import AuthShell from "@/components/auth/AuthShell";
import {
  authButtonClass,
  authInputClass,
  authLinkClass,
  authHeadingClass,
  authSubheadingClass,
} from "@/components/auth/auth-ui";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  XCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell variant="split">
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        </AuthShell>
      }
    >
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
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-emerald-500",
  ][strengthScore];
  const strengthTextColor = [
    "",
    "text-red-500",
    "text-yellow-500",
    "text-blue-500",
    "text-emerald-600",
  ][strengthScore];

  if (!token || !email) {
    return (
      <AuthShell variant="split">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-100 dark:bg-red-900/20 dark:ring-red-900/10">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Invalid reset link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This link is missing required parameters. Please request a new one.
          </p>
          <div className="mt-6">
            <Link href="/auth/forgot-password" className={authButtonClass}>
              Request new link
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (stage === "success") {
    return (
      <AuthShell variant="split">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-100 dark:bg-emerald-900/30 dark:ring-emerald-900/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Password reset!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your password has been updated successfully. You can now sign in with
            your new password.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.replace("/auth/login")}
              className={authButtonClass}
            >
              Continue to login
            </button>
          </div>
        </div>
      </AuthShell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (!token || !email) {
      setFormError(
        "This reset link is incomplete. Please request a new password reset email."
      );
      return;
    }

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

  return (
    <AuthShell variant="split">
      <div>
        <h1 className={authHeadingClass}>
          Set new password
        </h1>
        <p className={authSubheadingClass}>
          Resetting password for{" "}
          <span className="font-semibold text-foreground">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="sr-only">New password</span>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password"
                className={`${authInputClass} pr-10`}
              />
              <button
                type="button"
                aria-label={showNew ? "Hide password" : "Show password"}
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
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
                  Strength:{" "}
                  <span className={`font-semibold ${strengthTextColor}`}>
                    {strengthLabel}
                  </span>
                </p>
              </div>
            )}
          </label>

          <label className="block">
            <span className="sr-only">Confirm password</span>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className={`${authInputClass} pr-10 ${
                  confirmPassword.length > 0 && confirmPassword !== newPassword
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    : confirmPassword.length > 0 &&
                        confirmPassword === newPassword
                      ? "border-emerald-500"
                      : ""
                }`}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <p className="mt-1.5 text-[11px] font-medium text-red-500">
                Passwords do not match.
              </p>
            )}
          </label>

          {formError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <button type="submit" disabled={isLoading} className={authButtonClass}>
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting…
              </span>
            ) : (
              "Reset password"
            )}
          </button>

          <p className="pt-1 text-center text-sm text-muted-foreground">
            Link expired?{" "}
            <Link href="/auth/forgot-password" className={authLinkClass}>
              Request a new one
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
