"use client";

import { useSelector } from "react-redux";
import {
  useGetNotificationPreferencesQuery,
  useSetNotificationPreferenceMutation,
} from "@/redux/features/comms/commsApi";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { metaFor, isStaffType, TONE_CLASS } from "@/components/notifications/notificationMeta";
import { Loader2, Lock } from "lucide-react";

/**
 * Per-type in-app / email switches — FR-18-009.
 *
 * The server returns every type for every user, so staff-only ADMIN_* rows are
 * filtered out for members here. Locked rows are account-record notifications
 * the server refuses to switch off.
 */
export default function NotificationPreferences() {
  const role = useSelector(selectUserRole);
  const { data: preferences, isLoading } = useGetNotificationPreferencesQuery();
  const [setPreference] = useSetNotificationPreferenceMutation();

  // `role` is null for a moment while /me resolves — don't flash staff rows.
  const isStaff = !!role && role !== "MEMBER";
  const personal = (preferences ?? []).filter((p) => !isStaffType(p.type));
  const staffOnly = isStaff
    ? (preferences ?? []).filter((p) => isStaffType(p.type))
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PreferenceTable
        title="My notifications"
        rows={personal}
        onChange={(type, channel, enabled) => setPreference({ type, channel, enabled })}
      />
      {staffOnly.length > 0 && (
        <PreferenceTable
          title="Staff alerts"
          description="Things that need someone on the team to act."
          rows={staffOnly}
          onChange={(type, channel, enabled) => setPreference({ type, channel, enabled })}
        />
      )}
    </div>
  );
}

function PreferenceTable({
  title,
  description,
  rows,
  onChange,
}: {
  title: string;
  description?: string;
  rows: { type: string; locked: boolean; inApp: boolean; email: boolean }[];
  onChange: (type: string, channel: "IN_APP" | "EMAIL", enabled: boolean) => void;
}) {
  if (rows.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>Notification</span>
        <span className="w-12 text-center">In app</span>
        <span className="w-12 text-center">Email</span>
      </div>

      {rows.map((row) => {
        const { label, icon: Icon, tone } = metaFor(row.type);
        return (
          <div
            key={row.type}
            className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3 border-b border-border last:border-0"
          >
            <div className="min-w-0 flex items-center gap-2.5">
              <span
                className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${
                  TONE_CLASS[tone] ?? TONE_CLASS.sky
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm flex items-center gap-1.5 min-w-0">
                <span className="truncate">{label}</span>
                {row.locked && (
                  <Lock
                    className="h-3 w-3 shrink-0 text-muted-foreground"
                    aria-label="Part of your account record — cannot be switched off"
                  />
                )}
              </p>
            </div>
            <div className="w-12 flex justify-center">
              <Toggle
                checked={row.inApp}
                disabled={row.locked}
                label={`${label} in app`}
                onChange={(v) => onChange(row.type, "IN_APP", v)}
              />
            </div>
            <div className="w-12 flex justify-center">
              <Toggle
                checked={row.email}
                disabled={row.locked}
                label={`${label} by email`}
                onChange={(v) => onChange(row.type, "EMAIL", v)}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-10 h-[1.35rem] rounded-full relative transition-colors ${
        checked ? "bg-emerald-600" : "bg-muted-foreground/30"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-[1.05rem] w-[1.05rem] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[1.35rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
