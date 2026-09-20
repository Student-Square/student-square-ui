"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Eye,
  FileText,
  Layers,
  Loader2,
  Scale,
  Search,
} from "lucide-react";
import {
  downloadFinanceExport,
  useAdminCreateInvoiceMutation,
  useAdminListFinanceQuery,
} from "@/redux/features/finance/financeApi";
import { usePdfPreview } from "@/components/common/PdfPreview";
import Pagination from "@/components/common/Pagination";
import { TABLE_PAGE_SIZE } from "@/lib/pagination";
import {
  BOOK_PANELS,
  SortHeader,
  toggleSort,
} from "@/components/books/SortHeader";
import { formatMoney } from "@/lib/money";
import type { FinanceEntry } from "@/types/finance";
import type { UserRole } from "@/types/auth";

const isExpense = (row: FinanceEntry) => {
  const n = Number(row.moneyOut);
  return Number.isFinite(n) && n > 0;
};

type RangePreset = "7" | "15" | "30" | "custom" | "all";

const isoToday = () => new Date().toISOString().slice(0, 10);

/** Inclusive last-N-days window ending today. */
const fromDaysAgo = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString().slice(0, 10);
};

/**
 * All FWB — site-wide ledger as a field-column table with filter, sort,
 * group-by-user and pagination. Personal create/edit is on My FWB.
 */
export default function AdminFinancePage() {
  const [q, setQ] = useState("");
  const [rangePreset, setRangePreset] = useState<RangePreset>("30");
  const [from, setFrom] = useState(() => fromDaysAgo(30));
  const [to, setTo] = useState(() => isoToday());
  const [panelScope, setPanelScope] = useState<"" | UserRole>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(TABLE_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("entryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [groupByUser, setGroupByUser] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(panelScope ? { panelScope } : {}),
    sortBy: effectiveSortBy,
    sortOrder: effectiveSortOrder,
    page,
    limit,
  };

  const { data, isLoading } = useAdminListFinanceQuery(params);
  const [createInvoice, { isLoading: invoicing }] =
    useAdminCreateInvoiceMutation();
  const { openPdfPreview, pdfPreview, pdfPreviewLoading } = usePdfPreview();

  const previewInvoice = (
    invoiceId: string,
    fileName: string,
    subtitle: string
  ) =>
    openPdfPreview({
      path: `/admin/finance/invoices/${invoiceId}/pdf`,
      fileName,
      title: "Invoice",
      subtitle,
    });

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currencyTotals = data?.totals ?? [];

  const selectable = useMemo(
    () => rows.filter((r) => isExpense(r) && !r.invoiceId),
    [rows]
  );

  const selectedRows = rows.filter((r) => selected.has(r.id));
  const selectedUserId =
    selectedRows.length > 0 ? selectedRows[0].user.id : null;
  const sameUser =
    selectedRows.length === 0 ||
    selectedRows.every((r) => r.user.id === selectedUserId);
  const sameCurrency =
    selectedRows.length === 0 ||
    selectedRows.every((r) => r.currency === selectedRows[0].currency);

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

  const toggleRow = (row: FinanceEntry) => {
    if (!isExpense(row) || row.invoiceId) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(row.id)) next.delete(row.id);
      else next.add(row.id);
      return next;
    });
  };

  const onCreateInvoice = async () => {
    if (!selectedUserId || selected.size === 0) {
      toast.error("Select expense lines for one member.");
      return;
    }
    if (!sameUser) {
      toast.error("All selected lines must belong to the same member.");
      return;
    }
    if (!sameCurrency) {
      toast.error("Selected lines must use the same currency.");
      return;
    }
    try {
      const invoice = await createInvoice({
        userId: selectedUserId,
        entryIds: Array.from(selected),
      }).unwrap();
      setSelected(new Set());
      toast.success(`Invoice ${invoice.number} created`);
      await previewInvoice(invoice.id, `${invoice.number}.pdf`, invoice.number);
    } catch (e) {
      toast.error(
        (e as { data?: { message?: string } })?.data?.message ??
          "Could not create invoice"
      );
    }
  };

  const tableRows = useMemo(() => {
    const out: Array<
      | { kind: "group"; key: string; label: string; memberId: string | null }
      | { kind: "row"; row: FinanceEntry }
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

  return (
    <div>
      {pdfPreview}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All FWB
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every member&apos;s ledger as a table. Select one member&apos;s
            expense lines to build a single invoice (preview, then download). Your own book is under{" "}
            <span className="font-medium text-foreground">My FWB</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            id="fwb-range"
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
              downloadFinanceExport(
                `/admin/finance/export.csv${suffix}`,
                "financial-workbook-all.csv"
              ).catch(() => toast.error("Download failed"))
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Excel (CSV)
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
          <p className="text-sm font-medium">
            {selected.size} line{selected.size === 1 ? "" : "s"} selected
            {selectedRows[0] ? ` · ${selectedRows[0].user.fullName}` : ""}
          </p>
          <button
            type="button"
            disabled={invoicing || !sameUser || !sameCurrency}
            onClick={() => void onCreateInvoice()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {invoicing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Create one invoice
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
          {!sameUser && (
            <p className="text-xs text-red-600">
              Pick lines from one member only.
            </p>
          )}
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
            Money in
          </div>
          {isLoading && !data ? (
            <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />
          ) : currencyTotals.length === 0 ? (
            <p className="mt-2 text-2xl font-bold tabular-nums">0.00</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {currencyTotals.map((t) => (
                <li key={`in-${t.currency}`} className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {formatMoney(t.moneyIn)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />
            Money out
          </div>
          {isLoading && !data ? (
            <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />
          ) : currencyTotals.length === 0 ? (
            <p className="mt-2 text-2xl font-bold tabular-nums">0.00</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {currencyTotals.map((t) => (
                <li key={`out-${t.currency}`} className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                    {formatMoney(t.moneyOut)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Scale className="h-3.5 w-3.5 text-sky-600" />
            Net
          </div>
          {isLoading && !data ? (
            <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground" />
          ) : currencyTotals.length === 0 ? (
            <p className="mt-2 text-2xl font-bold tabular-nums">0.00</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {currencyTotals.map((t) => (
                <li key={`net-${t.currency}`} className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold tabular-nums">
                    {formatMoney(t.net)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
            placeholder="Search name, Member ID, item…"
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
          <table className="w-full text-sm min-w-[64rem]">
            <thead className="bg-muted/50 text-left text-xs">
              <tr>
                <th className="px-3 py-2.5 font-bold w-10" />
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
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Sl."
                    column="slNo"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Date"
                    column="entryDate"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Item"
                    column="itemName"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Unit cost
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Currency"
                    column="currency"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-right">
                  <SortHeader
                    label="In"
                    column="moneyIn"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                    align="right"
                  />
                </th>
                <th className="px-3 py-2.5 text-right">
                  <SortHeader
                    label="Out"
                    column="moneyOut"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                    align="right"
                  />
                </th>
                <th className="px-3 py-2.5 text-right">
                  <SortHeader
                    label="Balance"
                    column="balance"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                    align="right"
                  />
                </th>
                <th className="px-3 py-2.5">
                  <SortHeader
                    label="Panel"
                    column="panelScope"
                    sortBy={effectiveSortBy}
                    sortOrder={effectiveSortOrder}
                    onSort={onSort}
                  />
                </th>
                <th className="px-3 py-2.5 text-muted-foreground font-bold uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={14}
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
                    colSpan={14}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    No ledger entries.
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
                      colSpan={14}
                      className="px-3 py-2 text-xs font-bold uppercase tracking-wide"
                    >
                      {item.label}
                      {item.memberId ? (
                        <span className="ml-2 font-mono font-normal text-muted-foreground normal-case tracking-normal">
                          {item.memberId}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const row = item.row;
                    const canSelect = isExpense(row) && !row.invoiceId;
                    return (
                      <tr
                        key={row.id}
                        className="border-t border-border align-top hover:bg-muted/20"
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(row.id)}
                            disabled={!canSelect}
                            onChange={() => toggleRow(row)}
                            aria-label={`Select ${row.itemName}`}
                          />
                        </td>
                        <td className="px-3 py-3 text-xs font-medium">
                          {row.user.fullName}
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                          {row.user.memberId ?? "—"}
                        </td>
                        <td className="px-3 py-3 font-mono text-xs">
                          {row.slNo}
                        </td>
                        <td className="px-3 py-3 text-xs whitespace-nowrap">
                          {row.entryDate.slice(0, 10)}
                        </td>
                        <td className="px-3 py-3 font-medium">{row.itemName}</td>
                        <td className="px-3 py-3 text-xs text-right tabular-nums">
                          {row.quantity}
                        </td>
                        <td className="px-3 py-3 text-xs text-right tabular-nums">
                          {row.unitCost}
                        </td>
                        <td className="px-3 py-3 text-xs">{row.currency}</td>
                        <td className="px-3 py-3 text-right text-emerald-700 tabular-nums">
                          {formatMoney(row.moneyIn)}
                        </td>
                        <td className="px-3 py-3 text-right text-red-600 tabular-nums">
                          {formatMoney(row.moneyOut)}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold tabular-nums">
                          {formatMoney(row.balance)}
                        </td>
                        <td className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          {row.panelScope.replace(/_/g, " ")}
                        </td>
                        <td className="px-3 py-3 text-xs">
                          {row.invoiceId ? (
                            <button
                              type="button"
                              disabled={pdfPreviewLoading}
                              className="inline-flex items-center gap-1 text-emerald-700 hover:underline disabled:opacity-50"
                              onClick={() =>
                                void previewInvoice(
                                  row.invoiceId as string,
                                  `invoice-${row.slNo}.pdf`,
                                  `${row.itemName} · ${row.entryDate.slice(0, 10)}`
                                )
                              }
                            >
                              {pdfPreviewLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                              View
                            </button>
                          ) : canSelect ? (
                            "—"
                          ) : (
                            "n/a"
                          )}
                        </td>
                      </tr>
                    );
                  })()
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectable.length > 0 && selected.size === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: tick uninvoiced expense lines for one person, then create one
          invoice.
        </p>
      )}

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
