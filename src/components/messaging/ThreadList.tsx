"use client";

import Link from "next/link";
import { useGetThreadsQuery } from "@/redux/features/comms/commsApi";
import { formatDateTime } from "@/lib/care";
import { Loader2, MessageSquare } from "lucide-react";

/**
 * Shared by the member's Messages screen and the care panel's. The only thing
 * that differs is where a row links to, so that is the only prop.
 */
export function ThreadList({ basePath }: { basePath: string }) {
  const { data: threads, isLoading } = useGetThreadsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading conversations…
      </div>
    );
  }

  if (!threads?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">
          No conversations yet. A thread opens once a counsellor or mentor is
          assigned.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {threads.map((thread) => (
        <li key={thread.id}>
          <Link
            href={`${basePath}/${thread.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
          >
            <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
              {thread.counterpart.profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thread.counterpart.profile.avatarUrl}
                  alt={thread.counterpart.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {thread.counterpart.fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm truncate ${
                    thread.unread ? "font-bold" : "font-semibold"
                  }`}
                >
                  {thread.counterpart.fullName}
                </p>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {thread.counterpart.role.toLowerCase()}
                </span>
                {thread.closedAt && (
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    Closed
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {thread.preview ?? "No messages yet"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[11px] text-muted-foreground">
                {formatDateTime(thread.lastMessageAt)}
              </p>
              {thread.unread && (
                <span className="inline-block mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
