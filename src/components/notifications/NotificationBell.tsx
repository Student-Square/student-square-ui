"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/redux/features/notifications/notificationsApi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { shellBase } from "@/lib/auth-routing";
import { ArrowRight, Bell, CheckCheck, Loader2 } from "lucide-react";
import NotificationRow, { useOpenNotification } from "./NotificationRow";

const PREVIEW_COUNT = 8;

/** Header bell with unread badge and a recent-notifications popover — FR-04-007. */
export default function NotificationBell({ className = "" }: { className?: string }) {
  const base = shellBase(usePathname());
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: PREVIEW_COUNT });
  const [markAll, { isLoading: markingAll }] = useMarkAllNotificationsReadMutation();
  const openNotification = useOpenNotification();

  const items = data?.data ?? [];
  const unread = data?.meta?.unreadCount ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-emerald-600 data-[state=open]:bg-muted data-[state=open]:text-emerald-600 ${className}`}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold leading-[1.1rem] text-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[22rem] max-w-[calc(100vw-1.5rem)] p-0 rounded-2xl border-border overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-sm font-bold text-foreground">
            Notifications
            {unread > 0 && (
              <span className="ml-1.5 text-xs font-semibold text-emerald-600">
                {unread} new
              </span>
            )}
          </p>
          {unread > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={() => markAll()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-emerald-600 disabled:opacity-60"
            >
              {markingAll ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[22rem] overflow-y-auto divide-y divide-border">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">Nothing here yet.</p>
            </div>
          ) : (
            items.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                compact
                onOpen={(item) => openNotification(item, () => setOpen(false))}
              />
            ))
          )}
        </div>

        <Link
          href={`${base}/notifications`}
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-1.5 border-t border-border px-4 py-2.5 text-xs font-semibold text-emerald-600 hover:bg-muted transition-colors"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PopoverContent>
    </Popover>
  );
}
