"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetSessionsQuery } from "@/redux/features/care/careApi";
import {
  dhakaDayKey,
  formatDate,
  formatTimeRange,
  SESSION_STATUS_STYLE,
} from "@/lib/care";
import type { SessionStatus } from "@/types/care";
import { CalendarClock, ChevronRight, Loader2 } from "lucide-react";

/**
 * FR-08-006 — the staff calendar, grouped by day and colour-coded by status.
 *
 * Grouping happens in Asia/Dhaka (`dhakaDayKey`), not in the browser's
 * timezone: a counsellor in Dhaka and an admin abroad must see a session land
 * on the same day.
 */

const FILTERS: { label: string; value: SessionStatus | "ALL" }[] = [
  { label: "Upcoming", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "All", value: "ALL" },
];

export default function PanelSessionsPage() {
  const [filter, setFilter] = useState<SessionStatus | "ALL">("SCHEDULED");
  const { data, isFetching } = useGetSessionsQuery(
    filter === "ALL" ? undefined : { status: filter }
  );

  const days = groupByDay(data ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Times shown in Asia/Dhaka.
        </p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.value
                ? "bg-emerald-600 text-white"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isFetching && !data ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : days.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <CalendarClock className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Nothing here.</p>
          <Link
            href="/panel/availability"
            className="mt-2 inline-block text-sm text-emerald-600 hover:underline"
          >
            Publish availability
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map(([day, sessions]) => (
            <section key={day}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                {formatDate(sessions[0].startsAt)}
              </h2>
              <ul className="space-y-2">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/panel/sessions/${s.id}`}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="text-xs font-mono text-muted-foreground shrink-0 w-28">
                        {formatTimeRange(s.startsAt, s.endsAt)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {s.member.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.mode === "ONLINE" ? "Online" : s.location || "In person"}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          SESSION_STATUS_STYLE[s.status]
                        }`}
                      >
                        {s.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function groupByDay<T extends { startsAt: string }>(rows: T[]): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = dhakaDayKey(row.startsAt);
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
