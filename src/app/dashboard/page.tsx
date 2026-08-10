"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetAssessmentCatalogueQuery } from "@/redux/features/assessments/assessmentsApi";
import {
  useGetMyCareTeamQuery,
  useGetMyRankQuery,
  useGetMySwotQuery,
  useGetMyTasksQuery,
} from "@/redux/features/care/careApi";
import {
  formatDateTime,
  GOAL_STATUS_STYLE,
  SWOT_META,
  SWOT_ORDER,
  TIER_STYLE,
} from "@/lib/care";
import { useSetMyGoalStatusMutation } from "@/redux/features/care/careApi";
import type { TodayTasks } from "@/types/care";
import {
  Award,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Heart,
  Lock,
  Loader2,
  MessageSquare,
  Newspaper,
  Target,
} from "lucide-react";

/**
 * FR-04 — the member dashboard.
 *
 * FR-04-001: the care sections stay locked until the assessment is complete.
 * The lock is honest about *why* rather than hiding the sections: a student who
 * cannot see why a screen is empty assumes the platform is broken.
 */
export default function DashboardOverviewPage() {
  const user = useSelector(selectCurrentUser);
  const { data: catalogue, isLoading: loadingCatalogue } =
    useGetAssessmentCatalogueQuery();
  const { data: rank } = useGetMyRankQuery();
  const { data: swot } = useGetMySwotQuery();
  const { data: tasks } = useGetMyTasksQuery();
  const { data: careTeam } = useGetMyCareTeamQuery();

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const selfReport = (catalogue ?? []).filter((c) => c.category !== "APTITUDE");
  const done = selfReport.filter((c) => c.completedAttempt).length;
  const assessmentComplete = selfReport.length > 0 && done === selfReport.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your progress, your plan and what is next.
        </p>
      </div>

      {/* Header metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric
          label="Rank"
          value={rank?.rank.tier ?? "—"}
          accent={rank ? TIER_STYLE[rank.rank.tier] : undefined}
          icon={<Award className="h-4 w-4" />}
        />
        <Metric
          label="Points"
          value={String(rank?.rank.points ?? 0)}
          icon={<Target className="h-4 w-4" />}
        />
        <Metric
          label="Goals done"
          value={String(rank?.rank.goalsCompleted ?? 0)}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <Metric
          label="Sessions"
          value={String(rank?.rank.sessionsCompleted ?? 0)}
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      {!assessmentComplete ? (
        <AssessmentGate
          loading={loadingCatalogue}
          done={done}
          total={selfReport.length}
        />
      ) : (
        <>
          {/* Your Tasks Today */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Your tasks today
              </h2>
              <Link
                href="/dashboard/roadmap"
                className="text-xs text-emerald-600 hover:underline"
              >
                Full roadmap
              </Link>
            </div>
            <TasksToday tasks={tasks} />
          </section>

          {/* SWOT */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Your SWOT
              </h2>
            </div>
            {(swot ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your counsellor has not shared a SWOT yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SWOT_ORDER.map((kind) => {
                  const meta = SWOT_META[kind];
                  const items = (swot ?? []).filter((e) => e.kind === kind);
                  return (
                    <div key={kind} className={`rounded-2xl border p-4 ${meta.accent}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        <h3 className="text-sm font-bold">{meta.label}</h3>
                      </div>
                      {items.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Nothing yet.</p>
                      ) : (
                        <ul className="space-y-1 text-sm">
                          {items.map((e) => (
                            <li key={e.id} className="leading-snug">
                              • {e.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Care team */}
          {(careTeam ?? []).length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Your care team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(careTeam ?? []).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
                      {a.staff.profile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.staff.profile.avatarUrl}
                          alt={a.staff.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {a.staff.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {a.staff.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {a.role.toLowerCase()}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/sessions"
                      className="text-xs font-semibold text-emerald-600 hover:underline shrink-0"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Badges */}
          {rank && rank.badges.some((b) => b.earned) && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Badges
              </h2>
              <div className="flex flex-wrap gap-2">
                {rank.badges
                  .filter((b) => b.earned)
                  .map((b) => (
                    <span
                      key={b.id}
                      title={b.description ?? undefined}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                    >
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      {b.name}
                    </span>
                  ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Always-available quick links */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Quick access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink
            href="/dashboard/assessment"
            icon={<ClipboardList className="h-5 w-5 text-emerald-600" />}
            label="Assessment"
            description="Your five categories and the aptitude test."
          />
          <QuickLink
            href="/dashboard/reports"
            icon={<Newspaper className="h-5 w-5 text-sky-600" />}
            label="My Reports"
            description="Reports your counsellor has shared."
          />
          <QuickLink
            href="/dashboard/activities/comments"
            icon={<MessageSquare className="h-5 w-5 text-violet-600" />}
            label="Comments"
            description="See all comments you've left."
          />
          <QuickLink
            href="/dashboard/activities/saved-articles"
            icon={<Bookmark className="h-5 w-5 text-amber-600" />}
            label="Saved Articles"
            description="Articles you've bookmarked."
          />
          <QuickLink
            href="/dashboard/donation"
            icon={<Heart className="h-5 w-5 text-rose-500" />}
            label="Donation"
            description="Support Student Square."
          />
        </div>
      </section>
    </div>
  );
}

function AssessmentGate({
  loading,
  done,
  total,
}: {
  loading: boolean;
  done: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 p-6">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
          <Lock className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold">Finish your assessment to unlock this</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your roadmap, SWOT and counselling sessions open once you have
            completed all {total || 5} assessment categories. Nothing you write is
            scored — it is how your counsellor gets to know your situation.
          </p>

          {loading ? (
            <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 max-w-56 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {done}/{total || 5} done
              </span>
            </div>
          )}

          <Link
            href="/dashboard/assessment"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Continue assessment <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TasksToday({ tasks }: { tasks: TodayTasks | undefined }) {
  const [setStatus, { isLoading }] = useSetMyGoalStatusMutation();

  if (!tasks) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (tasks.goals.length === 0 && tasks.sessions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing due today. Your roadmap is up to date.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.sessions.map((s) => (
        <Link
          key={s.id}
          href={`/dashboard/sessions/${s.id}`}
          className="flex items-center gap-3 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20 p-3 hover:border-sky-400 transition-colors"
        >
          <CalendarClock className="h-4 w-4 text-sky-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              Session with {s.staff.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(s.startsAt)}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        </Link>
      ))}

      {tasks.goals.map((goal) => (
        <div
          key={goal.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
        >
          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              setStatus({
                id: goal.id,
                status: goal.status === "DONE" ? "PENDING" : "DONE",
              })
            }
            className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
              goal.status === "DONE"
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-border hover:border-emerald-500"
            }`}
            aria-label={goal.status === "DONE" ? "Mark not done" : "Mark done"}
          >
            {goal.status === "DONE" && <CheckCircle2 className="h-3.5 w-3.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm ${
                goal.status === "DONE" ? "line-through text-muted-foreground" : ""
              }`}
            >
              {goal.title}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {goal.overdue ? "Overdue" : goal.cadence.toLowerCase().replace("_", " ")}
            </p>
          </div>
          <span
            className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
              GOAL_STATUS_STYLE[goal.status]
            }`}
          >
            {goal.status.replace("_", " ")}
          </span>
        </div>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p
        className={`mt-2 text-lg font-bold ${
          accent ? `inline-block px-2 py-0.5 rounded-full text-sm ${accent}` : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald-500/40 hover:shadow-md transition-all duration-200"
    >
      <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold group-hover:text-emerald-600 transition-colors">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}
