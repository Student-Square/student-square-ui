"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { AlertCircle, Check, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

/** Moved off the profile pages — password now lives with MFA under Settings → Security. */
export default function PasswordCard() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strengthScore = (() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  })();
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthTextColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-emerald-600"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      setSaved(true);
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to change password. Please try again."
      );
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use at least 8 characters with a mix of cases, numbers and symbols.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <Field label="Current password">
          <PasswordInput
            value={oldPassword}
            onChange={setOldPassword}
            show={showOld}
            onToggle={() => setShowOld((v) => !v)}
            placeholder="Your current password"
            autoComplete="current-password"
          />
        </Field>

        <Field label="New password">
          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            minLength={8}
          />
          {newPassword.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      n <= strengthScore ? strengthColors[strengthScore] : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Strength:{" "}
                <span className={`font-semibold ${strengthTextColors[strengthScore]}`}>
                  {strengthLabels[strengthScore]}
                </span>
              </p>
            </div>
          )}
        </Field>

        <Field label="Confirm new password">
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            error={confirmPassword.length > 0 && confirmPassword !== newPassword}
          />
          {confirmPassword.length > 0 && confirmPassword !== newPassword && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">Passwords do not match.</p>
          )}
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          {saved ? "Updated!" : "Update password"}
        </button>
      </form>
    </section>
  );
}

const INPUT_CLASS =
  "block w-full text-sm px-3 py-2 pr-10 rounded-[0.625rem] bg-background border text-foreground transition-colors focus:outline-none focus:ring-[3px]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function PasswordInput({
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoComplete,
  minLength,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${INPUT_CLASS} ${
          error
            ? "border-red-500/70 focus:ring-red-500/12"
            : "border-border focus:border-emerald-500/70 focus:ring-emerald-500/12"
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
