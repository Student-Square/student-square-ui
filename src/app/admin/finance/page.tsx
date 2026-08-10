"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Download,
  FileText,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  downloadFinanceExport,
  useAdminDeleteFinanceEntryMutation,
  useAdminListFinanceQuery,
  useAdminUpdateFinanceEntryMutation,
} from "@/redux/features/finance/financeApi";
import { formatMoney } from "@/lib/money";
import type { FinanceCurrency, FinanceEntry, FinanceEntryInput } from "@/types/finance";

const fieldClass =
  "w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none";

const CURRENCIES: FinanceCurrency[] = ["BDT", "USD", "GBP"];

export default function AdminFinancePage() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<FinanceEntry | null>(null);
  const [form, setForm] = useState<Partial<FinanceEntryInput>>({});

  const params = {
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    page,
    limit: 50,
  };

  const { data, isLoading } = useAdminListFinanceQuery(params);
  const [updateEntry, { isLoading: updating }] =
    useAdminUpdateFinanceEntryMutation();
  const [deleteEntry] = useAdminDeleteFinanceEntryMutation();

  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const exportQuery = new URLSearchParams();
  if (params.q) exportQuery.set("q", params.q);
  if (params.from) exportQuery.set("from", params.from);
  if (params.to) exportQuery.set("to", params.to);
  const qs = exportQuery.toString();
  const suffix = qs ? `?${qs}` : "";

  const openEdit = (row: FinanceEntry) => {
    setEditing(row);
    setForm({
      entryDate: row.entryDate.slice(0, 10),
      itemName: row.itemName,
      quantity: row.quantity,
      unitCost: row.unitCost,
      currency: row.currency as FinanceCurrency,
      moneyIn: row.moneyIn,
      moneyOut: row.moneyOut,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateEntry({ id: editing.id, data: form }).unwrap();
      toast.success("Updated");
      setEditing(null);
    } catch {
      /* toasted */
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteEntry(id).unwrap();
      toast.success("Deleted");
    } catch {
      /* toasted */
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Financial Work Book
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All members&apos; ledgers — editable by admin.
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
                <th className="px-3 py-2.5 font-bold">Name</th>
                <th className="px-3 py-2.5 font-bold">Member ID</th>
                <th className="px-3 py-2.5 font-bold">Sl.</th>
                <th className="px-3 py-2.5 font-bold">Date</th>
                <th className="px-3 py-2.5 font-bold">Description</th>
                <th className="px-3 py-2.5 font-bold">Cur</th>
                <th className="px-3 py-2.5 font-bold text-right">In</th>
                <th className="px-3 py-2.5 font-bold text-right">Out</th>
                <th className="px-3 py-2.5 font-bold text-right">Balance</th>
                <th className="px-3 py-2.5 font-bold w-28" />
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
                    No finance entries found.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="px-3 py-3 font-medium">{row.user.fullName}</td>
                  <td className="px-3 py-3 text-xs font-mono">
                    {row.user.memberId ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">{row.slNo}</td>
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
                  <td className="px-3 py-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        type="button"
                        title="Invoice PDF"
                        onClick={() =>
                          downloadFinanceExport(
                            `/admin/finance/${row.id}/invoice.pdf`,
                            `finance-invoice-${row.slNo}.pdf`
                          ).catch(() => toast.error("Invoice failed"))
                        }
                        className="p-1.5 rounded-md hover:bg-muted"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="p-1.5 rounded-md hover:bg-muted"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Edit entry</h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {editing.user.fullName} · {editing.user.memberId ?? "—"} · Sl.{" "}
              {editing.slNo}
            </p>
            <input
              type="date"
              className={fieldClass}
              value={form.entryDate ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, entryDate: e.target.value }))}
            />
            <input
              className={fieldClass}
              value={form.itemName ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))}
              placeholder="Item name"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className={fieldClass}
                value={form.quantity ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: e.target.value }))
                }
                placeholder="Qty"
              />
              <input
                type="number"
                className={fieldClass}
                value={form.unitCost ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unitCost: e.target.value }))
                }
                placeholder="Unit cost"
              />
            </div>
            <select
              className={fieldClass}
              value={form.currency ?? "BDT"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  currency: e.target.value as FinanceCurrency,
                }))
              }
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className={fieldClass}
                value={form.moneyIn ?? "0"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, moneyIn: e.target.value }))
                }
                placeholder="Money in"
              />
              <input
                type="number"
                className={fieldClass}
                value={form.moneyOut ?? "0"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, moneyOut: e.target.value }))
                }
                placeholder="Money out"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-3 py-2 rounded-lg border text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={saveEdit}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
