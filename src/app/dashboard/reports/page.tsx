"use client";

import { useGetMyReportsQuery } from "@/redux/features/care/careApi";
import { formatDate } from "@/lib/care";
import { FileText, Loader2 } from "lucide-react";

/**
 * FR-06-004 — only reports a counsellor has shared appear here, and they
 * disappear again if it is unshared. There is no local copy for that to be
 * inconsistent with: the list is the server's answer, every time.
 */
export default function MyReportsPage() {
  const { data: reports, isLoading } = useGetMyReportsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your reports…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Written by your counsellor after reviewing your assessment.
        </p>
      </div>

      {(reports ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing shared with you yet. Your counsellor decides when a report is
            ready.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {(reports ?? []).map((report) => (
            <li
              key={report.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h2 className="text-base font-bold">{report.title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {report.author?.fullName ?? "Your counsellor"} ·{" "}
                {report.sharedAt ? formatDate(report.sharedAt) : ""}
              </p>

              <p className="mt-3 text-sm whitespace-pre-wrap leading-relaxed">
                {report.summary}
              </p>

              {report.recommendations && (
                <div className="mt-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    Recommendations
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed">
                    {report.recommendations}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
