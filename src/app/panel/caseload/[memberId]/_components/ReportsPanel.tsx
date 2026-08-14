"use client";

import { useState } from "react";
import {
  useArchiveReportMutation,
  useCreateReportMutation,
  useShareReportMutation,
} from "@/redux/features/care/careApi";
import { formatDateTime } from "@/lib/care";
import type { AssessmentReport } from "@/types/care";
import { Eye, EyeOff, FileText, Loader2, Plus, Trash2 } from "lucide-react";

/**
 * FR-06 — counsellor-authored reports.
 *
 * The share toggle is the whole visibility mechanism (FR-06-004): a report the
 * member has not been shared does not exist as far as their screen is
 * concerned, and un-sharing takes it back on their next page load. The UI says
 * which state a report is in at all times, because "did I share this?" is
 * exactly the question a counsellor should never have to guess.
 */
export function ReportsPanel({
  memberId,
  reports,
  canEdit,
}: {
  memberId: string;
  reports: AssessmentReport[];
  canEdit: boolean;
}) {
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    recommendations: "",
    privateNotes: "",
  });

  const [createReport, { isLoading: creating }] = useCreateReportMutation();
  const [shareReport] = useShareReportMutation();
  const [archiveReport] = useArchiveReportMutation();

  const submit = async () => {
    if (form.title.trim().length < 3 || form.summary.trim().length < 10) return;
    await createReport({
      memberId,
      title: form.title.trim(),
      summary: form.summary.trim(),
      recommendations: form.recommendations.trim() || undefined,
      privateNotes: form.privateNotes.trim() || undefined,
    })
      .unwrap()
      .catch(() => null);
    setForm({ title: "", summary: "", recommendations: "", privateNotes: "" });
    setComposing(false);
  };

  const live = reports.filter((r) => !r.archivedAt);

  return (
    <div className="space-y-4">
      {canEdit && (
        <button
          type="button"
          onClick={() => setComposing((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-emerald-500/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {composing ? "Cancel" : "Write a report"}
        </button>
      )}

      {composing && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Report title"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="Summary — what the assessment shows"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <textarea
            value={form.recommendations}
            onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
            placeholder="Recommendations (optional)"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <div>
            <textarea
              value={form.privateNotes}
              onChange={(e) => setForm({ ...form, privateNotes: e.target.value })}
              placeholder="Private notes — never shown to the student"
              rows={3}
              className="w-full rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Private notes stay with staff. They are stripped from anything the
              student can read, shared or not.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={creating}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save as draft"
            )}
          </button>
        </div>
      )}

      {live.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <FileText className="h-7 w-7 mx-auto text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">No reports yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {live.map((report) => {
            const shared = report.sharedAt !== null;

            return (
              <li
                key={report.id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{report.title}</h3>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                          shared
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {shared ? "Shared with student" : "Draft — not visible"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {report.author?.fullName ?? "Unknown author"} ·{" "}
                      {formatDateTime(report.createdAt)}
                    </p>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          shareReport({ id: report.id, memberId, shared: !shared })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-emerald-500/50 transition-colors"
                      >
                        {shared ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Unshare
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Share
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveReport({ id: report.id, memberId })}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-rose-600 hover:border-rose-300 transition-colors"
                        aria-label="Archive report"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm whitespace-pre-wrap">{report.summary}</p>

                {report.recommendations && (
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Recommendations
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {report.recommendations}
                    </p>
                  </div>
                )}

                {report.privateNotes && (
                  <div className="mt-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                      Private notes — staff only
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {report.privateNotes}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
