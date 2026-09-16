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
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell variant="split">
          <p className="text-center text-sm text-muted-foreground"><T k="common.loading" /></p>
        </AuthShell>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}

type Stage = "form" | "sent";

function ForgotPasswordForm() {
  const { t, rich } = useLanguage();
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
      setFormError(t("forgot.errEmail"));
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
            {t("forgot.checkInbox")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {rich("forgot.sentBody", {
              email: <span className="font-semibold text-foreground">{sentEmail}</span>,
            })}
          </p>
          <div className="mt-6 rounded-xl border border-border bg-muted/50 px-4 py-3.5 text-left space-y-2">
            <p className="text-xs font-semibold text-foreground">{t("forgot.nextTitle")}</p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
              <li>{t("forgot.step1")}</li>
              <li>
                {rich("forgot.step2", {
                  button: <span className="font-medium text-foreground">&quot;Reset Password&quot;</span>,
                })}
              </li>
              <li>{t("forgot.step3")}</li>
            </ol>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            {rich("forgot.didntGet", {
              retry: (
                <button
                  type="button"
                  onClick={() => {
                    setStage("form");
                    setFormError(null);
                  }}
                  className={`${authLinkClass} text-xs`}
                >
                  {t("forgot.tryAgain")}
                </button>
              ),
            })}
          </p>
          <p className="mt-6">
            <Link href="/auth/login" className={authLinkClass}>
              {t("auth.backToLogin")}
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
          {t("forgot.title")}
        </h1>
        <p className={authSubheadingClass}>
          {t("forgot.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="sr-only">{t("forgot.emailLabel")}</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("forgot.emailPlaceholder")}
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
                {t("forgot.sending")}
              </span>
            ) : (
              t("forgot.send")
            )}
          </button>

          <p className="pt-1 text-center">
            <Link href="/auth/login" className={`text-sm ${authLinkClass}`}>
              {t("auth.backToLogin")}
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
