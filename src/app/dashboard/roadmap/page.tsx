"use client";

import {
  useGetMyRoadmapQuery,
  useSetMyGoalStatusMutation,
} from "@/redux/features/care/careApi";
import { formatDate, GOAL_STATUS_STYLE } from "@/lib/care";
import type { RoadmapPlan } from "@/types/care";
import { CheckCircle2, Flag, Loader2, Route, Target } from "lucide-react";

/**
 * FR-07 — the member's roadmap.
 *
 * The member can move a goal's status and nothing else: the text, the dates
 * and the structure belong to the counsellor and mentor who wrote them. MISSED
 * is never a button — it is the nightly sweep's verdict (FR-07-007).
 */

const PLAN_LABEL: Record<RoadmapPlan, { title: string; blurb: string }> = {
  ASSESSMENT_PLAN: {
    title: "Assessment Plan",
    blurb: "Set by your counsellor from your assessment.",
  },
  PROGRESS_PLAN: {
    title: "Progress Plan",
    blurb: "Set by your mentor as you go.",
  },
};

export default function MyRoadmapPage() {
  const { data: roadmap, isLoading } = useGetMyRoadmapQuery();
  const [setStatus, { isLoading: saving }] = useSetMyGoalStatusMutation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your roadmap…
      </div>
    );
  }

  const goals = roadmap?.goals ?? [];
  const milestones = roadmap?.milestones ?? [];
  const empty = goals.length === 0 && milestones.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Roadmap</h1>
        {roadmap?.headline ? (
          <p className="mt-1 text-sm text-muted-foreground">{roadmap.headline}</p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            Goals from your counsellor and mentor, and where they lead.
          </p>
        )}
      </div>

      {empty && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Route className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Your roadmap is not set up yet. Your counsellor builds it after
            reviewing your assessment.
          </p>
        </div>
      )}

      {(["ASSESSMENT_PLAN", "PROGRESS_PLAN"] as RoadmapPlan[]).map((plan) => {
        const planGoals = goals.filter((g) => g.plan === plan);
        if (planGoals.length === 0) return null;

        const done = planGoals.filter((g) => g.status === "DONE").length;

        return (
          <section key={plan}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <Target className="h-4 w-4 text-emerald-600" />
                  {PLAN_LABEL[plan].title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {PLAN_LABEL[plan].blurb}
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {done}/{planGoals.length}
              </span>
            </div>

            <ul className="space-y-2">
              {planGoals.map((goal) => (
                <li
                  key={goal.id}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setStatus({
                        id: goal.id,
                        status: goal.status === "DONE" ? "IN_PROGRESS" : "DONE",
                      })
                    }
                    className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      goal.status === "DONE"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-border hover:border-emerald-500"
                    }`}
                    aria-label={goal.status === "DONE" ? "Mark not done" : "Mark done"}
                  >
                    {goal.status === "DONE" && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        goal.status === "DONE"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {goal.description}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {goal.cadence.toLowerCase().replace("_", " ")}
                      {goal.dueAt ? ` · due ${formatDate(goal.dueAt)}` : ""}
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0 ${
                      GOAL_STATUS_STYLE[goal.status]
                    }`}
                  >
                    {goal.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {milestones.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
            <Flag className="h-4 w-4 text-sky-600" />
            Your career path
          </h2>
          <ol className="relative border-l border-border ml-2 space-y-5">
            {milestones.map((m) => (
              <li key={m.id} className="ml-5">
                <span
                  className={`absolute -left-[5px] h-2.5 w-2.5 rounded-full ${
                    m.achievedAt ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                />
                <p className="text-sm font-medium">{m.title}</p>
                {m.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.description}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {m.achievedAt
                    ? `Achieved ${formatDate(m.achievedAt)}`
                    : m.targetDate
                      ? `Target ${formatDate(m.targetDate)}`
                      : "No target date yet"}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
