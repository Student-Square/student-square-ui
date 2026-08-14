"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useBeginMfaEnrolmentMutation,
  useConfirmMfaEnrolmentMutation,
  useLoginMutation,
  type LoginResult,
} from "@/redux/features/auth/authApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { pickPostLoginDestination } from "@/lib/auth-routing";
import AuthBrand from "@/components/auth/AuthBrand";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

type Step = "credentials" | "mfa" | "enrol" | "recovery";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
      <AuthBrand />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [beginEnrol, { isLoading: enrolLoading }] =
    useBeginMfaEnrolmentMutation();
  const [confirmEnrol, { isLoading: confirmLoading }] =
    useConfirmMfaEnrolmentMutation();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [enrolmentToken, setEnrolmentToken] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const busy = loginLoading || enrolLoading || confirmLoading;

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(pickPostLoginDestination(user.role, next));
    }
  }, [isAuthenticated, user, next, router]);

  function errMessage(err: unknown, fallback: string) {
    return (
      (err as { data?: { message?: string } })?.data?.message ?? fallback
    );
  }

  async function finishWithSession(result: LoginResult) {
    if ("accessToken" in result && result.accessToken) {
      toast.success("Welcome back!");
      return true;
    }
    return false;
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError("Email and password are required.");
      return;
    }
    try {
      const result = await login({
        email: email.trim(),
        password,
      }).unwrap();

      if (await finishWithSession(result)) return;

      if ("mfaEnrolmentRequired" in result && result.mfaEnrolmentRequired) {
        setEnrolmentToken(result.enrolmentToken);
        const enrol = await beginEnrol({
          enrolmentToken: result.enrolmentToken,
        }).unwrap();
        setMfaSecret(enrol.secret);
        setOtpauthUrl(enrol.otpauthUrl);
        setMfaCode("");
        setStep("enrol");
        toast.message("Set up authenticator to continue");
        return;
      }

      if ("mfaRequired" in result && result.mfaRequired) {
        setMfaCode("");
        setUseRecovery(false);
        setRecoveryCode("");
        setStep("mfa");
        toast.message("Enter your authenticator code");
        return;
      }

      setFormError("Unexpected login response. Please try again.");
    } catch (err) {
      setFormError(errMessage(err, "Something went wrong. Please try again."));
    }
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (useRecovery) {
      if (recoveryCode.trim().length < 8) {
        setFormError("Enter a valid recovery code.");
        return;
      }
    } else if (!/^\d{6}$/.test(mfaCode.trim())) {
      setFormError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password,
        ...(useRecovery
          ? { recoveryCode: recoveryCode.trim() }
          : { mfaCode: mfaCode.trim() }),
      }).unwrap();

      if (await finishWithSession(result)) return;
      setFormError("Could not complete sign-in. Try a fresh code.");
    } catch (err) {
      setFormError(errMessage(err, "Invalid verification code."));
    }
  }

  async function handleEnrolConfirm(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!enrolmentToken) {
      setFormError("Enrolment expired. Sign in again.");
      setStep("credentials");
      return;
    }
    if (!/^\d{6}$/.test(mfaCode.trim())) {
      setFormError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    try {
      const confirmed = await confirmEnrol({
        enrolmentToken,
        code: mfaCode.trim(),
      }).unwrap();
      setRecoveryCodes(confirmed.recoveryCodes ?? []);
      setStep("recovery");
      toast.success("Authenticator enabled");
    } catch (err) {
      setFormError(errMessage(err, "Invalid verification code."));
    }
  }

  async function handleContinueAfterRecovery() {
    setFormError(null);
    setMfaCode("");
    setUseRecovery(false);
    setStep("mfa");
  }

  async function copySecret() {
    if (!mfaSecret) return;
    try {
      await navigator.clipboard.writeText(mfaSecret);
      toast.success("Secret copied");
    } catch {
      toast.error("Could not copy — select the secret manually");
    }
  }

  async function copyRecoveryCodes() {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toast.success("Recovery codes copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  const title =
    step === "credentials"
      ? "Welcome back"
      : step === "enrol"
        ? "Set up authenticator"
        : step === "recovery"
          ? "Save recovery codes"
          : "Two-factor verification";

  const subtitle =
    step === "credentials"
      ? "Sign in to your Student Square account."
      : step === "enrol"
        ? "Staff accounts require an authenticator app before access."
        : step === "recovery"
          ? "These codes are shown once. Store them somewhere safe."
          : "Enter the code from your authenticator app.";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <AuthBrand />
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Student Square
        </Link>

        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-emerald-500/5 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            {(step === "mfa" || step === "enrol" || step === "recovery") && (
              <div className="mt-1 rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {step === "credentials" && (
            <form onSubmit={handleCredentials} className="mt-6 space-y-4">
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

              <label className="block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </span>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </label>

              {formError && <FormError message={formError} />}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === "enrol" && (
            <form onSubmit={handleEnrolConfirm} className="mt-6 space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm text-foreground">
                  1. Open Google Authenticator / Authy
                  <br />
                  2. Add account → enter setup key
                  <br />
                  3. Paste the secret below, then enter the 6-digit code
                </p>
                {mfaSecret && (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs sm:text-sm break-all rounded-md bg-background border border-border px-3 py-2 font-mono">
                      {mfaSecret}
                    </code>
                    <button
                      type="button"
                      onClick={copySecret}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                )}
                {otpauthUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUrl)}`}
                    alt="Authenticator QR code"
                    width={180}
                    height={180}
                    className="mx-auto rounded-md border border-border bg-white p-2"
                  />
                )}
              </div>

              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Authenticator code
                </span>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={mfaCode}
                    onChange={(e) =>
                      setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 text-sm tracking-[0.3em] font-mono rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  />
                </div>
              </label>

              {formError && <FormError message={formError} />}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Enable authenticator
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setFormError(null);
                  setMfaCode("");
                }}
                className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Back to email / password
              </button>
            </form>
          )}

          {step === "recovery" && (
            <div className="mt-6 space-y-4">
              <ul className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs sm:text-sm space-y-1.5">
                {recoveryCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={copyRecoveryCodes}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <Copy className="h-4 w-4" />
                Copy recovery codes
              </button>
              {formError && <FormError message={formError} />}
              <button
                type="button"
                onClick={handleContinueAfterRecovery}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                Continue to verification
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "mfa" && (
            <form onSubmit={handleMfa} className="mt-6 space-y-4">
              <p className="text-xs text-muted-foreground">
                Signing in as <span className="font-semibold text-foreground">{email}</span>
              </p>

              {!useRecovery ? (
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Authenticator code
                  </span>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      value={mfaCode}
                      onChange={(e) =>
                        setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2.5 text-sm tracking-[0.3em] font-mono rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    />
                  </div>
                </label>
              ) : (
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Recovery code
                  </span>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      autoComplete="one-time-code"
                      required
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="XXXXX-XXXXX"
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-mono rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    />
                  </div>
                </label>
              )}

              {formError && <FormError message={formError} />}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify and continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setUseRecovery((v) => !v);
                    setFormError(null);
                  }}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {useRecovery ? "Use authenticator code" : "Use a recovery code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setFormError(null);
                    setMfaCode("");
                    setRecoveryCode("");
                  }}
                  className="font-semibold text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {step === "credentials" && (
            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
