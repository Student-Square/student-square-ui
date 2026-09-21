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
import AuthShell from "@/components/auth/AuthShell";
import OtpQrCode from "@/components/auth/OtpQrCode";
import {
  authButtonClass,
  authCodeInputClass,
  authHeadingClass,
  authLoginButtonClass,
  authLoginInputClass,
  authLoginLinkClass,
  authSubheadingClass,
} from "@/components/auth/auth-ui";
import {
  AlertCircle,
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";

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
    <AuthShell variant="login">
      <p className="text-center text-sm text-muted-foreground"><T k="common.loading" /></p>
    </AuthShell>
  );
}

function LoginForm() {
  const { t, rich } = useLanguage();
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
  const [enrolSignedIn, setEnrolSignedIn] = useState(false);
  const [codesAcknowledged, setCodesAcknowledged] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const busy = loginLoading || enrolLoading || confirmLoading;

  useEffect(() => {
    // Enrolment signs the account in, but these recovery codes are shown
    // exactly once — redirecting out from under them would lose them for
    // good. The step's own button acknowledges them and releases this.
    if (step === "recovery" && !codesAcknowledged) return;
    if (isAuthenticated && user) {
      router.replace(pickPostLoginDestination(user.role, next));
    }
  }, [isAuthenticated, user, next, router, step, codesAcknowledged]);

  function errMessage(err: unknown, fallback: string) {
    const data = (
      err as {
        data?: { message?: string; error?: { body?: { field: string }[] } };
      }
    )?.data;
    // A 400 only says "Validation failed"; name the field so the visitor
    // knows what to change.
    const fields = data?.error?.body?.map((issue) => issue.field) ?? [];
    if (fields.includes("email")) {
      return t("contact.errorEmail");
    }
    if (fields.includes("mfaCode")) {
      return t("login.errCode");
    }
    return data?.message ?? fallback;
  }

  async function finishWithSession(result: LoginResult) {
    if ("accessToken" in result && result.accessToken) {
      toast.success(t("login.welcome"));
      return true;
    }
    return false;
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) {
      setFormError(t("login.errRequired"));
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
        toast.message(t("login.toastSetup"));
        return;
      }

      if ("mfaRequired" in result && result.mfaRequired) {
        setMfaCode("");
        setUseRecovery(false);
        setRecoveryCode("");
        setStep("mfa");
        toast.message(t("login.toastEnterCode"));
        return;
      }

      setFormError(t("login.errUnexpected"));
    } catch (err) {
      setFormError(errMessage(err, t("common.somethingWrong")));
    }
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (useRecovery) {
      if (recoveryCode.trim().length < 8) {
        setFormError(t("login.errRecovery"));
        return;
      }
    } else if (!/^\d{6}$/.test(mfaCode.trim())) {
      setFormError(t("login.errCode"));
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
      setFormError(t("login.errFresh"));
    } catch (err) {
      setFormError(errMessage(err, t("login.errInvalidCode")));
    }
  }

  async function handleEnrolConfirm(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!enrolmentToken) {
      setFormError(t("login.errEnrolExpired"));
      setStep("credentials");
      return;
    }
    if (!/^\d{6}$/.test(mfaCode.trim())) {
      setFormError(t("login.errCode"));
      return;
    }

    try {
      const confirmed = await confirmEnrol({
        enrolmentToken,
        code: mfaCode.trim(),
      }).unwrap();
      setRecoveryCodes(confirmed.recoveryCodes ?? []);
      setEnrolSignedIn(Boolean(confirmed.accessToken));
      setStep("recovery");
      toast.success(t("login.toastEnabled"));
    } catch (err) {
      setFormError(errMessage(err, t("login.errInvalidCode")));
    }
  }

  async function handleContinueAfterRecovery() {
    setFormError(null);
    // Enrolment that ran inside a login already returned a session: password
    // plus authenticator were both proven, so go straight in. The redirect
    // effect picks the destination as soon as /me has landed.
    if (enrolSignedIn) {
      setCodesAcknowledged(true);
      return;
    }
    // Enrolment from an existing session issues no new one: still owed a code.
    setMfaCode("");
    setUseRecovery(false);
    setStep("mfa");
  }

  async function copySecret() {
    if (!mfaSecret) return;
    try {
      await navigator.clipboard.writeText(mfaSecret);
      toast.success(t("login.toastSecretCopied"));
    } catch {
      toast.error(t("login.toastSecretFailed"));
    }
  }

  async function copyRecoveryCodes() {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toast.success(t("login.toastCodesCopied"));
    } catch {
      toast.error(t("login.toastCopyFailed"));
    }
  }

  const title = step === "credentials" ? t("login.welcome") : t(`login.title.${step}`);
  const subtitle = t(`login.sub.${step}`);

  return (
    <AuthShell variant="login">
      <div>
        {step === "credentials" && (
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t("login.eyebrow")}
          </p>
        )}
        <div className="flex items-start gap-3">
          {(step === "mfa" || step === "enrol" || step === "recovery") && (
            <div className="mt-1 rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          )}
          <div>
            <h1 className={authHeadingClass}>
              {title}
            </h1>
            <p className={authSubheadingClass}>{subtitle}</p>
          </div>
        </div>

        {step === "credentials" && (
          <form onSubmit={handleCredentials} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-center text-sm text-gray-500">
              <span className="rounded-lg bg-white px-4 py-3 font-semibold text-gray-900 shadow-sm">
                {t("login.tabLogin")}
              </span>
              <Link
                href="/auth/register"
                className="rounded-lg px-4 py-3 transition-colors hover:text-gray-900"
              >
                {t("login.tabRegister")}
              </Link>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-gray-700">
                {t("contact.emailAddress")}
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                // type="email" alone accepts "name@example"; the server
                // wants a domain with a dot in it.
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                title={t("login.emailTitle")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                className={authLoginInputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-gray-700">
                {t("auth.password")}
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  className={`${authLoginInputClass} pr-10`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {formError && <FormError message={formError} />}

            <p className="text-right">
              <Link
                href="/auth/forgot-password"
                className={`text-xs ${authLoginLinkClass}`}
              >
                {t("forgot.title")}
              </Link>
            </p>

            <button
              type="submit"
              disabled={busy}
              className={authLoginButtonClass}
            >
              {busy ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("login.signingIn")}
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  {t("login")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        )}

          {step === "enrol" && (
            <form onSubmit={handleEnrolConfirm} className="mt-6 space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm text-foreground">
                  {t("login.enrolStep1")}
                  <br />
                  {t("login.enrolStep2")}
                  <br />
                  {t("login.enrolStep3")}
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
                      {t("login.copy")}
                    </button>
                  </div>
                )}
                {otpauthUrl && <OtpQrCode otpauthUrl={otpauthUrl} />}
              </div>

              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {t("login.codeLabel")}
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
                    className={`${authCodeInputClass} tracking-[0.3em]`}
                  />
                </div>
              </label>

              {formError && <FormError message={formError} />}

              <button
                type="submit"
                disabled={busy}
                className={authButtonClass}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("login.verifying")}
                  </>
                ) : (
                  t("login.enable")
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
                {t("login.backToCredentials")}
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
                {t("login.copyCodes")}
              </button>
              {formError && <FormError message={formError} />}
              <button
                type="button"
                onClick={handleContinueAfterRecovery}
                className={authButtonClass}
              >
                {t(enrolSignedIn ? "login.continueSignedIn" : "login.continueVerify")}
              </button>
            </div>
          )}

          {step === "mfa" && (
            <form onSubmit={handleMfa} className="mt-6 space-y-4">
              <p className="text-xs text-muted-foreground">
                {rich("login.signingInAs", { email: <span className="font-semibold text-foreground">{email}</span> })}
              </p>

              {!useRecovery ? (
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("login.codeLabel")}
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
                      className={`${authCodeInputClass} tracking-[0.3em]`}
                    />
                  </div>
                </label>
              ) : (
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("login.recoveryLabel")}
                  </span>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      autoComplete="one-time-code"
                      required
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="XXXXX-XXXXX"
                      className={authCodeInputClass}
                    />
                  </div>
                </label>
              )}

              {formError && <FormError message={formError} />}

              <button
                type="submit"
                disabled={busy}
                className={authButtonClass}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("login.verifying")}
                  </>
                ) : (
                  t("login.verifyContinue")
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
                  {useRecovery ? t("login.useCode") : t("login.useRecovery")}
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
                  {t("auth.back")}
                </button>
              </div>
            </form>
          )}

          {step === "credentials" && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {rich("login.noAccount", {
                link: (
                  <Link href="/auth/register" className={authLoginLinkClass}>
                    {t("login.registerHere")}
                  </Link>
                ),
              })}
            </p>
          )}
      </div>
    </AuthShell>
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
