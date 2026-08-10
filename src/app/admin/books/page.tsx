"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  downloadFinanceExport,
  financeExportPath,
  useGetBooksSummaryQuery,
} from "@/redux/features/finance/financeApi";
import { operationExportPath } from "@/redux/features/operations/operationsApi";
import { formatMoney } from "@/lib/money";
import type { ExportFormat } from "@/types/finance";
import type { UserRole } from "@/types/auth";
import { BookOpen, Download, Loader2, Wallet } from "lucide-react";

/**
 * The centralised books view — FR-13-013.
 *
 * Every panel keeps its own Daily Task Book and Financial Work Book; this is
 * the one screen that reads across all of them, filtered by panel, person and
 * date range, with the same filters carried into every export.
 */

const PANELS: UserRole[] = [
  "MEMBER",
  "COUNSELLOR",
  "MENTOR",
  "EDITOR",
  "MODERATOR",
  "AUTHOR",
  "FINANCE_MANAGER",
  "HR_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
];

const FORMATS: ExportFormat[] = ["xlsx", "csv", "pdf"];

export default function AdminBooksPage() {
  const [filters, setFilters] = useState<{
    panelScope?: UserRole;
    from?: string;
    to?: string;
  }>({});

  const { data, isFetching } = useGetBooksSummaryQuery(filters);

  const download = (
    kind: "finance" | "operations",
    format: ExportFormat
  ) => {
    const path =
      kind === "finance"
        ? financeExportPath("all", format, filters)
        : operationExportPath("all", format, filters);

    downloadFinanceExport(
      path,
      `${kind === "finance" ? "financial-workbook" : "daily-operation-book"}-all.${format}`
    ).catch(() => toast.error("Download failed"));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All books</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every panel&apos;s task book and work book in one place.
        </p>
      </div>

      {/* Filters — the same set is carried into every export below. */}
      <div className="flex flex-wrap gap-3 items-end rounded-2xl border border-border bg-card p-4">
        <label className="text-xs font-medium">
          Panel
          <select
            value={filters.panelScope ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                panelScope: (e.target.value || undefined) as UserRole | undefined,
              }))
            }
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">All panels</option>
            {PANELS.map((panel) => (
              <option key={panel} value={panel}>
                {panel.replace("_", " ").toLowerCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium">
          From
          <input
            type="date"
            value={filters.from ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value || undefined }))
            }
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="text-xs font-medium">
          To
          <input
            type="date"
            value={filters.to ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, to: e.target.value || undefined }))
            }
            className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>

        {(filters.panelScope || filters.from || filters.to) && (
          <button
            type="button"
            onClick={() => setFilters({})}
            className="rounded-lg border border-border px-3 py-2 text-xs font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {isFetching && !data ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !data ? null : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Money in" value={formatMoney(data.totals.moneyIn, "BDT")} />
            <Stat label="Money out" value={formatMoney(data.totals.moneyOut, "BDT")} />
            <Stat label="Net" value={formatMoney(data.totals.net, "BDT")} />
            <Stat
              label="Entries"
              value={`${data.totals.financeEntries} / ${data.totals.operationEntries}`}
              hint="finance / operations"
            />
          </div>

          {/* Exports */}
          <div className="flex flex-wrap gap-4">
            <ExportGroup
              icon={<Wallet className="h-4 w-4 text-emerald-600" />}
              label="Financial Work Book"
              onDownload={(format) => download("finance", format)}
            />
            <ExportGroup
              icon={<BookOpen className="h-4 w-4 text-sky-600" />}
              label="Daily Operation Book"
              onDownload={(format) => download("operations", format)}
            />
          </div>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              By panel
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5">Panel</th>
                      <th className="px-4 py-2.5 text-right">Task entries</th>
                      <th className="px-4 py-2.5 text-right">Finance rows</th>
                      <th className="px-4 py-2.5 text-right">Money in</th>
                      <th className="px-4 py-2.5 text-right">Money out</th>
                      <th className="px-4 py-2.5 text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.panels.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          Nothing recorded for these filters.
                        </td>
                      </tr>
                    )}
                    {data.panels.map((panel) => (
                      <tr key={panel.panelScope} className="border-t border-border">
                        <td className="px-4 py-2.5 capitalize">
                          {panel.panelScope.replace("_", " ").toLowerCase()}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {panel.operationEntries}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {panel.financeEntries}
                        </td>
                        <td className="px-4 py-2.5 text-right text-emerald-600">
                          {formatMoney(panel.moneyIn)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-rose-600">
                          {formatMoney(panel.moneyOut)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {formatMoney(panel.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Highest spend
              </h2>
              {data.topContributors.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {data.topContributors.map((row, index) => (
                    <li
                      key={row.user?.id ?? index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="flex-1 min-w-0 truncate">
                        {row.user?.fullName ?? "Unknown"}
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {row.user?.memberId}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {row.entries} rows
                      </span>
                      <span className="font-semibold">
                        {formatMoney(row.moneyOut)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Invoices
              </h2>
              {data.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No invoices raised yet.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {data.invoices.map((row) => (
                    <li key={row.status} className="flex items-center gap-3 text-sm">
                      <span className="flex-1 capitalize">
                        {row.status.toLowerCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {row.count}
                      </span>
                      <span className="font-semibold">{formatMoney(row.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/admin/finance"
                className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline"
              >
                Open the finance ledger →
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ExportGroup({
  icon,
  label,
  onDownload,
}: {
  icon: React.ReactNode;
  label: string;
  onDownload: (format: ExportFormat) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        {icon} {label}
      </p>
      <div className="mt-2 flex gap-1.5">
        {FORMATS.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onDownload(format)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:border-emerald-500/50"
          >
            <Download className="h-3.5 w-3.5" /> {format.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
