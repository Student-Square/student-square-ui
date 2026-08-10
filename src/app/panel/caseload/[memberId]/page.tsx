"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { useGetMemberCaseQuery } from "@/redux/features/care/careApi";
import { formatDate, formatDateTime, SESSION_STATUS_STYLE, TIER_STYLE } from "@/lib/care";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import type { AttemptSummary, MemberCase } from "@/types/care";
import { CareTeamPanel } from "./_components/CareTeamPanel";
import { ReportsPanel } from "./_components/ReportsPanel";
import { RoadmapPanel } from "./_components/RoadmapPanel";
import { SwotPanel } from "./_components/SwotPanel";

/**
 * One student's case file.
 *
 * Reaching this page writes an audit record server-side (FR-06-009) — opening
 * a student's file is itself an event, whether or not anything is changed.
 */

const TABS = ["Overview", "Assessments", "SWOT", "Reports", "Roadmap", "Care team"] as const;
type Tab = (typeof TABS)[number];

export default function MemberCasePage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = use(params);
  const role = useSelector(selectUserRole);
  const [tab, setTab] = useState<Tab>("Overview");
  const { data, isLoading, error } = useGetMemberCaseQuery(memberId);

  const canAuthor =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "COUNSELLOR";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading case…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <ShieldAlert className="h-8 w-8 mx-auto text-rose-500" />
        <p className="mt-3 text-sm font-semibold">This student is not on your caseload</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Access to a student&apos;s record requires an active assignment.
        </p>
        <Link
          href="/panel/caseload"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to my students
        </Link>
      </div>
    );
  }

  const { member } = data;

  return (
    <div className="space-y-6">
      <Link
        href="/panel/caseload"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> My students
      </Link>

      <header className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
          {member.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-lg font-bold text-muted-foreground">
              {member.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight">{member.fullName}</h1>
            <span className="text-[11px] font-mono text-muted-foreground">
              {member.memberId}
            </span>
            {data.rank && (
              <span
                className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                  TIER_STYLE[data.rank.tier]
                }`}
              >
                {data.rank.tier} · {data.rank.points} pts
              </span>
            )}
            {member.isMinor && (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Minor — guardian consent on file
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Joined {formatDate(member.joinedAt)}
          </p>
        </div>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab data={data} />}

      {tab === "Assessments" && (
        <AssessmentsTab memberId={memberId} attempts={data.assessments} />
      )}

      {tab === "SWOT" && (
        <SwotPanel memberId={memberId} entries={data.swot} canEdit={canAuthor} />
      )}

      {tab === "Reports" && (
        <ReportsPanel
          memberId={memberId}
          reports={data.reports}
          canEdit={canAuthor}
        />
      )}

      {tab === "Roadmap" && <RoadmapPanel memberId={memberId} role={role} />}

      {tab === "Care team" && (
        <CareTeamPanel memberId={memberId} team={data.careTeam} role={role} />
      )}
    </div>
  );
}

function OverviewTab({ data }: { data: MemberCase }) {
  const profile = data.member.profile as Record<string, string | null> | null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Registration
        </h2>
        {profile ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {[
              ["Age band", profile.ageBand],
              ["Gender", profile.gender],
              ["Home district", profile.homeDistrict],
              ["Study level", profile.studyLevel],
              ["Institution", profile.institutionName],
              ["Field of study", profile.fieldOfStudy],
              ["Department", profile.subjectDepartment],
              ["Occupation", profile.occupationStatus],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-[11px] text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Registration questionnaire not completed.
          </p>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Contact details are encrypted and are not part of the case view.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Recent sessions
        </h2>
        {data.sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.sessions.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 min-w-0 truncate">
                  {formatDateTime(s.startsAt)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.staff.fullName}
                </span>
                {s.status && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                      SESSION_STATUS_STYLE[s.status]
                    }`}
                  >
                    {s.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AssessmentsTab({
  memberId,
  attempts,
}: {
  memberId: string;
  attempts: AttemptSummary[];
}) {
  if (attempts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This student has not submitted an assessment yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {attempts.map((a) => (
        <li key={a.id}>
          <Link
            href={`/panel/caseload/${memberId}/assessments/${a.id}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{a.definition.title}</p>
              <p className="text-xs text-muted-foreground">
                {a.definition.category} · v{a.definition.version} ·{" "}
                {a.submittedAt ? formatDate(a.submittedAt) : "—"}
              </p>
            </div>
            {a.scorePercent !== null ? (
              <span
                className={`text-xs font-bold ${
                  a.passed ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {Number(a.scorePercent).toFixed(0)}%
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Not scored
              </span>
            )}
            {a.requiresReassessment && (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Reassess
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
