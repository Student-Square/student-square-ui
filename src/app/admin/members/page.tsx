"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useAdminListUsersQuery } from "@/redux/features/users/usersApi";
import {
  HOME_DISTRICTS,
  OCCUPATION_STATUSES,
} from "@/lib/registration";
import type { UserStatus } from "@/types/auth";

const STATUS_BADGE: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  PENDING_VERIFICATION:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

export default function AdminMembersPage() {
  const [q, setQ] = useState("");
  const [occupationStatus, setOccupationStatus] = useState("");
  const [homeDistrict, setHomeDistrict] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminListUsersQuery({
    role: "MEMBER",
    foundationOnly: true,
    verifiedOnly: false,
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(occupationStatus ? { occupationStatus } : {}),
    ...(homeDistrict ? { homeDistrict } : {}),
    page,
    limit: 20,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Foundation members
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Members who completed the foundation registration questionnaire.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background min-w-[14rem]"
            placeholder="Name, email, Member ID…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={occupationStatus}
          onChange={(e) => {
            setOccupationStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All occupations</option>
          {OCCUPATION_STATUSES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={homeDistrict}
          onChange={(e) => {
            setHomeDistrict(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All districts</option>
          {HOME_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <p className="text-sm text-red-600 mb-4">Failed to load members.</p>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-bold">Name</th>
                <th className="px-3 py-2.5 font-bold">Member ID</th>
                <th className="px-3 py-2.5 font-bold">Email</th>
                <th className="px-3 py-2.5 font-bold">District</th>
                <th className="px-3 py-2.5 font-bold">Occupation</th>
                <th className="px-3 py-2.5 font-bold">Study</th>
                <th className="px-3 py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No foundation members yet.
                  </td>
                </tr>
              )}
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {u.fullName}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-xs font-mono">
                    {u.memberId ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">{u.email}</td>
                  <td className="px-3 py-3 text-xs">
                    {u.memberProfile?.homeDistrict ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-xs max-w-[10rem]">
                    {u.memberProfile?.occupationStatus ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {u.memberProfile?.studyLevel ?? "—"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${STATUS_BADGE[u.status]}`}
                    >
                      {u.status.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-muted-foreground">
            Page {page} / {totalPages} · {data?.total ?? 0} total
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
