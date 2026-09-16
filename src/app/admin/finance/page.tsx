"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Loader2, Search } from "lucide-react";
import {
  downloadFinanceExport,
  useAdminCreateInvoiceMutation,
  useAdminListFinanceQuery,
} from "@/redux/features/finance/financeApi";
import { formatMoney } from "@/lib/money";
import type { FinanceEntry } from "@/types/finance";

const isExpense = (row: FinanceEntry) => {
  const n = Number(row.moneyOut);
  return Number.isFinite(n) && n > 0;
};

/**
 * All FWB — site-wide read + invoice grouping.
 * Personal create/edit lives on My FWB (/panel/finance).
 */
export default function AdminFinancePage() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const params = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    page,
    limit: 50,
  };

  const { data, isLoading } = useAdminListFinanceQuery(params);
  const [createInvoice, { isLoading: invoicing }] =
    useAdminCreateInvoiceMutation();

  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

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
  const qs = exportQuery.toString();
  const suffix = qs ? `?${qs}` : "";

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
      await downloadFinanceExport(
        `/admin/finance/invoices/${invoice.id}/pdf`,
        `${invoice.number}.pdf`
      );
    } catch (e) {
      toast.error(
        (e as { data?: { message?: string } })?.data?.message ??
          "Could not create invoice"
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All FWB
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every member&apos;s ledger. Select one member&apos;s expense lines
            to build a single invoice PDF. Your own book is under{" "}
            <span className="font-medium text-foreground">My FWB</span>.
          </p>
        </div>
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
            <p className="text-xs text-red-600">Pick lines from one member only.</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background"
            placeholder="Search name, Member ID, item…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <input
          type="date"
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-bold w-10" />
                <th className="px-3 py-2.5 font-bold">Member</th>
                <th className="px-3 py-2.5 font-bold">Sl.</th>
                <th className="px-3 py-2.5 font-bold">Date</th>
                <th className="px-3 py-2.5 font-bold">Description</th>
                <th className="px-3 py-2.5 font-bold">Currency</th>
                <th className="px-3 py-2.5 font-bold text-right">In</th>
                <th className="px-3 py-2.5 font-bold text-right">Out</th>
                <th className="px-3 py-2.5 font-bold text-right">Balance</th>
                <th className="px-3 py-2.5 font-bold">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                    No ledger entries.
                  </td>
                </tr>
              )}
              {rows.map((row) => {
                const canSelect = isExpense(row) && !row.invoiceId;
                return (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        disabled={!canSelect}
                        onChange={() => toggleRow(row)}
                        aria-label={`Select ${row.itemName}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-xs">{row.user.fullName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {row.user.memberId ?? "—"}
                      </p>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{row.slNo}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {row.entryDate.slice(0, 10)}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{row.itemName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Qty {row.quantity} × {row.unitCost}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-xs">{row.currency}</td>
                    <td className="px-3 py-3 text-right text-emerald-700">
                      {formatMoney(row.moneyIn)}
                    </td>
                    <td className="px-3 py-3 text-right text-red-600">
                      {formatMoney(row.moneyOut)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">
                      {formatMoney(row.balance)}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {row.invoiceId ? (
                        <button
                          type="button"
                          className="text-emerald-700 hover:underline"
                          onClick={() =>
                            downloadFinanceExport(
                              `/admin/finance/invoices/${row.invoiceId}/pdf`,
                              `invoice-${row.slNo}.pdf`
                            ).catch(() => toast.error("Invoice failed"))
                          }
                        >
                          PDF
                        </button>
                      ) : canSelect ? (
                        "—"
                      ) : (
                        "n/a"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectable.length > 0 && selected.size === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: tick uninvoiced expense lines for one person, then create one invoice.
        </p>
      )}

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
            Page {page} / {totalPages}
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
