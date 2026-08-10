"use client";

import {
  useGetNotificationPreferencesQuery,
  useSetNotificationPreferenceMutation,
} from "@/redux/features/comms/commsApi";
import { Bell, Loader2, Lock } from "lucide-react";

/**
 * FR-18-009 — notification preferences per type and channel.
 *
 * Locked rows are shown rather than hidden, with the reason. A setting that
 * silently is not there reads as a missing feature; a setting that is visibly
 * locked reads as a decision, which is what it is.
 */

const LABELS: Record<string, string> = {
  STORY_APPROVED: "Your story was approved",
  STORY_REJECTED: "Your story was not accepted",
  COMMENT_APPROVED: "Your comment was published",
  COMMENT_REJECTED: "Your comment was removed",
  COMMENT_REPLY: "Someone replied to your comment",
  DONATION_RECEIVED: "Donation received",
  RECEIPT_AVAILABLE: "A receipt is ready",
  STATEMENT_AVAILABLE: "A statement is ready",
  CARE_ASSIGNED: "A counsellor or mentor was assigned",
  CARE_ASSIGNMENT_ENDED: "An assignment ended",
  REPORT_SHARED: "A report was shared with you",
  GOAL_ASSIGNED: "A new goal was added",
  GOAL_MISSED: "A goal passed its due date",
  SESSION_BOOKED: "A session was booked",
  SESSION_REMINDER: "Session reminders",
  SESSION_CANCELLED: "A session was cancelled",
  BADGE_EARNED: "You earned a badge",
  RANK_CHANGED: "Your rank changed",
  NEW_MESSAGE: "New message",
  RESOURCE_ASSIGNED: "A resource was shared with you",
  FEEDBACK_ANSWERED: "We replied to your feedback",
  ANNOUNCEMENT: "Announcements from Student Square",
};

export default function NotificationSettingsPage() {
  const { data: preferences, isLoading } = useGetNotificationPreferencesQuery();
  const [setPreference] = useSetNotificationPreferenceMutation();

  // Staff-only alert types are filtered out — a member has no use for a row
  // that will never fire for them.
  const rows = (preferences ?? []).filter(
    (p) => !p.type.startsWith("ADMIN_") && LABELS[p.type]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose what reaches you, and where.
        </p>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Notification</span>
            <span className="w-14 text-center">In app</span>
            <span className="w-14 text-center">Email</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.type}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm flex items-center gap-1.5">
                  {LABELS[row.type]}
                  {row.locked && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </p>
                {row.locked && (
                  <p className="text-[11px] text-muted-foreground">
                    Part of your account record — always sent.
                  </p>
                )}
              </div>

              <Toggle
                checked={row.inApp}
                disabled={row.locked}
                onChange={(enabled) =>
                  setPreference({ type: row.type, channel: "IN_APP", enabled })
                }
              />
              <Toggle
                checked={row.email}
                disabled={row.locked}
                onChange={(enabled) =>
                  setPreference({ type: row.type, channel: "EMAIL", enabled })
                }
              />
            </div>
          ))}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Bell className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        Announcements and newsletters also carry a one-click unsubscribe link.
        Using it stops all non-essential email to your address, whatever these
        switches say.
      </p>
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-14 h-6 rounded-full relative transition-colors ${
        checked ? "bg-emerald-600" : "bg-muted-foreground/30"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-8" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
