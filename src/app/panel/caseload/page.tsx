"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetCaseloadQuery } from "@/redux/features/care/careApi";
import { TIER_STYLE } from "@/lib/care";
import { ChevronRight, Loader2, Search, Users } from "lucide-react";

/**
 * FR-10-001 — the caseload list, searchable and sortable by progress.
 *
 * Search is sent to the server (it filters by name, email and Member ID);
 * sorting is client-side because the list is one counsellor's students, not a
 * table of thousands.
 */

type Sort = "recent" | "progress" | "name";

export default function CaseloadPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const { data, isFetching } = useGetCaseloadQuery(
    search.trim() ? { search: search.trim() } : undefined
  );

  const rows = useMemo(() => {
    const list = [...(data ?? [])];
    if (sort === "name") {
      list.sort((a, b) => a.member.fullName.localeCompare(b.member.fullName));
    } else if (sort === "progress") {
      list.sort((a, b) => a.progress.percent - b.progress.percent);
    }
    return list;
  }, [data, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone currently assigned to you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or Member ID"
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value="recent">Recently assigned</option>
          <option value="progress">Least progress first</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      {isFetching && !data ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Users className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            {search ? "No students match that search." : "No students assigned yet."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.assignmentId}>
              <Link
                href={`/panel/caseload/${row.member.id}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald-500/40 hover:shadow-sm transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
                  {row.member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.member.avatarUrl}
                      alt={row.member.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {row.member.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">
                      {row.member.fullName}
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {row.member.memberId}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        TIER_STYLE[row.rank.tier]
                      }`}
                    >
                      {row.rank.tier}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {row.progress.assessmentsSubmitted} assessment
                    {row.progress.assessmentsSubmitted === 1 ? "" : "s"} ·{" "}
                    {row.progress.reports} report
                    {row.progress.reports === 1 ? "" : "s"} · as {row.role.toLowerCase()}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 max-w-40 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${row.progress.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {row.progress.goalsDone}/{row.progress.goalsTotal} goals
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
