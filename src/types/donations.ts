export type DonationKind = "PROJECT" | "OTHER";
export type DonationMethod =
  | "SSLCOMMERZ"
  | "BANK_TRANSFER"
  | "MOBILE_BANKING"
  | "MANUAL";
export type DonationStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

/** Body sent to POST /donations (public donate form). */
export type CreateDonationBody = {
  amount: string;
  currency?: string;
  kind: DonationKind;
  campaignId?: string;
  purpose?: string;
  method: "SSLCOMMERZ";
  /** Optional when `isAnonymous` — server stores placeholders for the gateway. */
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous?: boolean;
  message?: string;
};

/** Response from POST /donations. */
export type CreateDonationResult = {
  embedScriptUrl: string;
  embedEndpoint: string;
  isSandbox: boolean;
  donation: {
    id: string;
    receiptNo: string;
    tranId: string;
    amount: string;
    currency: string;
    method: DonationMethod;
    status: DonationStatus;
    accessToken: string;
  };
};

/** A donation row in the member dashboard history. */
export type ApiDonation = {
  id: string;
  receiptNo: string;
  donorName: string;
  isAnonymous: boolean;
  kind: DonationKind;
  campaignId: string | null;
  purpose: string | null;
  amount: string;
  currency: string;
  method: DonationMethod;
  status: DonationStatus;
  invoiceUrl: string | null;
  accessToken: string;
  paidAt: string | null;
  createdAt: string;
  campaign: { title: string; slug: string } | null;
};

/** Admin-visible donation row (adds donor contact + pledge reference). */
export type AdminDonation = ApiDonation & {
  donorEmail: string;
  donorPhone: string | null;
  pledgeReference: string | null;
};

export type DonationSummaryBucket = { total: number; count: number };

export type DonationSummary = {
  totals: {
    today: DonationSummaryBucket;
    week: DonationSummaryBucket;
    month: DonationSummaryBucket;
    year: DonationSummaryBucket;
    allTime: DonationSummaryBucket;
  };
  range: DonationSummaryBucket | null;
  perProject: {
    campaignId: string | null;
    title: string;
    total: number;
    count: number;
    goalAmount: number | null;
    raisedAmount: number;
  }[];
  perMethod: { method: DonationMethod; total: number; count: number }[];
};

export type ManualDonationBody = {
  amount: string;
  currency?: string;
  kind: DonationKind;
  campaignId?: string;
  purpose?: string;
  method?: DonationMethod;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous?: boolean;
  pledgeReference?: string;
  donatedAt?: string;
  sendReceiptEmail?: boolean;
};

/** Public/anonymous receipt lookup (GET /donations/lookup?token=). */
export type DonationReceipt = {
  id: string;
  receiptNo: string;
  donorName: string;
  isAnonymous: boolean;
  kind: DonationKind;
  purpose: string | null;
  amount: string;
  currency: string;
  method: DonationMethod;
  status: DonationStatus;
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  campaign: { title: string; slug: string } | null;
};

export type Paginated<T> = {
  meta: { total: number; page: number; limit: number };
  data: T[];
};

/** Result of re-checking one online donation against the gateway. */
export type VerifyResult = {
  donation: AdminDonation;
  paid: boolean;
  status: DonationStatus | string;
};

export type StatusBucket = { count: number; total: number };

/** Per-project (campaign) donation analytics. */
export type ProjectDonationStats = {
  campaign: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    goalAmount: number | null;
    raisedAmount: number;
    currency: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
  };
  stats: {
    paidTotal: number;
    paidCount: number;
    donorCount: number;
    avgDonation: number;
    largestDonation: number;
    goalProgress: number | null;
    pending: StatusBucket;
    failed: StatusBucket;
    cancelled: StatusBucket;
    refunded: StatusBucket;
  };
  perMethod: { method: DonationMethod; total: number; count: number }[];
  topDonors: { email: string; name: string; total: number; count: number }[];
  recent: AdminDonation[];
  trend: { date: string; total: number; count: number }[];
};

/** Payment-attempt funnel (how many started vs completed vs dropped/failed). */
export type AttemptsSummary = {
  started: number;
  completed: StatusBucket;
  pending: StatusBucket;
  failed: StatusBucket;
  cancelled: StatusBucket;
  refunded: StatusBucket;
  conversion: number;
};

/* ── Donation report (/admin/reports/donations) ───────────────────────────── */

export type ReportGranularity = "daily" | "weekly" | "monthly" | "yearly";

/** Blocks the exported document can carry; empty means all of them. */
export type ReportSection = "summary" | "period" | "project" | "status";

export type DonationReportFilters = {
  from: string;
  to: string;
  granularity: ReportGranularity;
  /** A campaign id, or "OTHER" for gifts not tied to a project. */
  campaignId?: string;
  /** Comma-separated statuses; empty means every status. */
  status?: string;
  /** Comma-separated sections for the export; empty means the whole report. */
  sections?: string;
};

/**
 * Every amount here is a fixed-scale **string** (FR-13-009) — format it with
 * `lib/money.ts` and never call Number() on one. The older DonationSummary
 * above still carries numbers; this endpoint does not.
 */
export type DonationReport = {
  range: {
    from: string;
    to: string;
    granularity: ReportGranularity;
    campaignId: string | null;
    statuses: string[];
  };
  currency: string;
  totals: { total: string; count: number; average: string; donors: number };
  /** Gifts in any currency other than the base one, never added into the totals. */
  otherCurrencies: { currency: string; count: number; total: string }[];
  byPeriod: { period: string; label: string; count: number; total: string }[];
  byProject: {
    campaignId: string | null;
    title: string;
    count: number;
    total: string;
    goalAmount: string | null;
    raisedAmount: string | null;
  }[];
  /** Always every status for the range — it is what the status filter hides. */
  byStatus: { status: DonationStatus; count: number; total: string }[];
};
