"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  useGetAssessmentCatalogueQuery,
  useHeartbeatMutation,
  useSaveSectionMutation,
  useStartAttemptMutation,
  useSubmitAttemptMutation,
} from "@/redux/features/assessments/assessmentsApi";
import type {
  AnswerValue,
  AssessmentAttempt,
  AssessmentCategory,
  SubmitResult,
} from "@/types/assessments";
import { isAptitudeResult } from "@/types/assessments";
import { QuestionField } from "../_components/QuestionField";

const CATEGORIES: AssessmentCategory[] = [
  "SOCIO_DEMOGRAPHIC",
  "CAREER",
  "PSYCHOLOGICAL",
  "COGNITIVE",
  "HEALTH",
  "APTITUDE",
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5080/api/v1";

/** Local countdown resync interval. The server stays the authority. */
const HEARTBEAT_MS = 30_000;

type Phase = "loading" | "rules" | "running" | "submitted" | "expired";

export default function AssessmentRunnerPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: raw } = use(params);
  const router = useRouter();

  const category = raw.toUpperCase() as AssessmentCategory;
  const valid = CATEGORIES.includes(category);

  const { data: catalogue, isLoading: catalogueLoading } =
    useGetAssessmentCatalogueQuery();
  const entry = catalogue?.find((c) => c.category === category);

  const [startAttempt] = useStartAttemptMutation();
  const [saveSection, { isLoading: saving }] = useSaveSectionMutation();
  const [submitAttempt, { isLoading: submitting }] = useSubmitAttemptMutation();
  const [heartbeat] = useHeartbeatMutation();

  const [phase, setPhase] = useState<Phase>("loading");
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timed = Boolean(entry?.timed);
  const sections = attempt?.definition.sections ?? [];
  const section = sections[sectionIndex];

  const begin = useCallback(async () => {
    setError(null);
    try {
      const started = await startAttempt(category).unwrap();
      setAttempt(started);
      setAnswers(started.answers ?? {});
      setRemaining(started.remainingSeconds);
      setSectionIndex(0);
      setPhase("running");
    } catch (e) {
      setError(readError(e));
      setPhase("rules");
    }
  }, [category, startAttempt]);

  // A self-report category resumes silently. A timed test must not: its clock
  // starts the moment the attempt is created, so the rules screen has to come
  // first (FR-05-010, FR-05-011).
  useEffect(() => {
    if (!valid || catalogueLoading || !entry) return;
    if (phase !== "loading") return;
    if (entry.timed) {
      setPhase("rules");
    } else {
      void begin();
    }
  }, [valid, catalogueLoading, entry, phase, begin]);

  // Local tick. Purely cosmetic — every decision that matters is the server's.
  useEffect(() => {
    if (phase !== "running" || !timed) return;
    const id = setInterval(() => {
      setRemaining((r) => (r === null ? null : Math.max(0, r - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, timed]);

  // Resync with the authoritative deadline, and notice an expiry that happened
  // while the tab was in the background.
  useEffect(() => {
    if (phase !== "running" || !timed || !attempt) return;
    const id = setInterval(async () => {
      try {
        const beat = await heartbeat(attempt.id).unwrap();
        if (beat.status === "EXPIRED") {
          setPhase("expired");
          return;
        }
        setRemaining(beat.remainingSeconds);
      } catch {
        /* a dropped heartbeat is not fatal; the next one resyncs */
      }
    }, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [phase, timed, attempt, heartbeat]);

  const doSubmit = useCallback(async () => {
    if (!attempt) return;
    setError(null);
    try {
      const submitted = await submitAttempt(attempt.id).unwrap();
      setResult(submitted);
      setPhase("submitted");
    } catch (e) {
      const status = (e as { status?: number })?.status;
      if (status === 410) {
        setPhase("expired");
        return;
      }
      setError(readError(e));
    }
  }, [attempt, submitAttempt]);

  // Time up. The server has already decided by now; submitting simply asks it
  // to say so, and a 410 drops us on the expired screen.
  const expiredRef = useRef(false);
  useEffect(() => {
    if (phase !== "running" || !timed) return;
    if (remaining !== 0 || expiredRef.current) return;
    expiredRef.current = true;
    void doSubmit();
  }, [phase, timed, remaining, doSubmit]);

  /**
   * FR-05-011 — leaving a timed test cancels it.
   *
   * `keepalive` lets the request outlive the page. If it is lost anyway (a
   * killed tab, a dead network) nothing breaks: starting the test again
   * invalidates the stale attempt server-side and begins from zero, which is
   * the same outcome the requirement asks for.
   */
  useEffect(() => {
    if (phase !== "running" || !timed || !attempt) return;

    const cancel = () => {
      // Not sendBeacon: it cannot carry the auth cookie cross-origin, so it
      // would post an unauthenticated request the API rightly rejects.
      void fetch(`${API_BASE}/assessments/attempts/${attempt.id}/abandon`, {
        method: "POST",
        credentials: "include",
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener("pagehide", cancel);
    return () => window.removeEventListener("pagehide", cancel);
  }, [phase, timed, attempt]);

  const setAnswer = (questionId: string, value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const persistSection = async () => {
    if (!attempt || !section) return true;
    const payload = section.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({ questionId: q.id, value: answers[q.id] }));

    if (!payload.length) return true;

    try {
      await saveSection({
        attemptId: attempt.id,
        sectionId: section.id,
        answers: payload,
      }).unwrap();
      return true;
    } catch (e) {
      const status = (e as { status?: number })?.status;
      if (status === 410) {
        setPhase("expired");
        return false;
      }
      setError(readError(e));
      return false;
    }
  };

  const missingRequired = useMemo(() => {
    if (!section) return [];
    return section.questions.filter((q) => {
      if (!q.required) return false;
      const v = answers[q.id];
      return v === undefined || v === null || v === "" ||
        (Array.isArray(v) && v.length === 0);
    });
  }, [section, answers]);

  const next = async () => {
    setError(null);
    if (missingRequired.length) {
      setError(
        `Please answer ${missingRequired.length} required question${
          missingRequired.length === 1 ? "" : "s"
        } before continuing.`
      );
      return;
    }
    if (!(await persistSection())) return;

    if (sectionIndex < sections.length - 1) {
      setSectionIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await doSubmit();
    }
  };

  const saveAndExit = async () => {
    if (!(await persistSection())) return;
    router.push("/dashboard/assessment");
  };

  if (!valid) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Unknown assessment category.</p>
      </Shell>
    );
  }

  if (catalogueLoading || phase === "loading") {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing…
        </div>
      </Shell>
    );
  }

  if (!entry) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          This category has not been published yet.
        </p>
      </Shell>
    );
  }

  if (phase === "rules") {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Clock className="h-3 w-3" />
            {entry.durationMinutes} minutes
          </span>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground">
            {entry.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>

          <div className="mt-5 rounded-xl border-2 border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Before you start
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {entry.rules ??
                "The timer runs on our server. If you leave before submitting, the attempt is cancelled and you start again from the beginning."}
            </p>
          </div>

          {error && <ErrorNote message={error} />}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={begin}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              I understand — start the test
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard/assessment"
              className="text-sm font-semibold text-muted-foreground hover:text-emerald-600"
            >
              Not now
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (phase === "expired") {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Clock className="mx-auto h-10 w-10 text-amber-600" />
          <h1 className="mt-3 text-xl font-bold text-foreground">Time is up</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This attempt has ended and was not scored. You can start again from
            the beginning whenever you are ready.
          </p>
          <button
            type="button"
            onClick={() => {
              expiredRef.current = false;
              setPhase("rules");
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start again
          </button>
        </div>
      </Shell>
    );
  }

  if (phase === "submitted" && result) {
    return (
      <Shell>
        <Results result={result} title={entry.title} />
      </Shell>
    );
  }

  if (!attempt || !section) {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading questions…
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Section {sectionIndex + 1} of {sections.length}
            </p>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {attempt.definition.title}
            </h1>
          </div>
          {timed && remaining !== null && <Countdown seconds={remaining} />}
        </div>

        <div className="flex gap-1">
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full ${
                i <= sectionIndex ? "bg-emerald-600" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-base font-bold text-foreground">{section.title}</h2>
          {section.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {section.description}
            </p>
          )}
          {section.sensitive && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              Answers in this section are encrypted before they are stored and
              are visible only to the counsellor assigned to you. They are never
              scored.
            </p>
          )}
        </div>

        <div className="space-y-3">
          {section.questions.map((question, i) => (
            <QuestionField
              key={question.id}
              question={question}
              index={i}
              value={answers[question.id] ?? null}
              onChange={(v) => setAnswer(question.id, v)}
            />
          ))}
        </div>

        {error && <ErrorNote message={error} />}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {sectionIndex > 0 && (
            <button
              type="button"
              onClick={() => setSectionIndex((i) => i - 1)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {/* FR-05-017 — leaving and coming back must not lose answers. */}
          {!timed && (
            <button
              type="button"
              onClick={saveAndExit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              Save and finish later
            </button>
          )}

          <div className="flex-1" />

          <button
            type="button"
            onClick={next}
            disabled={saving || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving || submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                {sectionIndex < sections.length - 1 ? "Continue" : "Submit"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/assessment"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All categories
      </Link>
      {children}
    </div>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const urgent = seconds <= 120;

  return (
    <span
      role="timer"
      aria-live="off"
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm font-bold tabular-nums ${
        urgent
          ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
          : "bg-muted text-foreground"
      }`}
    >
      <Clock className="h-4 w-4" />
      {mm}:{ss}
    </span>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function Results({ result, title }: { result: SubmitResult; title: string }) {
  if (!isAptitudeResult(result)) {
    // FR-05-007 / FR-05-014 — a self-report category ends with an
    // acknowledgement, never a number.
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-3 text-xl font-bold text-foreground">Thank you</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {result.message}
        </p>
        <p className="mx-auto mt-3 flex max-w-md items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" />
          No score, rank or interpretation is produced from these answers.
        </p>
        <Link
          href="/dashboard/assessment"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-center">
        <CheckCircle2
          className={`mx-auto h-10 w-10 ${
            result.passed ? "text-emerald-600" : "text-amber-600"
          }`}
        />
        <h1 className="mt-3 text-xl font-bold text-foreground">{title} complete</h1>
        <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">
          {result.scorePercent}%
        </p>
        <p
          className={`mt-1 text-sm font-semibold ${
            result.passed ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {result.passed ? "Passed" : "Below the 40% pass mark"}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {result.areas.map((area) => (
          <div
            key={area.key}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
          >
            <span className="text-sm capitalize text-foreground">
              {area.key.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {area.correct} / {area.total}
            </span>
          </div>
        ))}
      </div>

      {result.requiresReassessment && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50/60 p-3 text-sm text-foreground dark:border-amber-800 dark:bg-amber-950/30">
          Your score is below the pass mark, so a reassessment is available. You
          can retake the test whenever you are ready — your counsellor will see
          both attempts.
        </p>
      )}

      <Link
        href="/dashboard/assessment"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Back to categories
      </Link>
    </div>
  );
}

const readError = (e: unknown): string => {
  const data = (e as { data?: { message?: string } })?.data;
  return data?.message ?? "Something went wrong. Please try again.";
};
