"use client";

import { use } from "react";
import Link from "next/link";
import { useGetMemberAttemptQuery } from "@/redux/features/care/careApi";
import { formatDate } from "@/lib/care";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

/**
 * FR-06-002 — reading a student's submitted answers.
 *
 * Health and psychological sections are shown as a completion count only. They
 * are stored encrypted, they never feed SWOT derivation (FR-05-018), and this
 * screen is not a clinical interpretation surface (FR-05-014).
 *
 * Opening this page writes its own audit record, separate from opening the
 * case — "read the case" and "read the answers" are different events.
 */
export default function MemberAttemptPage({
  params,
}: {
  params: Promise<{ memberId: string; attemptId: string }>;
}) {
  const { memberId, attemptId } = use(params);
  const { data, isLoading, error } = useGetMemberAttemptQuery({ memberId, attemptId });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading answers…
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        That assessment is not available.{" "}
        <Link href={`/panel/caseload/${memberId}`} className="text-emerald-600 hover:underline">
          Back to the case
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/panel/caseload/${memberId}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to the case
      </Link>

      <header>
        <h1 className="text-xl font-bold tracking-tight">{data.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {data.category} · submitted{" "}
          {data.submittedAt ? formatDate(data.submittedAt) : "—"}
          {data.scorePercent !== null
            ? ` · ${Number(data.scorePercent).toFixed(0)}% (${data.passed ? "pass" : "below threshold"})`
            : " · not scored"}
        </p>
      </header>

      <div className="space-y-4">
        {data.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold">{section.title}</h2>
              {section.sensitive && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  <Lock className="h-2.5 w-2.5" /> Sensitive
                </span>
              )}
            </div>

            {section.sensitive ? (
              <p className="text-sm text-muted-foreground">
                {section.answeredCount ?? 0} question
                {section.answeredCount === 1 ? "" : "s"} answered. The responses
                are encrypted and are not shown here.
              </p>
            ) : section.questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions.</p>
            ) : (
              <ol className="space-y-3">
                {section.questions.map((q) => (
                  <li key={q.id}>
                    <p className="text-sm font-medium">{q.prompt}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatAnswer(q.answer)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

const formatAnswer = (answer: unknown): string => {
  if (answer === null || answer === undefined || answer === "") return "— no answer —";
  if (Array.isArray(answer)) return answer.join(", ");
  if (typeof answer === "boolean") return answer ? "Yes" : "No";
  return String(answer);
};
