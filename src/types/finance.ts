import type { UserRole } from "./auth";

export type FinanceCurrency = "BDT" | "USD" | "GBP";

/**
 * Every amount is a **string** — FR-13-009.
 *
 * The API serialises Decimals as fixed-scale strings so nothing loses
 * precision crossing JSON. Format them with `lib/money.ts`; never call
 * `Number()` on one.
 */
export type FinanceEntry = {
  id: string;
  slNo: number;
  entryDate: string;
  itemName: string;
  quantity: string;
  unitCost: string;
  currency: FinanceCurrency | string;
  moneyIn: string;
  moneyOut: string;
  balance: string;
  panelScope: UserRole;
  /** Set when the period containing this row has been closed. */
  lockedAt: string | null;
  invoiceId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    memberId: string | null;
    email: string;
  };
};

export type FinanceEntryInput = {
  entryDate: string;
  itemName: string;
  quantity: string;
  unitCost: string;
  currency: FinanceCurrency;
  moneyIn: string;
  moneyOut: string;
};

export type PaginatedFinance = {
  data: FinanceEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  closedPeriods?: number;
  totals?: { moneyIn: string; moneyOut: string; net: string };
};

export type FinancePeriodClose = {
  id: string;
  userId: string;
  fromDate: string;
  toDate: string;
  closedAt: string;
  closedById: string | null;
  entryCount: number;
  closingBalance: string;
  note: string | null;
};

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "VOID";

export type Invoice = {
  id: string;
  number: string;
  userId: string;
  issuedAt: string;
  dueAt: string | null;
  status: InvoiceStatus;
  currency: string;
  subtotal: string;
  total: string;
  billToName: string | null;
  billToAddress: string | null;
  notes: string | null;
  entries: FinanceEntry[];
  user: { id: string; fullName: string; memberId: string | null; email: string };
};

export type BooksSummary = {
  panels: {
    panelScope: UserRole;
    financeEntries: number;
    operationEntries: number;
    moneyIn: string;
    moneyOut: string;
    net: string;
  }[];
  totals: {
    financeEntries: number;
    operationEntries: number;
    moneyIn: string;
    moneyOut: string;
    net: string;
  };
  topContributors: {
    user: { id: string; fullName: string; memberId: string | null; role: UserRole } | null;
    entries: number;
    moneyOut: string;
  }[];
  invoices: { status: InvoiceStatus; count: number; total: string }[];
};

export type ExportFormat = "csv" | "xlsx" | "pdf";
