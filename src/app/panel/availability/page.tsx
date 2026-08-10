"use client";

import { useState } from "react";
import {
  useCancelAvailabilityMutation,
  useCreateAvailabilityMutation,
  useGetMyAvailabilityQuery,
} from "@/redux/features/care/careApi";
import {
  dhakaDayKey,
  formatDate,
  formatTimeRange,
  localInputToIso,
} from "@/lib/care";
import { CalendarPlus, Loader2, Plus, Trash2 } from "lucide-react";

/**
 * FR-08-001 — publishing bookable windows.
 *
 * The form takes wall-clock input and sends instants; `localInputToIso` is the
 * single conversion point. Capacity defaults to 1 because one-to-one is what
 * counselling normally is — a group session is the exception you opt into.
 */
export default function AvailabilityPage() {
  const { data: slots, isFetching } = useGetMyAvailabilityQuery();
  const [createAvailability, { isLoading: creating }] = useCreateAvailabilityMutation();
  const [cancelAvailability] = useCancelAvailabilityMutation();

  const [form, setForm] = useState({
    startsAt: "",
    endsAt: "",
    mode: "ONLINE" as "ONLINE" | "IN_PERSON",
    location: "",
    capacity: 1,
    note: "",
  });
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!form.startsAt || !form.endsAt) {
      setError("Pick a start and an end.");
      return;
    }
    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      setError("The slot must end after it starts.");
      return;
    }

    await createAvailability({
      slots: [
        {
          startsAt: localInputToIso(form.startsAt),
          endsAt: localInputToIso(form.endsAt),
        },
      ],
      mode: form.mode,
      location: form.mode === "IN_PERSON" ? form.location || undefined : undefined,
      capacity: form.capacity,
      note: form.note || undefined,
    })
      .unwrap()
      .then(() => setForm({ ...form, startsAt: "", endsAt: "", note: "" }))
      .catch(() => null);
  };

  const upcoming = (slots ?? []).filter(
    (s) => new Date(s.startsAt).getTime() > Date.now()
  );
  const days = new Map<string, typeof upcoming>();
  for (const slot of upcoming) {
    const key = dhakaDayKey(slot.startsAt);
    const bucket = days.get(key);
    if (bucket) bucket.push(slot);
    else days.set(key, [slot]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Availability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Windows your students can book. Times in Asia/Dhaka.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Publish a slot
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium">Starts</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Ends</label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Mode</label>
            <select
              value={form.mode}
              onChange={(e) =>
                setForm({ ...form, mode: e.target.value as typeof form.mode })
              }
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In person</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Capacity</label>
            <input
              type="number"
              min={1}
              max={50}
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) || 1 })
              }
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          {form.mode === "IN_PERSON" && (
            <div className="sm:col-span-2">
              <label className="text-xs font-medium">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Room, address or landmark"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium">Note (optional)</label>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Shown to students when they pick this slot"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

        <button
          type="button"
          onClick={() => void submit()}
          disabled={creating}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Publish
        </button>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Upcoming windows
        </h2>

        {isFetching && !slots ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <CalendarPlus className="h-7 w-7 mx-auto text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">
              No upcoming availability. Students cannot book until you publish some.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {[...days.entries()]
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([day, daySlots]) => (
                <div key={day}>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    {formatDate(daySlots[0].startsAt)}
                  </p>
                  <ul className="space-y-2">
                    {daySlots.map((slot) => {
                      const booked = slot.sessions?.filter(
                        (s) => s.status === "SCHEDULED"
                      );

                      return (
                        <li
                          key={slot.id}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                        >
                          <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">
                            {formatTimeRange(slot.startsAt, slot.endsAt)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              {slot.mode === "ONLINE"
                                ? "Online"
                                : slot.location || "In person"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {slot.bookedCount}/{slot.capacity} booked
                              {booked?.length
                                ? ` — ${booked.map((b) => b.member.fullName).join(", ")}`
                                : ""}
                            </p>
                          </div>
                          {slot.bookedCount === 0 && (
                            <button
                              type="button"
                              onClick={() => cancelAvailability(slot.id)}
                              className="text-muted-foreground hover:text-rose-600 transition-colors"
                              aria-label="Withdraw slot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
