"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MailOpen,
  XCircle,
} from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
    </main>
  );
}

type Stage = "loading" | "success" | "already" | "error" | "missing";

function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const [verifyEmail] = useVerifyEmailMutation();
  const [stage, setStage] = useState<Stage>(token ? "loading" : "missing");
  const [errorMsg, setErrorMsg] = useState("");
  const called = useRef(false); // prevent StrictMode double-fire

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true;

    verifyEmail({ token })
      .unwrap()
      .then((res) => {
        // backend returns { alreadyVerified: boolean }
        const data = res as unknown as { alreadyVerified?: boolean } | null;
        setStage(data?.alreadyVerified ? "already" : "success");
      })
      .catch((err) => {
        const msg: string =
          err?.data?.message ?? "Invalid or expired verification link.";
        setErrorMsg(msg);
        setStage("error");
      });
  }, [token, verifyEmail]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-8 sm:p-10 text-center">

          {/* ── LOADING ── */}
          {stage === "loading" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
                <Loader2 className="h-9 w-9 text-emerald-600 animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Verifying your email…
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This will only take a moment.
              </p>
            </>
          )}

          {/* ── SUCCESS ── */}
          {stage === "success" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 ring-8 ring-emerald-100 dark:ring-emerald-900/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Email verified!
              </h1>
              {email && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{email}</span>{" "}
                  is now confirmed.
                </p>
              )}
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your account is active. You can now sign in to Student Square.
              </p>

              <Link
                href="/auth/login"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
              >
                Continue to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-6 pt-5 border-t border-border">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-emerald-600 transition-colors font-medium"
                >
                  Back to Student Square
                </Link>
              </div>
            </>
          )}

          {/* ── ALREADY VERIFIED ── */}
          {stage === "already" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 ring-8 ring-blue-100 dark:ring-blue-900/20">
                <MailOpen className="h-10 w-10 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Already verified
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This email address has already been verified. You can sign in
                right away.
              </p>

              <Link
                href="/auth/login"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
              >
                Go to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {/* ── ERROR ── */}
          {stage === "error" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 ring-8 ring-red-100 dark:ring-red-900/10">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Verification failed
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorMsg}
              </p>

              <div className="mt-6 rounded-xl bg-muted/50 border border-border px-4 py-3.5 text-left space-y-1.5">
                <p className="text-xs font-semibold text-foreground">What you can do:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Make sure you clicked the most recent verification email.</li>
                  <li>Verification links expire after 24 hours.</li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Register again
                    </Link>{" "}
                    to receive a new link.
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-4 text-xs">
                <Link
                  href="/auth/login"
                  className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <span className="text-border">·</span>
                <Link
                  href="/"
                  className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </div>
            </>
          )}

          {/* ── MISSING TOKEN ── */}
          {stage === "missing" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-900/20 ring-8 ring-yellow-100 dark:ring-yellow-900/10">
                <XCircle className="h-10 w-10 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Invalid link
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This verification link is missing required parameters. Please use
                the link from your email.
              </p>

              <div className="mt-6 flex items-center justify-center gap-4 text-xs pt-5 border-t border-border">
                <Link
                  href="/auth/register"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Register
                </Link>
                <span className="text-border">·</span>
                <Link
                  href="/auth/login"
                  className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
