"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  useGetSessionQuery,
  useLeaveSessionFeedbackMutation,
  useSetSessionStatusMutation,
} from "@/redux/features/care/careApi";
import {
  formatDate,
  formatDateTime,
  formatTimeRange,
  SESSION_STATUS_STYLE,
} from "@/lib/care";
import { ArrowLeft, ExternalLink, Loader2, Video } from "lucide-react";

/**
 * One session, member side.
 *
 * The meeting link is not on this page until the server releases it — 30
 * minutes before the start, until the session ends (FR-08-008). Until then the
 * page says when it will appear rather than showing a dead button.
 */
export default function MySessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, isLoading } = useGetSessionQuery(id);
  const [setStatus, { isLoading: cancelling }] = useSetSessionStatusMutation();
  const [leaveFeedback, { isLoading: sending }] = useLeaveSessionFeedbackMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (isLoading || !session) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading session…
      </div>
    );
  }

  const alreadyRated = session.feedback.some((f) => f.byUserId === session.memberId);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/sessions"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Sessions
      </Link>

      <header className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight">
            {session.staff.fullName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground capitalize">
            {session.staff.role.toLowerCase()} · {formatDate(session.startsAt)} ·{" "}
            {formatTimeRange(session.startsAt, session.endsAt)}
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

      {session.agenda && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Agenda
          </h2>
          <p className="text-sm whitespace-pre-wrap">{session.agenda}</p>
        </section>
      )}

      {session.status === "SCHEDULED" && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            How to join
          </h2>

          {session.mode === "IN_PERSON" ? (
            <p className="text-sm">{session.location || "Location to be confirmed."}</p>
          ) : session.meetingUrl ? (
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <Video className="h-4 w-4" /> Join the meeting
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              The meeting link appears here from{" "}
              {formatDateTime(session.meetingUrlAvailableFrom)} — 30 minutes
              before the session starts.
            </p>
          )}

          <div className="mt-4 border-t border-border pt-3">
            {confirmCancel ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() =>
                    setStatus({ id, status: "CANCELLED" }).finally(() =>
                      setConfirmCancel(false)
                    )
                  }
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {cancelling ? "Cancelling…" : "Yes, cancel it"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="text-xs font-semibold text-muted-foreground hover:text-rose-600"
              >
                Cancel this session
              </button>
            )}
          </div>
        </section>
      )}

      {session.status === "COMPLETED" && !alreadyRated && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            How was it?
          </h2>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl leading-none transition-colors ${
                  n <= rating ? "text-amber-500" : "text-muted-foreground/30"
                }`}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Anything you want to add (optional)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            disabled={sending}
            onClick={() =>
              leaveFeedback({ id, rating, comment: comment.trim() || undefined })
            }
            className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send feedback"}
          </button>
        </section>
      )}

      {session.status === "CANCELLED" && session.cancelReason && (
        <p className="text-sm text-muted-foreground">
          Reason given: {session.cancelReason}
        </p>
      )}
    </div>
  );
}
