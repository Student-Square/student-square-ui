"use client";

import Link from "next/link";
import { useGetNotificationsQuery } from "@/redux/features/notifications/notificationsApi";
import { Bell } from "lucide-react";

/** Header bell with unread badge — FR-04-007. */
export default function NotificationBell({ className = "" }: { className?: string }) {
  const { data } = useGetNotificationsQuery({ page: 1, limit: 1 });
  const unread = data?.meta?.unreadCount ?? 0;

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={
        unread > 0
          ? `Notifications, ${unread} unread`
          : "Notifications"
      }
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-emerald-600 ${className}`}
    >
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold leading-[1.1rem] text-center">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
