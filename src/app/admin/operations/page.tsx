"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Download,
  Eye,
  Layers,
  Loader2,
  Search,
} from "lucide-react";
import {
  downloadOperationExport,
  useAdminListOperationsQuery,
} from "@/redux/features/operations/operationsApi";
import { usePdfPreview } from "@/components/common/PdfPreview";
import Pagination from "@/components/common/Pagination";
import { TABLE_PAGE_SIZE } from "@/lib/pagination";
import {
  BOOK_PANELS,
  SortHeader,
  toggleSort,
} from "@/components/books/SortHeader";
import type { OperationEntry } from "@/types/operations";
import type { UserRole } from "@/types/auth";

type RangePreset = "7" | "15" | "30" | "custom" | "all";

const isoToday = () => new Date().toISOString().slice(0, 10);

/** Inclusive last-N-days window ending today. */
const fromDaysAgo = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString().slice(0, 10);
};

function formatDay(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * All DOB — site-wide operation log as a field-column table.
 * Personal create/edit lives on My DOB (/admin/my-operations).
 */
export default function AdminOperationsPage() {
  const [q, setQ] = useState("");
  const [rangePreset, setRangePreset] = useState<RangePreset>("30");
  const [from, setFrom] = useState(() => fromDaysAgo(30));
  const [to, setTo] = useState(() => isoToday());
  const [panelScope, setPanelScope] = useState<"" | UserRole>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(TABLE_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [groupByUser, setGroupByUser] = useState(false);

  const applyPreset = (preset: RangePreset) => {
    setRangePreset(preset);
    setPage(1);
    if (preset === "all") {
      setFrom("");
      setTo("");
      return;
    }
    if (preset === "custom") return;
    const days = Number(preset);
    setFrom(fromDaysAgo(days));
    setTo(isoToday());
  };

  const effectiveSortBy = groupByUser ? "fullName" : sortBy;
  const effectiveSortOrder = groupByUser ? "asc" : sortOrder;

  const params = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(from ? { from: new Date(from).toISOString() } : {}),
    ...(to ? { to: new Date(`${to}T23:59:59`).toISOString() } : {}),
    ...(panelScope ? { panelScope } : {}),
    sortBy: effectiveSortBy,
    sortOrder: effectiveSortOrder,
    page,
    limit,
  };

  const { data, isLoading } = useAdminListOperationsQuery(params);
  const { openPdfPreview, pdfPreview, pdfPreviewLoading } = usePdfPreview();
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const exportQuery = new URLSearchParams();
  if (params.q) exportQuery.set("q", params.q);
  if (params.from) exportQuery.set("from", params.from);
  if (params.to) exportQuery.set("to", params.to);
  if (panelScope) exportQuery.set("panelScope", panelScope);
  const qs = exportQuery.toString();
  const suffix = qs ? `?${qs}` : "";

  const onSort = (column: string) => {
    if (groupByUser) setGroupByUser(false);
    const next = toggleSort(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
    setPage(1);
  };

  const tableRows = useMemo(() => {
    const out: Array<
      | { kind: "group"; key: string; label: string; memberId: string | null }
      | { kind: "row"; row: OperationEntry }
    > = [];
    let lastUserId = "";
    for (const row of rows) {
      if (groupByUser && row.user.id !== lastUserId) {
        lastUserId = row.user.id;
        out.push({
          kind: "group",
          key: row.user.id,
          label: row.user.fullName,
          memberId: row.user.memberId,
        });
      }
      out.push({ kind: "row", row });
    }
    return out;
  }, [rows, groupByUser]);

  // Name + Member ID are omitted when grouped (name is the section header).
  const colSpan = groupByUser ? 7 : 9;

  return (
    <div>
      {pdfPreview}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All DOB
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every panel&apos;s Daily Operation Book as a table. Add your own
            entries under{" "}
            <Link
              href="/admin/my-operations"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              My DOB
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            id="dob-range"
            className="px-2 py-2 text-sm rounded-lg border border-border bg-background w-[7.5rem]"
            value={rangePreset}
            onChange={(e) => applyPreset(e.target.value as RangePreset)}
            aria-label="Date range"
          >
            <option value="7">7 days</option>
            <option value="15">15 days</option>
            <option value="30">30 days</option>
            <option value="custom">Custom</option>
            <option value="all">All</option>
          </select>
          {rangePreset === "custom" && (
            <>
              <input
                type="date"
                className="px-2 py-2 text-sm rounded-lg border border-border bg-background"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
                aria-label="From date"
              />
              <input
                type="date"
                className="px-2 py-2 text-sm rounded-lg border border-border bg-background"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPage(1);
                }}
                aria-label="To date"
              />
            </>
          )}
          <button
            type="button"
            onClick={() =>
              downloadOperationExport(
                `/admin/operations/export.csv${suffix}`,
                "daily-operation-book-all.csv"
              ).catch(() => toast.error("CSV download failed"))
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            type="button"
            disabled={pdfPreviewLoading}
            onClick={() =>
              void openPdfPreview({
                path: `/admin/operations/export.pdf${suffix}`,
                fileName: "daily-operation-book-all.pdf",
                title: "Daily operation book",
                subtitle: qs ? "filtered" : "every panel",
              })
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted disabled:opacity-50"
          >
            {pdfPreviewLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            View
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
            placeholder="Search name, Member ID, task…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={panelScope}
          onChange={(e) => {
            setPanelScope(e.target.value as "" | UserRole);
            setPage(1);
          }}
        >
          <option value="">All panels</option>
          {BOOK_PANELS.map((p) => (
            <option key={p} value={p}>
              {p.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setGroupByUser((v) => !v);
            setPage(1);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
            groupByUser
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-border hover:bg-muted"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Group by user
        </button>
      </div>

      <p className="mb-2 text-xs text-muted-foreground">
        {total.toLocaleString()} entr{total === 1 ? "y" : "ies"}
        {groupByUser ? " · grouped by user" : ""}
      </p>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[70rem]">
            <thead className="bg-muted/50 text-left text-xs">
              <tr>
                {!groupByUser && (
                  <>
                    <th className="px-3 py-2.5">
                      <SortHeader
                        label="Name"
                        column="fullName"
                        sortBy={effectiveSortBy}
                        sortOrder={effectiveSortOrder}
                        onSort={onSort}
                      />
                    </th>
                    <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                      Member ID
                    </th>
                  </>
                )}
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Panel"
                    column="panelScope"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Task"
                    column="taskName"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Mentors
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Attendees"
                    column="attendees"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Date"
                    column="createdAt"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    No operation entries found.
                  </td>
                </tr>
              )}
              {tableRows.map((item) =>
                item.kind === "group" ? (
                  <tr
                    key={`g-${item.key}`}
                    className="border-t border-border bg-muted/40"
                  >
                    <td
                      colSpan={colSpan}
                      className="px-3 py-2 text-xs font-bold uppercase tracking-wide"
                    >
                      {item.label}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={item.row.id}
                    className="border-t border-border align-top hover:bg-muted/20"
                  >
                    {!groupByUser && (
                      <>
                        <td className="px-3 py-3">
                          <p className="font-medium text-xs">
                            {item.row.user.fullName}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {item.row.user.memberId ?? "—"}
                        </td>
                      </>
                    )}
                    <td className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {item.row.panelScope.replace(/_/g, " ")}
                    </td>
                    <td className="px-3 py-3 font-medium max-w-[14rem]">
                      {item.row.taskName}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[12rem]">
                      {item.row.mentorsLabel || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[12rem]">
                      {item.row.attendees || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[16rem]">
                      <p className="line-clamp-2">
                        {item.row.description || "—"}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {formatDay(item.row.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {formatTime(item.row.createdAt)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(next) => {
          setLimit(next);
          setPage(1);
        }}
        className="mt-4"
      />
    </div>
  );
}
