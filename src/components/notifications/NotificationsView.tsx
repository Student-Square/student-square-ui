"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/redux/features/notifications/notificationsApi";
import { shellBase } from "@/lib/auth-routing";
import { Bell, CheckCheck, Loader2, Settings } from "lucide-react";
import NotificationRow, { useOpenNotification } from "./NotificationRow";
import { dayGroup } from "./notificationMeta";

/**
 * The notifications page for every shell — /dashboard, /panel and /admin all
 * render this. The API is per-user, so the only shell-specific bit is where
 * the settings link points.
 */
export default function NotificationsView() {
  const base = shellBase(usePathname());
  const [tab, setTab] = useState<"all" | "unread">("all");
  const { data, isLoading, isError } = useGetNotificationsQuery({
    page: 1,
    limit: 50,
    ...(tab === "unread" ? { unreadOnly: true } : {}),
  });
  const [markAll, { isLoading: markingAll }] = useMarkAllNotificationsReadMutation();
  const open = useOpenNotification();

  const items = data?.data ?? [];
  const unread = data?.meta?.unreadCount ?? 0;

  // Groups in arrival order — the list is already newest-first from the server.
  const groups: { label: string; items: typeof items }[] = [];
  for (const n of items) {
    const label = dayGroup(n.createdAt);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(n);
    else groups.push({ label, items: [n] });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You're all caught up."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`${base}/settings#notifications`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
          >
            <Settings className="h-3.5 w-3.5" />
            Preferences
          </Link>
          {unread > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={() => markAll()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {markingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="inline-flex rounded-xl border border-border bg-card p-1">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
            {t === "unread" && unread > 0 && (
              <span className="ml-1.5 opacity-80">({unread})</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Could not load notifications. Try again later.
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm font-semibold text-foreground">
            {tab === "unread" ? "Nothing unread" : "No notifications yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Updates about sessions, messages, and your journey will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.label}>
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {group.items.map((n) => (
                  <NotificationRow key={n.id} notification={n} onOpen={open} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
