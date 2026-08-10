"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useBookSessionMutation,
  useGetMyCareTeamQuery,
  useGetOpenSlotsQuery,
  useGetSessionsQuery,
} from "@/redux/features/care/careApi";
import {
  dhakaDayKey,
  formatDate,
  formatTimeRange,
  SESSION_STATUS_STYLE,
} from "@/lib/care";
import { CalendarClock, ChevronRight, Loader2 } from "lucide-react";

/**
 * FR-08 — the member's sessions, and booking a new one.
 *
 * A member books only with their own counsellor or mentor, so the picker is
 * their care team rather than a directory. The server enforces the same rule;
 * this just avoids offering something that would be refused.
 */
export default function MySessionsPage() {
  const { data: sessions, isLoading } = useGetSessionsQuery();
  const { data: careTeam } = useGetMyCareTeamQuery();
  const [staffId, setStaffId] = useState<string | null>(null);

  const upcoming = (sessions ?? []).filter((s) => s.status === "SCHEDULED");
  const past = (sessions ?? []).filter((s) => s.status !== "SCHEDULED");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Times shown in Asia/Dhaka.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Book a session
        </h2>

        {(careTeam ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have no counsellor or mentor assigned yet. Booking opens once
            your care team is in place.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {(careTeam ?? []).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    setStaffId(staffId === a.staff.id ? null : a.staff.id)
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    staffId === a.staff.id
                      ? "bg-emerald-600 text-white"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a.staff.fullName} · {a.role.toLowerCase()}
                </button>
              ))}
            </div>

            {staffId && <SlotPicker staffId={staffId} onBooked={() => setStaffId(null)} />}
          </>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Upcoming
        </h2>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing booked.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/sessions/${s.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
                >
                  <CalendarClock className="h-4 w-4 text-sky-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {s.staff.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.startsAt)} ·{" "}
                      {formatTimeRange(s.startsAt, s.endsAt)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Past
          </h2>
          <ul className="space-y-2">
            {past.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/sessions/${s.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{s.staff.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.startsAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                      SESSION_STATUS_STYLE[s.status]
                    }`}
                  >
                    {s.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SlotPicker({
  staffId,
  onBooked,
}: {
  staffId: string;
  onBooked: () => void;
}) {
  const { data: slots, isFetching } = useGetOpenSlotsQuery(staffId);
  const [book, { isLoading }] = useBookSessionMutation();

  if (isFetching) {
    return <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (!slots?.length) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        No open slots right now. They will appear here as soon as new times are
        published.
      </p>
    );
  }

  const days = new Map<string, typeof slots>();
  for (const slot of slots) {
    const key = dhakaDayKey(slot.startsAt);
    const bucket = days.get(key);
    if (bucket) bucket.push(slot);
    else days.set(key, [slot]);
  }

  return (
    <div className="mt-4 space-y-4">
      {[...days.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, daySlots]) => (
          <div key={day}>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              {formatDate(daySlots[0].startsAt)}
            </p>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    book({ slotId: slot.id }).unwrap().then(onBooked).catch(() => null)
                  }
                  className="rounded-lg border border-border bg-card px-3 py-2 text-left hover:border-emerald-500/50 transition-colors disabled:opacity-60"
                >
                  <span className="block text-sm font-medium">
                    {formatTimeRange(slot.startsAt, slot.endsAt)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {slot.mode === "ONLINE" ? "Online" : slot.location || "In person"}
                    {slot.seatsLeft > 1 ? ` · ${slot.seatsLeft} seats` : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
