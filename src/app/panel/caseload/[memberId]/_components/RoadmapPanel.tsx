"use client";

import { useState } from "react";
import {
  useCreateGoalMutation,
  useCreateMilestoneMutation,
  useDeleteGoalMutation,
  useDeleteMilestoneMutation,
  useGetMemberRoadmapQuery,
  useUpdateMilestoneMutation,
} from "@/redux/features/care/careApi";
import { formatDate, GOAL_STATUS_STYLE, localInputToIso } from "@/lib/care";
import type { RoadmapPlan } from "@/types/care";
import { Check, Flag, Loader2, Plus, Target, Trash2 } from "lucide-react";

/**
 * FR-07-006 — two plans, two owners.
 *
 * The counsellor owns the Assessment Plan, the mentor owns the Progress Plan
 * and the career path. The server enforces that; this panel simply hides the
 * add controls the caller cannot use, so nobody discovers the rule via a 403.
 */
export function RoadmapPanel({
  memberId,
  role,
}: {
  memberId: string;
  role: string | null;
}) {
  const { data: roadmap, isLoading } = useGetMemberRoadmapQuery(memberId);
  const [createGoal, { isLoading: creatingGoal }] = useCreateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();
  const [createMilestone, { isLoading: creatingMilestone }] =
    useCreateMilestoneMutation();
  const [updateMilestone] = useUpdateMilestoneMutation();
  const [deleteMilestone] = useDeleteMilestoneMutation();

  const elevated = role === "SUPER_ADMIN" || role === "ADMIN";
  const canEditPlan = (plan: RoadmapPlan) =>
    elevated ||
    (plan === "ASSESSMENT_PLAN" ? role === "COUNSELLOR" : role === "MENTOR");
  const canEditPath = elevated || role === "MENTOR";

  const [goalForm, setGoalForm] = useState<{
    plan: RoadmapPlan | null;
    title: string;
    cadence: "WEEKLY" | "MONTHLY" | "ONE_OFF";
    dueAt: string;
  }>({ plan: null, title: "", cadence: "WEEKLY", dueAt: "" });

  const [milestone, setMilestone] = useState({ title: "", targetDate: "" });

  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  const goals = roadmap?.goals ?? [];
  const milestones = roadmap?.milestones ?? [];

  const submitGoal = async (plan: RoadmapPlan) => {
    if (goalForm.title.trim().length < 2) return;
    await createGoal({
      memberId,
      plan,
      title: goalForm.title.trim(),
      cadence: goalForm.cadence,
      dueAt: goalForm.dueAt ? localInputToIso(goalForm.dueAt) : undefined,
    })
      .unwrap()
      .catch(() => null);
    setGoalForm({ plan: null, title: "", cadence: "WEEKLY", dueAt: "" });
  };

  const submitMilestone = async () => {
    if (milestone.title.trim().length < 2) return;
    await createMilestone({
      memberId,
      title: milestone.title.trim(),
      targetDate: milestone.targetDate
        ? localInputToIso(milestone.targetDate)
        : undefined,
    })
      .unwrap()
      .catch(() => null);
    setMilestone({ title: "", targetDate: "" });
  };

  return (
    <div className="space-y-6">
      {(["ASSESSMENT_PLAN", "PROGRESS_PLAN"] as RoadmapPlan[]).map((plan) => {
        const planGoals = goals.filter((g) => g.plan === plan);
        const editable = canEditPlan(plan);

        return (
          <section key={plan} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold">
                  {plan === "ASSESSMENT_PLAN" ? "Assessment Plan" : "Progress Plan"}
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  {plan === "ASSESSMENT_PLAN" ? "counsellor" : "mentor"}
                </span>
              </div>
              {editable && (
                <button
                  type="button"
                  onClick={() =>
                    setGoalForm((f) => ({
                      ...f,
                      plan: f.plan === plan ? null : plan,
                      title: "",
                    }))
                  }
                  className="text-muted-foreground hover:text-emerald-600"
                  aria-label="Add goal"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {goalForm.plan === plan && (
              <div className="mb-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2">
                <input
                  autoFocus
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="Goal"
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                />
                <select
                  value={goalForm.cadence}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      cadence: e.target.value as typeof goalForm.cadence,
                    })
                  }
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="ONE_OFF">One-off</option>
                </select>
                <input
                  type="datetime-local"
                  value={goalForm.dueAt}
                  onChange={(e) => setGoalForm({ ...goalForm, dueAt: e.target.value })}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void submitGoal(plan)}
                  disabled={creatingGoal}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Add
                </button>
              </div>
            )}

            {planGoals.length === 0 ? (
              <p className="text-xs text-muted-foreground">No goals in this plan yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {planGoals.map((goal) => (
                  <li
                    key={goal.id}
                    className="group flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{goal.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {goal.cadence.toLowerCase().replace("_", " ")}
                        {goal.dueAt ? ` · due ${formatDate(goal.dueAt)}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        GOAL_STATUS_STYLE[goal.status]
                      }`}
                    >
                      {goal.status.replace("_", " ")}
                    </span>
                    {editable && (
                      <button
                        type="button"
                        onClick={() => deleteGoal({ id: goal.id, memberId })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-600"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {/* Career path visual — FR-07-004 */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-bold">Career path</h3>
            <span className="text-[10px] text-muted-foreground">mentor</span>
          </div>
        </div>

        {canEditPath && (
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
            <input
              value={milestone.title}
              onChange={(e) => setMilestone({ ...milestone, title: e.target.value })}
              placeholder="Milestone, e.g. Internship secured"
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
            />
            <input
              type="datetime-local"
              value={milestone.targetDate}
              onChange={(e) =>
                setMilestone({ ...milestone, targetDate: e.target.value })
              }
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => void submitMilestone()}
              disabled={creatingMilestone}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              Add
            </button>
          </div>
        )}

        {milestones.length === 0 ? (
          <p className="text-xs text-muted-foreground">No milestones yet.</p>
        ) : (
          <ol className="relative border-l border-border ml-2 space-y-4">
            {milestones.map((m) => (
              <li key={m.id} className="ml-4 group">
                <span
                  className={`absolute -left-[5px] h-2.5 w-2.5 rounded-full ${
                    m.achievedAt ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                />
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.achievedAt
                        ? `Achieved ${formatDate(m.achievedAt)}`
                        : m.targetDate
                          ? `Target ${formatDate(m.targetDate)}`
                          : "No target date"}
                    </p>
                  </div>
                  {canEditPath && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() =>
                          updateMilestone({
                            id: m.id,
                            memberId,
                            achieved: !m.achievedAt,
                          })
                        }
                        className="text-muted-foreground hover:text-emerald-600"
                        aria-label="Toggle achieved"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMilestone({ id: m.id, memberId })}
                        className="text-muted-foreground hover:text-rose-600"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
