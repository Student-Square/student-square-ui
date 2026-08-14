"use client";

import { useState } from "react";
import {
  useGetMyFeedbackQuery,
  useSubmitFeedbackMutation,
} from "@/redux/features/comms/commsApi";
import { formatDate } from "@/lib/care";
import type { FeedbackKind } from "@/types/comms";
import { Loader2, MessageSquarePlus, Send } from "lucide-react";

const KINDS: { value: FeedbackKind; label: string }[] = [
  { value: "PLATFORM", label: "The website" },
  { value: "COUNSELLING", label: "Counselling" },
  { value: "MENTORING", label: "Mentoring" },
  { value: "CONTENT", label: "Articles and content" },
  { value: "OTHER", label: "Something else" },
];

const STATUS_LABEL: Record<string, string> = {
  NEW: "Received",
  REVIEWED: "Read",
  ACTIONED: "Acted on",
  DISMISSED: "Closed",
};

export default function FeedbackPage() {
  const { data: mine, isLoading } = useGetMyFeedbackQuery();
  const [submit, { isLoading: sending }] = useSubmitFeedbackMutation();

  const [form, setForm] = useState({
    kind: "PLATFORM" as FeedbackKind,
    rating: 0,
    subject: "",
    body: "",
  });
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (form.subject.trim().length < 3 || form.body.trim().length < 10) return;
    await submit({
      kind: form.kind,
      rating: form.rating || undefined,
      subject: form.subject.trim(),
      body: form.body.trim(),
      context: typeof window !== "undefined" ? window.location.pathname : undefined,
    })
      .unwrap()
      .then(() => {
        setForm({ kind: "PLATFORM", rating: 0, subject: "", body: "" });
        setSent(true);
      })
      .catch(() => null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what is working and what is not. We read everything.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-bold">Send feedback</h2>
        </div>

        <div>
          <label className="text-xs font-medium">What is this about?</label>
          <select
            value={form.kind}
            onChange={(e) =>
              setForm({ ...form, kind: e.target.value as FeedbackKind })
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium">
            How would you rate it? (optional)
          </label>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setForm({ ...form, rating: n === form.rating ? 0 : n })}
                className={`text-2xl leading-none transition-colors ${
                  n <= form.rating ? "text-amber-500" : "text-muted-foreground/30"
                }`}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium">Subject</label>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="A short summary"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium">Your feedback</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={5}
            placeholder="What happened, and what would have been better?"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="button"
          onClick={() => void send()}
          disabled={sending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </button>

        {sent && (
          <p className="text-xs text-emerald-600">
            Thank you — it is with the team.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          What you have sent
        </h2>

        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : !mine?.length ? (
          <p className="text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          <ul className="space-y-3">
            {mine.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{item.subject}</p>
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                  {item.rating && (
                    <span className="text-xs text-amber-500">
                      {"★".repeat(item.rating)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(item.createdAt)} · {item.kind.toLowerCase()}
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap">{item.body}</p>

                {item.response && (
                  <div className="mt-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Our reply
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {item.response}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
