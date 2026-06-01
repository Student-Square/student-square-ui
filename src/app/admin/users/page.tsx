"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useAdminListUsersQuery,
  useAdminDeactivateUserMutation,
  useAdminReactivateUserMutation,
} from "@/redux/features/users/usersApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import type { UserRole, UserStatus } from "@/types/auth";
import type { AdminUserListParams } from "@/types/users";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Search, UserCheck, UserX } from "lucide-react";

const ROLE_OPTIONS: Array<{ value: UserRole | "ALL"; label: string }> = [
  { value: "ALL", label: "All roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Editor" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "MEMBER", label: "Member" },
];

const STATUS_OPTIONS: Array<{ value: UserStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_VERIFICATION", label: "Pending verification" },
];

const STATUS_BADGE: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  PENDING_VERIFICATION: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

const ROLE_BADGE =
  "bg-muted text-muted-foreground text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded font-bold";

export default function AdminUsersPage() {
  const me = useSelector(selectCurrentUser);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params: AdminUserListParams = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(role !== "ALL" ? { role } : {}),
    ...(status !== "ALL" ? { status } : {}),
    verifiedOnly,
    page,
    limit,
  };

  const { data, isLoading, isError } = useAdminListUsersQuery(params);
  const [deactivate] = useAdminDeactivateUserMutation();
  const [reactivate] = useAdminReactivateUserMutation();

  const handleDeactivate = async (id: string) => {
    if (id === me?.id) { toast.error("You cannot deactivate yourself."); return; }
    if (!confirm("Deactivate this user?")) return;
    try {
      await deactivate(id).unwrap();
      toast.success("User deactivated");
    } catch { /* baseApi toasts */ }
  };

  const handleReactivate = async (id: string) => {
    try {
      await reactivate(id).unwrap();
      toast.success("User reactivated");
    } catch { /* baseApi toasts */ }
  };

  return (
    <>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage user accounts and roles.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New user
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search name or email…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value as UserRole | "ALL"); setPage(1); }}
          className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as UserStatus | "ALL"); setPage(1); }}
          className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }}
            className="rounded"
          />
          Verified only
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading users…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load users.</p>}

      {data && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">User</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          {user.profile?.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">{user.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={ROLE_BADGE}>{user.role.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[user.status]}`}>
                        {user.status === "PENDING_VERIFICATION" ? "Unverified" : user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {user.status === "ACTIVE" ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(user.id)}
                            disabled={user.id === me?.id}
                            title="Deactivate"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReactivate(user.id)}
                            title="Reactivate"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          href={`/admin/users/${user.id}`}
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={data.totalPages}
            total={data.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        </>
      )}
    </>
  );
}

/* ── Pagination helpers ── */

function getPageRange(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "..."> = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
      {/* Left: count + per-page */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <span>
          {total === 0 ? "0 results" : `${from}–${to} of ${total}`}
        </span>
        <label className="flex items-center gap-1.5">
          <span className="text-xs">Per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="text-xs rounded-md border border-border bg-background px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Right: page buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageRange(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-muted-foreground select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-border hover:bg-muted text-foreground"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
