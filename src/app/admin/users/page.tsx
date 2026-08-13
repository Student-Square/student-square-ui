"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useAdminListUsersQuery,
  useAdminDeactivateUserMutation,
  useAdminReactivateUserMutation,
} from "@/redux/features/users/usersApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import type { UserRole, UserStatus } from "@/types/auth";
import type { AdminUserListParams, AdminUserSortKey } from "@/types/users";
import { HOME_DISTRICTS, OCCUPATION_STATUSES } from "@/lib/registration";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

const ROLE_OPTIONS: Array<{ value: UserRole | "ALL"; label: string }> = [
  { value: "ALL", label: "All roles" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "COUNSELLOR", label: "Counsellor" },
  { value: "MENTOR", label: "Mentor" },
  { value: "AUTHOR", label: "Author" },
  { value: "EDITOR", label: "Editor" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "HR_MANAGER", label: "HR Manager" },
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

/** Most columns are member-only, so an em dash is the normal case, not an error. */
const dash = (value?: string | null) => (value && value.trim() ? value : "—");

const shortDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function AdminUsersPage() {
  const me = useSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  // `?role=MEMBER` is how the old Members screen now arrives here.
  const [role, setRole] = useState<UserRole | "ALL">(
    (searchParams.get("role") as UserRole | null) ?? "ALL"
  );
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [occupationStatus, setOccupationStatus] = useState("");
  const [homeDistrict, setHomeDistrict] = useState("");
  const [sortBy, setSortBy] = useState<AdminUserSortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const isMemberView = role === "MEMBER";

  /** Same column flips direction; a new column starts ascending. */
  const toggleSort = (key: AdminUserSortKey) => {
    if (key === sortBy) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const params: AdminUserListParams = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(role !== "ALL" ? { role } : {}),
    ...(status !== "ALL" ? { status } : {}),
    ...(isMemberView && occupationStatus ? { occupationStatus } : {}),
    ...(isMemberView && homeDistrict ? { homeDistrict } : {}),
    verifiedOnly,
    sortBy,
    sortOrder,
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
            placeholder="Search name, email or Member ID…"
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
        {/* Membership filters only mean anything for the foundation register. */}
        {isMemberView && (
          <>
            <select
              value={occupationStatus}
              onChange={(e) => { setOccupationStatus(e.target.value); setPage(1); }}
              className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All occupations</option>
              {OCCUPATION_STATUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select
              value={homeDistrict}
              onChange={(e) => { setHomeDistrict(e.target.value); setPage(1); }}
              className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All districts</option>
              {HOME_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </>
        )}
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
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <SortableHeader label="User" sortKey="fullName" active={sortBy} order={sortOrder} onSort={toggleSort} />
                  <SortableHeader label="Member ID" sortKey="memberId" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Role" sortKey="role" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="District" sortKey="homeDistrict" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden xl:table-cell" />
                  <SortableHeader label="Occupation" sortKey="occupationStatus" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden xl:table-cell" />
                  <SortableHeader label="Study" sortKey="studyLevel" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden 2xl:table-cell" />
                  <SortableHeader label="Status" sortKey="status" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Joined" sortKey="createdAt" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Last login" sortKey="lastLoginAt" active={sortBy} order={sortOrder} onSort={toggleSort} className="hidden 2xl:table-cell" />
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/admin/users/${user.id}`);
                    }}
                    tabIndex={0}
                    title={`Open ${user.fullName}`}
                    className="cursor-pointer hover:bg-muted/20 focus:bg-muted/30 focus:outline-none transition-colors"
                  >
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
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground leading-tight">{user.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{user.email}</p>
                          {user.profile?.phone && (
                            <p className="text-[11px] text-muted-foreground/80">{user.profile.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell whitespace-nowrap text-muted-foreground">
                      {dash(user.memberId)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={ROLE_BADGE}>{user.role.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell whitespace-nowrap text-muted-foreground">
                      {dash(user.memberProfile?.homeDistrict)}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell whitespace-nowrap text-muted-foreground">
                      {dash(user.memberProfile?.occupationStatus)}
                    </td>
                    <td className="px-4 py-3 hidden 2xl:table-cell text-muted-foreground">
                      <p className="whitespace-nowrap">{dash(user.memberProfile?.studyLevel)}</p>
                      {user.memberProfile?.institutionName && (
                        <p className="text-[11px] text-muted-foreground/70 max-w-[14rem] truncate">
                          {user.memberProfile.institutionName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[user.status]}`}>
                        {user.status === "PENDING_VERIFICATION" ? "Unverified" : user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell whitespace-nowrap text-muted-foreground">
                      {shortDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 hidden 2xl:table-cell whitespace-nowrap text-muted-foreground">
                      {shortDate(user.lastLoginAt)}
                    </td>
                    {/* Row-level navigation must not fire from the action buttons. */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                    <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
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

/** Header cell that sorts its column; the icon shows the current direction. */
function SortableHeader({
  label,
  sortKey,
  active,
  order,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: AdminUserSortKey;
  active: AdminUserSortKey;
  order: "asc" | "desc";
  onSort: (key: AdminUserSortKey) => void;
  className?: string;
}) {
  const isActive = active === sortKey;
  const Icon = !isActive ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown;

  return (
    <th className={`px-4 py-3 text-left font-semibold ${className}`} aria-sort={isActive ? (order === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 uppercase tracking-widest transition-colors hover:text-foreground ${
          isActive ? "text-foreground" : ""
        }`}
      >
        {label}
        <Icon className={`h-3 w-3 ${isActive ? "text-emerald-600" : "opacity-40"}`} />
      </button>
    </th>
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
