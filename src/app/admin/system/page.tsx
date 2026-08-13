"use client";

import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import {
  useGetFeaturesQuery,
  useSetFeatureMutation,
} from "@/redux/features/system/systemApi";

/**
 * System Admin only. Every switch here closes a whole module — its public API
 * and its admin API together — for everyone, immediately. Sign-in, user
 * administration, profiles and this page itself are not listed: they are what
 * you need in order to switch anything back on.
 */

const LABELS: Record<string, string> = {
  blogs: "Blog",
  stories: "Real Life Stories",
  campaigns: "Donation Campaigns",
  donations: "Donations",
  payments: "Online Payment (SSLCommerz)",
  comments: "Comments",
  content: "Site Content & Pages",
  media: "Media Library",
  moderation: "Moderation Queue",
  notifications: "Notifications",
  operations: "Daily Operation Book",
  finance: "Financial Work Book",
  books: "All Books",
  assessments: "Assessments",
  care: "Care & Caseload",
  roadmap: "Roadmaps & Goals",
  sessions: "Sessions & Booking",
  rank: "Ranks & Badges",
  badges: "Badge Administration",
  messaging: "Messaging",
  feedback: "Feedback",
  resources: "Resources",
  comms: "Bulk Email & SMS",
  analytics: "Analytics",
  magazines: "Magazine",
  events: "Events",
  "audit-logs": "Audit Log",
  "data-requests": "Data Requests (DSR)",
};

export default function AdminSystemPage() {
  const role = useSelector(selectUserRole);
  const { data: features, isLoading, isError } = useGetFeaturesQuery(undefined, {
    skip: role !== "SYSTEM_ADMIN",
  });
  const [setFeature, { isLoading: isSaving }] = useSetFeatureMutation();

  if (role !== "SYSTEM_ADMIN") {
    return (
      <div className="max-w-2xl flex items-start gap-3 rounded-lg border border-border bg-card p-5">
        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">System Admin only</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Feature switches are restricted to the system administrator.
          </p>
        </div>
      </div>
    );
  }

  const toggle = async (key: string, enabled: boolean) => {
    try {
      await setFeature({ key, enabled }).unwrap();
      toast.success(`${LABELS[key] ?? key} ${enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Could not change that feature"
      );
    }
  };

  const disabledCount = features?.filter((f) => !f.enabled).length ?? 0;

  return (
    <div className="space-y-6 max-w-3xl 2xl:max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          System Features
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch any part of the site off for everyone. A disabled feature stops
          answering on both its public and its admin routes — sign-in, user
          administration and this page always stay on.
        </p>
      </div>

      {disabledCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {disabledCount} feature{disabledCount === 1 ? " is" : "s are"}{" "}
          currently switched off.
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-16">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading features…
        </div>
      )}
      {isError && (
        <p className="text-sm text-red-600 py-6">Failed to load features.</p>
      )}

      {features && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {features.map((f) => (
            <li
              key={f.key}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {LABELS[f.key] ?? f.key}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  /{f.key}
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`text-xs font-semibold ${
                    f.enabled
                      ? "text-emerald-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {f.enabled ? "On" : "Off"}
                </span>
                <Switch
                  checked={f.enabled}
                  disabled={isSaving}
                  onCheckedChange={(next) => toggle(f.key, next)}
                  aria-label={`Toggle ${LABELS[f.key] ?? f.key}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
