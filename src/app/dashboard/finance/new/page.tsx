"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  List,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useCreateFinanceEntryMutation,
  useCreateInvoiceMutation,
} from "@/redux/features/finance/financeApi";
import {
  formatMoney,
  isPositive,
  multiplyAmount,
  subtractAmounts,
  sumAmounts,
} from "@/lib/money";
import { financeBasePath } from "@/lib/finance-paths";
import type { FinanceCurrency, FinanceEntryInput } from "@/types/finance";

const fieldClass =
  "w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const CURRENCIES: { value: FinanceCurrency; label: string }[] = [
  { value: "BDT", label: "BDT (৳)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
];

/**
 * One item on the draft. Each becomes its own ledger row on save — the running
 * balance is computed per row server-side, so a row is the smallest unit the
 * book can hold. What binds them together is the invoice, not the ledger.
 */
type Item = {
  key: string;
  itemName: string;
  quantity: string;
  unitCost: string;
  /**
   * Which side of the ledger this line lands on — one or the other, never
   * both. Retyping the figure into one of two amount boxes was the old way in;
   * the amount is Quantity × Unit Cost, so all the form ever needed from the
   * user was the direction.
   */
  moneyInOn: boolean;
  moneyOutOn: boolean;
};

let itemSeq = 0;

/** A new line copies the direction of the one above it, so the choice is made once. */
const newItem = (previous?: Item): Item => ({
  key: `item-${(itemSeq += 1)}`,
  itemName: "",
  quantity: "1",
  unitCost: "0",
  moneyInOn: previous?.moneyInOn ?? false,
  moneyOutOn: previous?.moneyOutOn ?? true,
});

const lineTotal = (item: Item) => multiplyAmount(item.quantity, item.unitCost);

/** What the row will actually write to the ledger. */
const resolved = (item: Item) => {
  const total = lineTotal(item);
  return {
    moneyIn: item.moneyInOn ? total : "0",
    moneyOut: item.moneyOutOn ? total : "0",
  };
};

export default function NewFinanceEntryPage() {
  const router = useRouter();
  const basePath = financeBasePath(usePathname());
  const [createEntry, { isLoading: creating }] = useCreateFinanceEntryMutation();
  const [createInvoice, { isLoading: invoicing }] = useCreateInvoiceMutation();

  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [reference, setReference] = useState("");
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState<FinanceCurrency>("BDT");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [error, setError] = useState<string | null>(null);

  const saving = creating || invoicing;

  const patchItem = (key: string, patch: Partial<Item>) =>
    setItems((list) =>
      list.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );

  const removeItem = (key: string) =>
    setItems((list) =>
      list.length > 1 ? list.filter((item) => item.key !== key) : list
    );

  /**
   * Picks the side for one row. A line is money in or money out, so ticking
   * one side clears the other; ticking the side that is already on clears the
   * row, which `save` then refuses.
   */
  const toggleSide = (key: string, side: "in" | "out") =>
    setItems((list) =>
      list.map((item) => {
        if (item.key !== key) return item;
        const turningOn = side === "in" ? !item.moneyInOn : !item.moneyOutOn;
        if (!turningOn) return { ...item, moneyInOn: false, moneyOutOn: false };
        return { ...item, moneyInOn: side === "in", moneyOutOn: side === "out" };
      })
    );

  /** The master control: puts every row on the same side at once. */
  const setAllSides = (side: "in" | "out", on: boolean) =>
    setItems((list) =>
      list.map((item) => ({
        ...item,
        moneyInOn: on && side === "in",
        moneyOutOn: on && side === "out",
      }))
    );

  const master = useMemo(
    () => ({
      allIn: items.every((i) => i.moneyInOn),
      someIn: items.some((i) => i.moneyInOn),
      allOut: items.every((i) => i.moneyOutOn),
      someOut: items.some((i) => i.moneyOutOn),
    }),
    [items]
  );

  // Preview only — the ledger's own balances come back from the server.
  const totals = useMemo(() => {
    const moneyIn = sumAmounts(items.map((i) => resolved(i).moneyIn));
    const moneyOut = sumAmounts(items.map((i) => resolved(i).moneyOut));
    return { moneyIn, moneyOut, net: subtractAmounts(moneyIn, moneyOut) };
  }, [items]);

  const toInput = (item: Item): FinanceEntryInput => {
    const { moneyIn, moneyOut } = resolved(item);
    return {
      entryDate,
      currency,
      itemName: item.itemName.trim(),
      quantity: item.quantity,
      unitCost: item.unitCost,
      moneyIn,
      moneyOut,
    };
  };

  const save = async () => {
    setError(null);

    const blank = items.findIndex((i) => !i.itemName.trim());
    if (blank !== -1) return setError(`Item ${blank + 1} needs a name.`);

    // The tick is how an amount reaches the ledger now, so a row with neither
    // side on would save as 0 in / 0 out — a line that moves no money at all.
    const noSide = items.findIndex((i) => !i.moneyInOn && !i.moneyOutOn);
    if (noSide !== -1) {
      return setError(`Item ${noSide + 1} needs Money In or Money Out ticked.`);
    }

    const message = (e: unknown) =>
      (e as { data?: { message?: string } })?.data?.message ?? "Save failed";

    // The API writes one entry per call, so the rows go in first and the
    // invoice is built from the ids they come back with.
    const createdIds: string[] = [];
    for (const [i, item] of items.entries()) {
      try {
        const saved = await createEntry(toInput(item)).unwrap();
        createdIds.push(saved.id);
      } catch (e) {
        setError(
          `Item ${i + 1} failed: ${message(e)}` +
            (createdIds.length
              ? ` — ${createdIds.length} earlier item(s) were saved to the ledger.`
              : "")
        );
        return;
      }
    }

    // An invoice bills money out; a money-in row is a receipt, not a charge,
    // and the server would attach it contributing nothing to the total.
    const billable = items
      .map((item, i) => ({ item, id: createdIds[i] }))
      .filter(({ item }) => isPositive(resolved(item).moneyOut))
      .map(({ id }) => id);

    if (billable.length === 0) {
      toast.success(
        createdIds.length === 1
          ? "Entry saved"
          : `${createdIds.length} entries saved`
      );
      router.push(basePath);
      return;
    }

    try {
      await createInvoice({
        entryIds: billable,
        title: title.trim() || undefined,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      }).unwrap();
      toast.success(
        `Invoice created with ${billable.length} line${billable.length === 1 ? "" : "s"}`
      );
      router.push(basePath);
    } catch (e) {
      // The rows are already in the ledger; only the grouping failed, and they
      // can still be selected and invoiced from the ledger by hand.
      setError(
        `Entries saved, but the invoice could not be created: ${message(e)}`
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Financial Work Book (FWB)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an expense or income entry with multiple items
          </p>
        </div>
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
        >
          <List className="h-4 w-4" />
          View All Entries
        </Link>
      </div>

      <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-4 inline-flex items-center gap-2 text-base font-bold">
          <FileText className="h-4 w-4 text-emerald-600" />
          Invoice Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-semibold text-muted-foreground">
            Date <span className="text-red-600">*</span>
            <input
              type="date"
              className={`${fieldClass} mt-1`}
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Reference / Invoice No.
            <input
              className={`${fieldClass} mt-1`}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. INV-001"
            />
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Description <span className="font-normal">(optional)</span>
            <input
              className={`${fieldClass} mt-1`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Office supplies for September"
            />
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Currency <span className="text-red-600">*</span>
            <select
              className={`${fieldClass} mt-1`}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as FinanceCurrency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Direction <span className="text-red-600">*</span>
          </span>
          <DirectionBox
            tone="in"
            label="Money In"
            checked={master.allIn}
            indeterminate={master.someIn}
            onChange={() => setAllSides("in", !master.allIn)}
          />
          <DirectionBox
            tone="out"
            label="Money Out"
            checked={master.allOut}
            indeterminate={master.someOut}
            onChange={() => setAllSides("out", !master.allOut)}
          />
          <span className="text-xs text-muted-foreground">
            Sets every item below; a single line can still be changed on its own
            row.
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="inline-flex items-center gap-2 text-base font-bold">
              <List className="h-4 w-4 text-emerald-600" />
              Items
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Each item is saved as its own ledger row. The amount is Quantity ×
              Unit Cost and lands on whichever side you tick.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setItems((list) => [...list, newItem(list[list.length - 1])])
            }
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/50 px-3 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/10"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="rounded-l-lg bg-muted/60 px-3 py-2">#</th>
                <th className="bg-muted/60 px-3 py-2">
                  Item Name <span className="text-red-600">*</span>
                </th>
                <th className="bg-muted/60 px-3 py-2">
                  Quantity <span className="text-red-600">*</span>
                </th>
                <th className="bg-muted/60 px-3 py-2">
                  Unit Cost <span className="text-red-600">*</span>
                </th>
                <th className="bg-muted/60 px-3 py-2">
                  Direction <span className="text-red-600">*</span>
                </th>
                <th className="bg-muted/60 px-3 py-2 text-right">Amount</th>
                <th className="rounded-r-lg bg-muted/60 px-3 py-2 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                return (
                  <tr key={item.key} className="border-b border-border">
                    <td className="px-3 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2">
                      <input
                        className={fieldClass}
                        value={item.itemName}
                        onChange={(e) =>
                          patchItem(item.key, { itemName: e.target.value })
                        }
                        placeholder="e.g. Notebook"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        className={fieldClass}
                        value={item.quantity}
                        onChange={(e) =>
                          patchItem(item.key, { quantity: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        className={fieldClass}
                        value={item.unitCost}
                        onChange={(e) =>
                          patchItem(item.key, { unitCost: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <DirectionBox
                          tone="in"
                          label="In"
                          checked={item.moneyInOn}
                          onChange={() => toggleSide(item.key, "in")}
                        />
                        <DirectionBox
                          tone="out"
                          label="Out"
                          checked={item.moneyOutOn}
                          onChange={() => toggleSide(item.key, "out")}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {item.moneyInOn || item.moneyOutOn ? (
                        <span
                          className={`font-semibold ${
                            item.moneyInOn ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {/* Nothing has a direction until it is above zero —
                              an untouched row reading "−0.00" looks like a
                              figure someone entered. */}
                          {isPositive(lineTotal(item))
                            ? item.moneyInOn
                              ? "+"
                              : "−"
                            : ""}
                          {formatMoney(lineTotal(item), "")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Tick In or Out
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        disabled={items.length === 1}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-30"
                        aria-label={`Remove item ${i + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <dl className="grid w-full max-w-lg grid-cols-3 gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <div>
              <dt className="text-xs text-muted-foreground">Total Money In</dt>
              <dd className="mt-0.5 font-bold text-emerald-600">
                {formatMoney(totals.moneyIn, currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total Money Out</dt>
              <dd className="mt-0.5 font-bold text-red-600">
                {formatMoney(totals.moneyOut, currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Net Amount</dt>
              <dd className="mt-0.5 font-bold">
                {formatMoney(totals.net, currency)}
              </dd>
            </div>
          </dl>
        </div>

        <label className="mt-5 block text-xs font-semibold text-muted-foreground">
          Notes <span className="font-normal">(optional)</span>
          <textarea
            rows={3}
            className={`${fieldClass} mt-1 resize-y`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Invoice
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * The In/Out tick. `indeterminate` is only passed by the master control, where
 * it means "some rows, not all" — the row-level boxes are plainly on or off.
 */
function DirectionBox({
  tone,
  label,
  checked,
  indeterminate = false,
  onChange,
}: {
  tone: "in" | "out";
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  // Not expressible in JSX — the DOM property has no matching HTML attribute.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  const activeTone =
    tone === "in"
      ? "text-emerald-700 dark:text-emerald-400"
      : "text-red-700 dark:text-red-400";

  return (
    <label
      className={`inline-flex cursor-pointer select-none items-center gap-1.5 text-xs font-semibold ${
        checked ? activeTone : "text-muted-foreground"
      }`}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 cursor-pointer rounded border-border ${
          tone === "in" ? "accent-emerald-600" : "accent-red-600"
        }`}
      />
      {label}
    </label>
  );
}
