"use client";

import { useState } from "react";
import {
  useGetAdminFeedbackQuery,
  useReviewFeedbackMutation,
} from "@/redux/features/comms/commsApi";
import { formatDateTime } from "@/lib/care";
import type { FeedbackStatus } from "@/types/comms";
import { Loader2, MessageSquare } from "lucide-react";

const FILTERS: { label: string; value: FeedbackStatus | "ALL" }[] = [
  { label: "New", value: "NEW" },
  { label: "Read", value: "REVIEWED" },
  { label: "Acted on", value: "ACTIONED" },
  { label: "Closed", value: "DISMISSED" },
  { label: "All", value: "ALL" },
];

export default function AdminFeedbackPage() {
  const [status, setStatus] = useState<FeedbackStatus | "ALL">("NEW");
  const { data, isFetching } = useGetAdminFeedbackQuery(
    status === "ALL" ? undefined : { status }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What members, counsellors and mentors are telling us.
        </p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              status === f.value
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
      ) : !data?.data.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Nothing here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.data.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FeedbackCard({
  item,
}: {
  item: NonNullable<ReturnType<typeof useGetAdminFeedbackQuery>["data"]>["data"][number];
}) {
  const [review, { isLoading }] = useReviewFeedbackMutation();
  const [reply, setReply] = useState(item.response ?? "");
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">{item.subject}</p>
            <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {item.kind}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              {item.status}
            </span>
            {item.rating && (
              <span className="text-xs text-amber-500">
                {"★".repeat(item.rating)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.user?.fullName} ({item.user?.role.toLowerCase()}) ·{" "}
            {formatDateTime(item.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm whitespace-pre-wrap">{item.body}</p>

      {item.response && !open && (
        <div className="mt-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Replied
          </p>
          <p className="mt-1 text-sm whitespace-pre-wrap">{item.response}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50"
        >
          {open ? "Cancel" : item.response ? "Edit reply" : "Reply"}
        </button>

        {(["REVIEWED", "ACTIONED", "DISMISSED"] as const).map((next) => (
          <button
            key={next}
            type="button"
            disabled={isLoading || item.status === next}
            onClick={() => review({ id: item.id, status: next })}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50 disabled:opacity-40"
          >
            Mark {next.toLowerCase()}
          </button>
        ))}
      </div>

      {open && (
        <div className="mt-3 space-y-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            placeholder="Your reply — the sender is notified when you save it"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            disabled={isLoading || reply.trim().length < 2}
            onClick={() =>
              review({
                id: item.id,
                status: "ACTIONED",
                response: reply.trim(),
              })
                .unwrap()
                .then(() => setOpen(false))
                .catch(() => null)
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reply"}
          </button>
        </div>
      )}
    </li>
  );
}
