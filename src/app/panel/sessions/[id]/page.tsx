"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  useGetSessionQuery,
  useSetSessionStatusMutation,
  useUpdateSessionMutation,
} from "@/redux/features/care/careApi";
import { formatDate, formatTimeRange, SESSION_STATUS_STYLE } from "@/lib/care";
import { ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react";

/**
 * A single session, staff side.
 *
 * The meeting link field is always editable, but the *link itself* is only
 * returned by the server inside the release window (FR-08-008) — so this page
 * shows either the live link or when it will appear, and never invents one.
 */
export default function PanelSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, isLoading } = useGetSessionQuery(id);
  const [updateSession, { isLoading: saving }] = useUpdateSessionMutation();
  const [setStatus, { isLoading: changing }] = useSetSessionStatusMutation();

  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  useEffect(() => {
    if (!session) return;
    setAgenda(session.agenda ?? "");
    setNotes(session.staffNotes ?? "");
    setMeetingUrl(session.meetingUrl ?? "");
  }, [session]);

  if (isLoading || !session) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading session…
      </div>
    );
  }

  const scheduled = session.status === "SCHEDULED";

  return (
    <div className="space-y-6">
      <Link
        href="/panel/sessions"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Sessions
      </Link>

      <header className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight">
            {session.member.fullName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatDate(session.startsAt)} ·{" "}
            {formatTimeRange(session.startsAt, session.endsAt)} ·{" "}
            {session.mode === "ONLINE" ? "Online" : session.location || "In person"}
          </p>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
            SESSION_STATUS_STYLE[session.status]
          }`}
        >
          {session.status}
        </span>
      </header>

      <Link
        href={`/panel/caseload/${session.memberId}`}
        className="inline-block text-sm text-emerald-600 hover:underline"
      >
        Open this student&apos;s case →
      </Link>

      {scheduled && (
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Session details
          </h2>

          <div>
            <label className="text-xs font-medium">Meeting link</label>
            <input
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.example.com/…"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Released to both participants 30 minutes before the start and
              withdrawn when the session ends. Stored encrypted.
            </p>
            {session.meetingUrl && (
              <a
                href={session.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
              >
                Join now <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div>
            <label className="text-xs font-medium">Agenda</label>
            <textarea
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium">Private notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Staff only — never shown to the student.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              updateSession({
                id,
                agenda: agenda.trim() || null,
                staffNotes: notes.trim() || null,
                meetingUrl: meetingUrl.trim() || null,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </section>
      )}

      {scheduled && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Outcome
          </h2>
          <div className="flex flex-wrap gap-2">
            {(["COMPLETED", "NO_SHOW", "POSTPONED", "CANCELLED"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  disabled={changing}
                  onClick={() => setStatus({ id, status })}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50 transition-colors disabled:opacity-60"
                >
                  Mark {status.replace("_", " ").toLowerCase()}
                </button>
              )
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Cancelling or postponing frees the slot so another student can book it.
          </p>
        </section>
      )}

      {session.feedback.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Feedback
          </h2>
          <ul className="space-y-2">
            {session.feedback.map((f) => (
              <li key={f.id} className="text-sm">
                <span className="font-semibold">{"★".repeat(f.rating)}</span>{" "}
                {f.comment && <span className="text-muted-foreground">{f.comment}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
