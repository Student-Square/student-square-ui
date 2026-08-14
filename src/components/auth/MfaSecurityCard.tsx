"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useBeginMfaEnrolmentMutation,
  useConfirmMfaEnrolmentMutation,
  useDisableMfaMutation,
  useGetMeQuery,
} from "@/redux/features/auth/authApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

/**
 * Per-account MFA enable / disable + short setup guide.
 *
 * Policy (server):
 * - MFA_ENFORCE=true (default): all non-MEMBER roles must enrol; cannot disable
 * - MFA_ENFORCE=false: MFA optional for everyone; anyone can disable
 * - MEMBER: always optional
 */
export default function MfaSecurityCard() {
  const user = useSelector(selectCurrentUser);
  const { refetch, isFetching } = useGetMeQuery();
  const [beginEnrol, { isLoading: starting }] = useBeginMfaEnrolmentMutation();
  const [confirmEnrol, { isLoading: confirming }] =
    useConfirmMfaEnrolmentMutation();
  const [disableMfa, { isLoading: disabling }] = useDisableMfaMutation();

  const [mode, setMode] = useState<"idle" | "setup" | "recovery">("idle");
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const enabled = Boolean(user.mfaEnabled);
  const required = Boolean(user.mfaRequired);
  const enforced = user.mfaEnforced !== false;
  const busy = starting || confirming || disabling || isFetching;

  async function startSetup() {
    setError(null);
    try {
      const data = await beginEnrol().unwrap();
      setSecret(data.secret);
      setOtpauthUrl(data.otpauthUrl);
      setCode("");
      setMode("setup");
    } catch (err) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ??
          "Could not start MFA setup"
      );
    }
  }

  async function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit authenticator code");
      return;
    }
    try {
      const data = await confirmEnrol({ code: code.trim() }).unwrap();
      setRecoveryCodes(data.recoveryCodes ?? []);
      setMode("recovery");
      toast.success("Authenticator enabled");
      await refetch();
    } catch (err) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ??
          "Invalid verification code"
      );
    }
  }

  async function handleDisable() {
    setError(null);
    if (required) {
      setError("MFA is mandatory for your role and cannot be turned off.");
      return;
    }
    if (!window.confirm("Turn off authenticator for this account?")) return;
    try {
      await disableMfa().unwrap();
      toast.success("Authenticator disabled");
      setMode("idle");
      setSecret(null);
      setOtpauthUrl(null);
      setRecoveryCodes([]);
      await refetch();
    } catch (err) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ??
          "Could not disable MFA"
      );
    }
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-foreground">
            Two-factor authentication (MFA)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Extra sign-in step with an authenticator app (Google Authenticator,
            Authy, etc.).
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
            enabled
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {enabled ? "On" : "Off"}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm space-y-2">
        <p className="font-semibold text-foreground">How it works</p>
        <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
          <li>Install Google Authenticator or Authy on your phone.</li>
          <li>Click Enable below — scan the QR or paste the secret key.</li>
          <li>Enter the 6-digit code to confirm.</li>
          <li>Save the recovery codes (shown once).</li>
          <li>At next login, enter email, password, then the 6-digit code.</li>
        </ol>
        <p className="text-xs text-muted-foreground pt-1">
          Policy:{" "}
          {enforced ? (
            <>
              MFA is <strong className="text-foreground">required for staff</strong>{" "}
              (admin, counsellor, mentor, etc.). Members may turn it on or off.
            </>
          ) : (
            <>
              Platform enforcement is <strong className="text-foreground">off</strong>{" "}
              (`MFA_ENFORCE=false`) — MFA is optional for everyone.
            </>
          )}
          {required && (
            <> Your role currently <strong className="text-foreground">must</strong> keep MFA on.</>
          )}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          {!enabled ? (
            <button
              type="button"
              disabled={busy}
              onClick={startSetup}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {starting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Enable authenticator
            </button>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Authenticator is active on this account
              </div>
              <button
                type="button"
                disabled={busy || required}
                onClick={handleDisable}
                title={
                  required
                    ? "MFA is mandatory for your role"
                    : "Turn off authenticator"
                }
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {disabling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldOff className="h-4 w-4" />
                )}
                Disable
              </button>
            </>
          )}
        </div>
      )}

      {mode === "setup" && (
        <form onSubmit={confirmSetup} className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Scan this QR in your authenticator app, or enter the secret manually.
            </p>
            {otpauthUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauthUrl)}`}
                alt="MFA QR code"
                width={180}
                height={180}
                className="mx-auto rounded-md border border-border bg-white p-2"
              />
            )}
            {secret && (
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded-md border border-border px-3 py-2 font-mono text-xs">
                  {secret}
                </code>
                <button
                  type="button"
                  onClick={() => copy(secret, "Secret")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            )}
          </div>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              6-digit code
            </span>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                className="w-full pl-9 pr-3 py-2.5 text-sm tracking-[0.3em] font-mono rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {confirming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Confirm and enable
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setError(null);
                setCode("");
              }}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "recovery" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Save these recovery codes now — they are shown only once. Each code
            works one time if you lose your phone.
          </p>
          <ul className="rounded-xl border border-border bg-background p-4 font-mono text-xs space-y-1">
            {recoveryCodes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(recoveryCodes.join("\n"), "Recovery codes")}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              <Copy className="h-4 w-4" />
              Copy codes
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setRecoveryCodes([]);
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
