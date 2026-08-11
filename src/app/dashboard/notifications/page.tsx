"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/features/notifications/notificationsApi";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetNotificationsQuery({
    page: 1,
    limit: 50,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();

  const items = data?.data ?? [];
  const unread = data?.meta?.unreadCount ?? 0;

  async function openNotification(id: string, link: string | null, isRead: boolean) {
    if (!isRead) {
      try {
        await markRead(id).unwrap();
      } catch {
        /* ignore — still navigate */
      }
    }
    if (link) router.push(link);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-emerald-600" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0
              ? `${unread} unread`
              : "You're all caught up."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/settings"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Notification settings
          </Link>
          {unread > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={() => markAll()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-60"
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
          <p className="text-sm font-semibold text-foreground">No notifications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Updates about sessions, messages, and your journey will show up here.
          </p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => openNotification(n.id, n.link, n.isRead)}
                className={`w-full text-left px-4 py-3.5 hover:bg-muted/50 transition-colors ${
                  !n.isRead ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-emerald-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`text-sm ${
                          n.isRead
                            ? "text-foreground"
                            : "font-semibold text-foreground"
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
