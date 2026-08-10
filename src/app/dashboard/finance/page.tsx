"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Download,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  downloadFinanceExport,
  financeExportPath,
  useCreateFinanceEntryMutation,
  useDeleteFinanceEntryMutation,
  useListMyFinanceQuery,
  useUpdateFinanceEntryMutation,
} from "@/redux/features/finance/financeApi";
import { formatMoney } from "@/lib/money";
import type {
  ExportFormat,
  FinanceCurrency,
  FinanceEntry,
  FinanceEntryInput,
} from "@/types/finance";

const fieldClass =
  "w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const CURRENCIES: FinanceCurrency[] = ["BDT", "USD", "GBP"];

const emptyForm = (): FinanceEntryInput => ({
  entryDate: new Date().toISOString().slice(0, 10),
  itemName: "",
  quantity: "1",
  unitCost: "0",
  currency: "BDT",
  moneyIn: "0",
  moneyOut: "0",
});

// Amounts stay strings from the API to the input and back — FR-13-009.
const money = (value: string | null | undefined, currency: string) =>
  formatMoney(value, currency);

export default function DashboardFinancePage() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useListMyFinanceQuery({ limit: 200 });
  const [createEntry, { isLoading: creating }] = useCreateFinanceEntryMutation();
  const [updateEntry, { isLoading: updating }] = useUpdateFinanceEntryMutation();
  const [deleteEntry] = useDeleteFinanceEntryMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceEntry | null>(null);
  const [form, setForm] = useState<FinanceEntryInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const rows = data?.data ?? [];
  const latestBalance = rows[0]?.balance;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  };

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
    setError(null);
    setOpen(true);
  };

  const patch = (p: Partial<FinanceEntryInput>) =>
    setForm((f) => ({ ...f, ...p }));

  const submit = async () => {
    setError(null);
    if (!form.itemName.trim()) return setError("Item name is required.");
    try {
      if (editing) {
        await updateEntry({ id: editing.id, data: form }).unwrap();
        toast.success("Entry updated");
      } else {
        await createEntry(form).unwrap();
        toast.success("Entry created");
      }
      setOpen(false);
    } catch (e) {
      setError(
        (e as { data?: { message?: string } })?.data?.message ?? "Save failed"
      );
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this entry? Balances will be recalculated.")) return;
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
          <h1 className="text-2xl font-bold tracking-tight">Financial Work Book</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.fullName}
            {user?.memberId ? ` · ${user.memberId}` : ""}
            {latestBalance != null
              ? ` · Balance ${money(latestBalance, rows[0]?.currency ?? "BDT")}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* FR-13-012 — the same book in three formats, one route each. */}
          {(["xlsx", "csv", "pdf"] as ExportFormat[]).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() =>
                downloadFinanceExport(
                  financeExportPath("mine", format),
                  `financial-workbook.${format}`
                ).catch(() => toast.error("Download failed"))
              }
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
            >
              <Download className="h-4 w-4" /> {format.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-bold">Sl.</th>
                <th className="px-3 py-2.5 font-bold">Date</th>
                <th className="px-3 py-2.5 font-bold">Description</th>
                <th className="px-3 py-2.5 font-bold">Currency</th>
                <th className="px-3 py-2.5 font-bold text-right">In</th>
                <th className="px-3 py-2.5 font-bold text-right">Out</th>
                <th className="px-3 py-2.5 font-bold text-right">Balance</th>
                <th className="px-3 py-2.5 font-bold w-28" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    No ledger entries yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
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
                  <td className="px-3 py-3 text-right text-emerald-700 dark:text-emerald-400">
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
                            `/finance/${row.id}/invoice.pdf`,
                            `finance-invoice-${row.slNo}.pdf`
                          ).catch(() => toast.error("Invoice download failed"))
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {editing ? "Edit entry" : "New entry"}
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Date
                <input
                  type="date"
                  className={`${fieldClass} mt-1`}
                  value={form.entryDate}
                  onChange={(e) => patch({ entryDate: e.target.value })}
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Name / description
                <input
                  className={`${fieldClass} mt-1`}
                  value={form.itemName}
                  onChange={(e) => patch({ itemName: e.target.value })}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quantity
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={`${fieldClass} mt-1`}
                    value={form.quantity}
                    onChange={(e) => patch({ quantity: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Unit cost
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={`${fieldClass} mt-1`}
                    value={form.unitCost}
                    onChange={(e) => patch({ unitCost: e.target.value })}
                  />
                </label>
              </div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Currency
                <select
                  className={`${fieldClass} mt-1`}
                  value={form.currency}
                  onChange={(e) =>
                    patch({ currency: e.target.value as FinanceCurrency })
                  }
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Money in
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={`${fieldClass} mt-1`}
                    value={form.moneyIn}
                    onChange={(e) => patch({ moneyIn: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Money out
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className={`${fieldClass} mt-1`}
                    value={form.moneyOut}
                    onChange={(e) => patch({ moneyOut: e.target.value })}
                  />
                </label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Balance is calculated automatically after save.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={creating || updating}
                  onClick={submit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {(creating || updating) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
