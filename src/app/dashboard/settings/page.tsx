"use client";

import {
  useGetNotificationPreferencesQuery,
  useSetNotificationPreferenceMutation,
} from "@/redux/features/comms/commsApi";
import MfaSecurityCard from "@/components/auth/MfaSecurityCard";
import { Bell, Loader2, Lock } from "lucide-react";

/**
 * Member settings: MFA security + notification preferences.
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

  const rows = (preferences ?? []).filter(
    (p) => !p.type.startsWith("ADMIN_") && LABELS[p.type]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Security and notification preferences.
        </p>
      </div>

      <MfaSecurityCard />

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h2>
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
                  {row.locked && row.lockReason && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {row.lockReason}
                    </p>
                  )}
                </div>
                <div className="w-14 flex justify-center">
                  <Toggle
                    checked={row.inApp}
                    disabled={row.locked}
                    onChange={(inApp) =>
                      setPreference({
                        type: row.type,
                        channel: "IN_APP",
                        enabled: inApp,
                      })
                    }
                  />
                </div>
                <div className="w-14 flex justify-center">
                  <Toggle
                    checked={row.email}
                    disabled={row.locked}
                    onChange={(email) =>
                      setPreference({
                        type: row.type,
                        channel: "EMAIL",
                        enabled: email,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  onChange: (next: boolean) => void;
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
