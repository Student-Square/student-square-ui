"use client";

import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock,
  HeartPulse,
  Lightbulb,
  Loader2,
  Lock,
  RefreshCw,
  Target,
  Users,
} from "lucide-react";
import { useGetAssessmentCatalogueQuery } from "@/redux/features/assessments/assessmentsApi";
import type { AssessmentCategory, CatalogueEntry } from "@/types/assessments";

/**
 * FR-05-001 — five self-report categories, each entered from its own card,
 * plus the timed aptitude test.
 *
 * The cards deliberately show no score for the self-report categories. There
 * is nothing to show: those categories are never graded (FR-05-007), and the
 * page says so in as many words (FR-05-014).
 */

const CATEGORY_META: Record<
  AssessmentCategory,
  { icon: typeof Brain; accent: string; blurb: string }
> = {
  SOCIO_DEMOGRAPHIC: {
    icon: Users,
    accent: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
    blurb: "Your background and circumstances",
  },
  CAREER: {
    icon: Target,
    accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    blurb: "Study and work skills",
  },
  PSYCHOLOGICAL: {
    icon: Brain,
    accent: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
    blurb: "How you feel about yourself",
  },
  COGNITIVE: {
    icon: Lightbulb,
    accent: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    blurb: "How you think and learn",
  },
  HEALTH: {
    icon: HeartPulse,
    accent: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    blurb: "Health and wellbeing",
  },
  APTITUDE: {
    icon: Clock,
    accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    blurb: "Timed test — analytical, problem solving, communication",
  },
};

const ORDER: AssessmentCategory[] = [
  "SOCIO_DEMOGRAPHIC",
  "CAREER",
  "PSYCHOLOGICAL",
  "COGNITIVE",
  "HEALTH",
  "APTITUDE",
];

export default function AssessmentPage() {
  const { data, isLoading, isError } = useGetAssessmentCatalogueQuery();

  const entries = [...(data ?? [])].sort(
    (a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category)
  );
  const selfReport = entries.filter((e) => !e.timed);
  const timed = entries.filter((e) => e.timed);

  const completed = selfReport.filter((e) => e.completedAttempt).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gamified Assessment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Five short self-report categories and one timed aptitude test. Your
          answers go to the counsellor assigned to you.
        </p>
      </header>

      {/* FR-05-014 — stated on the interface, not buried in a policy page. */}
      <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <p className="text-sm leading-relaxed text-foreground">
          The five self-report categories are{" "}
          <span className="font-semibold">not scored, ranked or graded</span>.
          They are a profile you write about yourself so a human counsellor can
          understand your situation. No diagnosis or clinical interpretation is
          produced from your answers.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your assessment…
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600">
          Could not load the assessment. Please refresh.
        </p>
      )}

      {!isLoading && !isError && entries.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No assessment has been published yet. Please check back soon.
        </p>
      )}

      {selfReport.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Self-report categories
            </h2>
            <span className="text-xs text-muted-foreground">
              {completed} of {selfReport.length} done
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selfReport.map((entry) => (
              <CategoryCard key={entry.definitionId} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {timed.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Timed test
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timed.map((entry) => (
              <CategoryCard key={entry.definitionId} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CategoryCard({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const Icon = meta?.icon ?? ClipboardList;

  const done = entry.completedAttempt;
  const inProgress = entry.attempt;

  // FR-05-007: a score exists only for the timed test. Never invent one.
  const score =
    entry.timed && done?.scorePercent != null ? Number(done.scorePercent) : null;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${meta?.accent ?? ""}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {done && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        {!done && inProgress && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            In progress
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-bold text-foreground">{entry.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {entry.description ?? meta?.blurb}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5">
          {entry.sectionCount} section{entry.sectionCount === 1 ? "" : "s"}
        </span>
        {entry.timed && (
          <span className="rounded-full bg-muted px-2 py-0.5">
            {entry.durationMinutes} min, timed
          </span>
        )}
        {!entry.timed && (
          <span className="rounded-full bg-muted px-2 py-0.5">Not scored</span>
        )}
      </div>

      {score !== null && (
        <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-sm font-bold text-foreground">
            {score}%{" "}
            <span
              className={`ml-1 text-xs font-semibold ${
                done?.passed ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {done?.passed ? "Passed" : "Below the pass mark"}
            </span>
          </p>
          {done?.requiresReassessment && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-500">
              <RefreshCw className="h-3 w-3" />
              You can retake this test.
            </p>
          )}
        </div>
      )}

      {done && !entry.timed && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" />
          Recorded. No score is produced for this category.
        </p>
      )}

      <div className="mt-auto pt-4">
        <Link
          href={`/dashboard/assessment/${entry.category.toLowerCase()}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          {done
            ? entry.timed
              ? "Retake test"
              : "Update answers"
            : inProgress
              ? "Continue"
              : "Start"}
        </Link>
      </div>
    </div>
  );
}
