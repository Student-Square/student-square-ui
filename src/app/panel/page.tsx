"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetCaseloadQuery,
  useGetSessionsQuery,
} from "@/redux/features/care/careApi";
import { formatDateTime, SESSION_STATUS_STYLE } from "@/lib/care";
import { CalendarClock, ChevronRight, Loader2, Users } from "lucide-react";

export default function PanelOverviewPage() {
  const user = useSelector(selectCurrentUser);
  const { data: caseload, isLoading: loadingCases } = useGetCaseloadQuery();
  const { data: sessions, isLoading: loadingSessions } = useGetSessionsQuery({
    status: "SCHEDULED",
  });

  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const upcoming = (sessions ?? []).slice(0, 5);
  const needsAttention = (caseload ?? []).filter(
    (c) => c.progress.assessmentsSubmitted > 0 && c.progress.reports === 0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Good to see you, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your students and what is coming up.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Active students"
          value={loadingCases ? "…" : String(caseload?.length ?? 0)}
          href="/panel/caseload"
          icon={<Users className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          label="Upcoming sessions"
          value={loadingSessions ? "…" : String(sessions?.length ?? 0)}
          href="/panel/sessions"
          icon={<CalendarClock className="h-5 w-5 text-sky-600" />}
        />
        <StatCard
          label="Awaiting a report"
          value={loadingCases ? "…" : String(needsAttention.length)}
          href="/panel/caseload"
          icon={<Users className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Next sessions
        </h2>

        {loadingSessions ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing booked yet.{" "}
            <Link href="/panel/availability" className="text-emerald-600 hover:underline">
              Publish availability
            </Link>{" "}
            so students can book.
          </p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/panel/sessions/${s.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {s.member.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(s.startsAt)} · {s.mode === "ONLINE" ? "Online" : "In person"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                      SESSION_STATUS_STYLE[s.status]
                    }`}
                  >
                    {s.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4 hover:border-emerald-500/40 transition-colors"
    >
      <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </Link>
  );
}
