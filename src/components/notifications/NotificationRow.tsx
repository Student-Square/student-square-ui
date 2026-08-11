"use client";

import { useRouter } from "next/navigation";
import { useMarkNotificationReadMutation } from "@/redux/features/notifications/notificationsApi";
import type { ApiNotification } from "@/types/notifications";
import { metaFor, TONE_CLASS, timeAgo } from "./notificationMeta";

/**
 * Opening a notification marks it read and follows its link. Shared by the
 * bell popover and the full page so "read" never depends on which surface
 * the user clicked from.
 */
export function useOpenNotification() {
  const router = useRouter();
  const [markRead] = useMarkNotificationReadMutation();

  return async (n: ApiNotification, after?: () => void) => {
    if (!n.isRead) {
      try {
        await markRead(n.id).unwrap();
      } catch {
        /* ignore — still navigate */
      }
    }
    after?.();
    if (n.link) router.push(n.link);
  };
}

export default function NotificationRow({
  notification: n,
  compact = false,
  onOpen,
}: {
  notification: ApiNotification;
  compact?: boolean;
  onOpen: (n: ApiNotification) => void;
}) {
  const { icon: Icon, tone } = metaFor(n.type);

  return (
    <button
      type="button"
      onClick={() => onOpen(n)}
      className={`w-full text-left flex items-start gap-3 transition-colors hover:bg-muted/60 ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      } ${!n.isRead ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""}`}
    >
      <span
        className={`shrink-0 rounded-lg flex items-center justify-center ${
          compact ? "h-8 w-8" : "h-9 w-9"
        } ${TONE_CLASS[tone] ?? TONE_CLASS.sky}`}
      >
        <Icon className={compact ? "h-4 w-4" : "h-[1.1rem] w-[1.1rem]"} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`text-sm leading-snug ${
              n.isRead ? "text-foreground" : "font-semibold text-foreground"
            }`}
          >
            {n.title}
          </span>
          <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
            {timeAgo(n.createdAt)}
          </span>
        </span>
        {n.body && (
          <span
            className={`mt-0.5 block text-xs text-muted-foreground ${
              compact ? "line-clamp-1" : "line-clamp-2"
            }`}
          >
            {n.body}
          </span>
        )}
      </span>

      {!n.isRead && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
      )}
    </button>
  );
}
