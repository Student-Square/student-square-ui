"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-background"><p className="text-sm text-muted-foreground">Loading…</p></main>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

type Stage = "form" | "sent";

function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = email.trim();
    if (!trimmed) { setFormError("Please enter your email address."); return; }

    try {
      await forgotPassword({ email: trimmed }).unwrap();
      setSentEmail(trimmed);
      setStage("sent");
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      // Backend intentionally returns success even for unknown emails (no enumeration).
      // Only surface real server errors.
      if (msg && !msg.toLowerCase().includes("not found")) {
        setFormError(msg);
      } else {
        setSentEmail(trimmed);
        setStage("sent");
      }
    }
  }

  if (stage === "sent") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
        <Backdrop />
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-8 sm:p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Check your inbox</h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              If an account exists for{" "}
              <span className="font-semibold text-foreground">{sentEmail}</span>,
              we&apos;ve sent a password reset link. It expires in 15 minutes.
            </p>
            <div className="mt-6 rounded-xl bg-muted/50 border border-border px-4 py-3.5 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">What to do next:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
                <li>Open the email from Student Square.</li>
                <li>Click the <span className="font-medium text-foreground">&quot;Reset Password&quot;</span> button.</li>
                <li>Choose a new password and sign in.</li>
              </ol>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Didn&apos;t get it? Check spam, or{" "}
              <button
                onClick={() => { setStage("form"); setFormError(null); }}
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
            <Mail className="h-5 w-5 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Forgot password?
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email address
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
                <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
              ) : (
                <>Send reset link<ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
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
