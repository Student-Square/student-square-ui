"use client";

import { useState } from "react";
import {
  useAssignStaffMutation,
  useEndAssignmentMutation,
  useGetAssignableStaffQuery,
} from "@/redux/features/care/careApi";
import { formatDate } from "@/lib/care";
import type { CareAssignment, CareRole } from "@/types/care";
import { Loader2, UserMinus, UserPlus } from "lucide-react";

/**
 * FR-03-005 — who may assign whom.
 *
 * A Super Admin assigns the counsellor; the assigned counsellor assigns the
 * mentor. The picker below only offers the assignment the caller is actually
 * allowed to make, so the rule is visible in the UI rather than discovered as
 * a 403 after typing a name.
 */
export function CareTeamPanel({
  memberId,
  team,
  role,
}: {
  memberId: string;
  team: CareAssignment[];
  role: string | null;
}) {
  const elevated = role === "SUPER_ADMIN" || role === "ADMIN";
  const isCounsellorForThisStudent =
    role === "COUNSELLOR" &&
    team.some((a) => a.role === "COUNSELLOR" && !a.endedAt);

  const assignableRole: CareRole | null = elevated
    ? "COUNSELLOR"
    : isCounsellorForThisStudent
      ? "MENTOR"
      : null;

  const [picking, setPicking] = useState<CareRole | null>(null);

  const active = team.filter((a) => !a.endedAt);
  const hasCounsellor = active.some((a) => a.role === "COUNSELLOR");
  const hasMentor = active.some((a) => a.role === "MENTOR");

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {active.length === 0 && (
          <li className="text-sm text-muted-foreground">
            Nobody is assigned to this student yet.
          </li>
        )}
        {active.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            assignment={assignment}
            memberId={memberId}
            canEnd={
              elevated ||
              (assignment.role === "MENTOR" && isCounsellorForThisStudent)
            }
          />
        ))}
      </ul>

      {assignableRole && (
        <>
          {(assignableRole === "COUNSELLOR" ? !hasCounsellor : !hasMentor) ? (
            <div>
              <button
                type="button"
                onClick={() =>
                  setPicking(picking === assignableRole ? null : assignableRole)
                }
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:border-emerald-500/50 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Assign a {assignableRole.toLowerCase()}
              </button>

              {picking && (
                <StaffPicker
                  memberId={memberId}
                  role={picking}
                  onDone={() => setPicking(null)}
                />
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              This student already has an active {assignableRole.toLowerCase()}.
              End that assignment before adding another (FR-03-006).
            </p>
          )}
        </>
      )}

      {team.some((a) => a.endedAt) && (
        <details className="text-sm">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Past assignments
          </summary>
          <ul className="mt-2 space-y-1">
            {team
              .filter((a) => a.endedAt)
              .map((a) => (
                <li key={a.id} className="text-xs text-muted-foreground">
                  {a.staff.fullName} — {a.role.toLowerCase()}, ended{" "}
                  {formatDate(a.endedAt!)}
                  {a.endedReason ? ` (${a.endedReason})` : ""}
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function AssignmentRow({
  assignment,
  memberId,
  canEnd,
}: {
  assignment: CareAssignment;
  memberId: string;
  canEnd: boolean;
}) {
  const [endAssignment, { isLoading }] = useEndAssignmentMutation();
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className="h-9 w-9 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
        {assignment.staff.profile?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assignment.staff.profile.avatarUrl}
            alt={assignment.staff.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
            {assignment.staff.fullName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{assignment.staff.fullName}</p>
        <p className="text-xs text-muted-foreground">
          {assignment.role.toLowerCase()} since {formatDate(assignment.startedAt)}
        </p>
      </div>

      {canEnd &&
        (confirming ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                endAssignment({ id: assignment.id, memberId }).finally(() =>
                  setConfirming(false)
                )
              }
              disabled={isLoading}
              className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:border-rose-300 transition-colors"
          >
            <UserMinus className="h-3.5 w-3.5" />
            End
          </button>
        ))}
    </li>
  );
}

function StaffPicker({
  memberId,
  role,
  onDone,
}: {
  memberId: string;
  role: CareRole;
  onDone: () => void;
}) {
  const { data: staff, isLoading } = useGetAssignableStaffQuery(role);
  const [assignStaff, { isLoading: assigning }] = useAssignStaffMutation();

  if (isLoading) {
    return (
      <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />
    );
  }

  if (!staff?.length) {
    return (
      <p className="mt-3 text-xs text-muted-foreground">
        No active {role.toLowerCase()} accounts exist yet.
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-1.5">
      {staff.map((person) => (
        <li
          key={person.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{person.fullName}</p>
            <p className="text-[11px] text-muted-foreground">
              {person.activeCaseload} active student
              {person.activeCaseload === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            disabled={assigning}
            onClick={() =>
              assignStaff({ memberId, staffId: person.id, role })
                .unwrap()
                .then(onDone)
                .catch(() => null)
            }
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            Assign
          </button>
        </li>
      ))}
    </ul>
  );
}
