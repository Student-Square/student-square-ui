"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import AuthShell from "@/components/auth/AuthShell";
import {
  authButtonClass,
  authInputClass,
  authLinkClass,
  authHeadingClass,
  authSubheadingClass,
} from "@/components/auth/auth-ui";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell variant="split">
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        </AuthShell>
      }
    >
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
    if (!trimmed) {
      setFormError("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword({ email: trimmed }).unwrap();
      setSentEmail(trimmed);
      setStage("sent");
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
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
      <AuthShell variant="split">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Check your inbox
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If an account exists for{" "}
            <span className="font-semibold text-foreground">{sentEmail}</span>,
            we&apos;ve sent a password reset link. It expires in 15 minutes.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-muted/50 px-4 py-3.5 text-left space-y-2">
            <p className="text-xs font-semibold text-foreground">What to do next:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
              <li>Open the email from Student Square.</li>
              <li>
                Click the{" "}
                <span className="font-medium text-foreground">
                  &quot;Reset Password&quot;
                </span>{" "}
                button.
              </li>
              <li>Choose a new password and sign in.</li>
            </ol>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Didn&apos;t get it? Check spam, or{" "}
            <button
              type="button"
              onClick={() => {
                setStage("form");
                setFormError(null);
              }}
              className={`${authLinkClass} text-xs`}
            >
              try again
            </button>
            .
          </p>
          <p className="mt-6">
            <Link href="/auth/login" className={authLinkClass}>
              Back to login
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell variant="split">
      <div>
        <h1 className={authHeadingClass}>
          Forgot password?
        </h1>
        <p className={authSubheadingClass}>
          Enter your email and we&apos;ll send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={authInputClass}
            />
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
                Sending…
              </span>
            ) : (
              "Send reset link"
            )}
          </button>

          <p className="pt-1 text-center">
            <Link href="/auth/login" className={`text-sm ${authLinkClass}`}>
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
