"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { toast } from "sonner";
import {
  HandCoins,
  Plus,
  Download,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Power,
  PowerOff,
  X,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Activity,
  MoreVertical,
} from "lucide-react";
import {
  useGetAdminDonationsQuery,
  useGetDonationSummaryQuery,
  useCreateManualDonationMutation,
  useConfirmDonationMutation,
  useVerifyDonationMutation,
  useRefundDonationMutation,
  useReconcileDonationsMutation,
} from "@/redux/features/donations/adminDonationsApi";
import {
  useGetAdminCampaignsQuery,
  useActivateCampaignMutation,
  usePauseCampaignMutation,
  useUpdateCampaignScheduleMutation,
} from "@/redux/features/campaigns/adminCampaignsApi";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import type {
  AdminDonation,
  DonationStatus,
  ManualDonationBody,
} from "@/types/donations";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const PAGE_SIZE = 12;

const bdt = (n: number) => `৳${n.toLocaleString()}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Methods an admin may confirm by hand (money received off-platform).
const OFFLINE_METHODS = new Set(["BANK_TRANSFER", "MOBILE_BANKING", "MANUAL"]);

const statusStyle: Record<DonationStatus, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-muted text-muted-foreground",
};

export default function AdminDonationPage() {
  const [tab, setTab] = useState<"donations" | "projects">("donations");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl 2xl:max-w-none">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <HandCoins className="h-6 w-6 text-emerald-600" /> Donations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track giving, confirm offline pledges, record manual gifts, and manage projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/donation/attempts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Activity className="h-4 w-4 text-amber-600" /> Payment attempts
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Record donation
          </button>
        </div>
      </div>

      <SummaryCards />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted/50 border border-border p-1 w-fit">
        {(["donations", "projects"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "donations" ? <DonationsTab /> : <ProjectsTab />}

      {showModal && <ManualEntryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ── Summary ── */
function SummaryCards() {
  const { data, isLoading } = useGetDonationSummaryQuery();
  const cards = [
    { label: "Today", v: data?.totals.today },
    { label: "This week", v: data?.totals.week },
    { label: "This month", v: data?.totals.month },
    { label: "This year", v: data?.totals.year },
    { label: "All time", v: data?.totals.allTime },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {isLoading ? "—" : bdt(c.v?.total ?? 0)}
            </p>
            <p className="text-[11px] text-muted-foreground">{c.v?.count ?? 0} donations</p>
          </div>
        ))}
      </div>

      {data && data.perProject.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">By project — raised vs goal</p>
          <div className="space-y-2.5">
            {(() => {
              const maxRaised = Math.max(1, ...data.perProject.map((x) => x.raisedAmount));
              return data.perProject.map((p) => {
                const hasGoal = p.goalAmount != null && p.goalAmount > 0;
                const pct = hasGoal ? Math.min(100, Math.round((p.raisedAmount / (p.goalAmount as number)) * 100)) : null;
                const barWidth = hasGoal ? pct! : (p.raisedAmount / maxRaised) * 100;
                return (
                  <div key={p.campaignId ?? "other"} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-sm text-foreground" title={p.title}>{p.title}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${hasGoal && pct === 100 ? "bg-emerald-600" : "bg-emerald-500"}`} style={{ width: `${barWidth}%` }} />
                    </div>
                    <span className="w-40 shrink-0 text-right text-xs whitespace-nowrap">
                      <span className="font-semibold text-foreground">{bdt(p.raisedAmount)}</span>
                      {hasGoal && <span className="text-muted-foreground"> / {bdt(p.goalAmount as number)}</span>}
                    </span>
                    <span className="w-12 shrink-0 text-right text-xs font-semibold text-emerald-600">{hasGoal ? `${pct}%` : "—"}</span>
                    <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">{p.count}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Donations table ── */
function DonationsTab() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [pendingConfirm, setPendingConfirm] = useState<AdminDonation | null>(null);

  const { data: campaignsData } = useGetAdminCampaignsQuery({ status: "" });
  const campaigns = campaignsData?.data ?? [];

  const { data, isFetching } = useGetAdminDonationsQuery(
    {
      page,
      limit: PAGE_SIZE,
      searchTerm: searchTerm || undefined,
      status: status || undefined,
      method: method || undefined,
      campaignId: campaignId || undefined,
    },
    { pollingInterval: 30_000 }, // live-refresh the list every 30s
  );
  const [confirmDonation, { isLoading: confirming }] = useConfirmDonationMutation();
  const [verifyDonation] = useVerifyDonationMutation();
  const [refundDonation, { isLoading: refunding }] = useRefundDonationMutation();
  const [reconcile, { isLoading: reconciling }] = useReconcileDonationsMutation();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const doConfirm = async (id: string) => {
    try { await confirmDonation(id).unwrap(); toast.success("Donation confirmed & receipt sent"); }
    catch {} finally { setPendingConfirm(null); }
  };
  const onVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await verifyDonation(id).unwrap();
      if (res.paid) toast.success("Gateway confirmed payment — marked paid & receipt sent");
      else toast.info(`No completed payment at the gateway yet (status: ${res.status})`);
    } catch {
      toast.error("Could not verify with the gateway");
    } finally { setVerifyingId(null); }
  };
  const onRefund = async (id: string) => {
    try { await refundDonation(id).unwrap(); toast.success("Donation refunded"); } catch {}
  };

  /**
   * FR-14-008 — re-check every pending donation with SSLCommerz now.
   *
   * The server sweep runs every 15 minutes anyway; this is for when a donor is
   * on the phone and nobody wants to wait for the next one.
   */
  const onReconcileNow = async () => {
    try {
      const res = await reconcile().unwrap();
      toast.success(`Checked ${res.checked} pending — ${res.paid} now paid`);
    } catch {
      /* baseApi already toasts the failure */
    }
  };

  /** CSV, XLSX or PDF — the same ledger, one route per format. */
  const downloadLedger = async (format: "csv" | "xlsx" | "pdf" = "csv") => {
    try {
      const res = await fetch(`${API_BASE}/admin/donations/export.${format}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `donations.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  const downloadCsv = () => downloadLedger("csv");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
        <span className="text-muted-foreground">
          The server re-checks pending SSLCommerz payments every 15 minutes.
        </span>
        <span className="flex items-center gap-1.5">
          <button
            onClick={onReconcileNow}
            disabled={reconciling}
            title="Re-check every pending donation with the gateway now"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-semibold hover:bg-muted transition-colors disabled:opacity-50"
          >
            {reconciling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
            Check pending now
          </button>
          <button
            onClick={() => downloadLedger("xlsx")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-semibold hover:bg-muted transition-colors"
          >
            Excel
          </button>
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search name, email, receipt…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-card border border-border focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select value={campaignId} onChange={(e) => { setCampaignId(e.target.value); setPage(1); }} className="rounded-lg bg-card border border-border px-3 py-2 text-sm">
          <option value="">All projects</option>
          {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg bg-card border border-border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {["PAID", "PENDING", "FAILED", "CANCELLED", "REFUNDED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className="rounded-lg bg-card border border-border px-3 py-2 text-sm">
          <option value="">All methods</option>
          {["SSLCOMMERZ", "BANK_TRANSFER", "MOBILE_BANKING", "MANUAL"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button onClick={downloadCsv} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> CSV
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Donor</th>
                <th className="px-4 py-3 font-semibold">Supports</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No donations match.</td></tr>
              )}
              {rows.map((d: AdminDonation) => {
                const isOffline = OFFLINE_METHODS.has(d.method);
                return (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(d.paidAt ?? d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                    <p className="text-[11px] text-muted-foreground">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{d.campaign?.title ?? d.purpose ?? "General"}</td>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{d.currency} {d.amount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Strict: offline pledges → manual confirm (with guard); online → gateway verify only */}
                      {d.status === "PENDING" && isOffline && (
                        <button onClick={() => setPendingConfirm(d)} disabled={confirming} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50" title="Confirm money received off-platform">
                          <CheckCircle2 className="h-3 w-3" /> Confirm received
                        </button>
                      )}
                      {d.status === "PENDING" && !isOffline && (
                        <button onClick={() => onVerify(d.id)} disabled={verifyingId === d.id} className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" title="Re-check the real payment with SSLCommerz">
                          {verifyingId === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />} Verify with gateway
                        </button>
                      )}
                      {d.status === "PAID" && (
                        <RowActionsMenu
                          invoiceHref={`${API_BASE}/donations/invoice?token=${encodeURIComponent(d.accessToken)}`}
                          onRefund={() => onRefund(d.id)}
                          refunding={refunding}
                        />
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            {isFetching && <Loader2 className="h-3 w-3 animate-spin" />} {total} total · page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {pendingConfirm && (
        <ConfirmReceivedDialog
          donation={pendingConfirm}
          loading={confirming}
          onCancel={() => setPendingConfirm(null)}
          onConfirm={() => doConfirm(pendingConfirm.id)}
        />
      )}
    </div>
  );
}

/* ── Offline-pledge confirmation guard ── */
function ConfirmReceivedDialog({
  donation,
  loading,
  onCancel,
  onConfirm,
}: {
  donation: AdminDonation;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Confirm payment received?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only do this if you have verified the funds actually arrived. This marks the donation
              <span className="font-semibold text-foreground"> PAID</span>, counts it toward the project total, and emails a receipt.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-muted-foreground">Donor</span><span className="font-medium text-foreground">{donation.isAnonymous ? "Anonymous" : donation.donorName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Supports</span><span className="font-medium text-foreground">{donation.campaign?.title ?? donation.purpose ?? "General"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium text-foreground">{donation.method}</span></div>
          {donation.pledgeReference && <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono text-foreground">{donation.pledgeReference}</span></div>}
          <div className="flex justify-between border-t border-border pt-1.5"><span className="text-muted-foreground">Amount</span><span className="text-base font-bold text-foreground">{donation.currency} {donation.amount}</span></div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Yes, mark paid
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Row actions kebab (download invoice / refund) ── */
function RowActionsMenu({ invoiceHref, onRefund, refunding }: { invoiceHref: string; onRefund: () => void; refunding: boolean }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  const toggle = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    setOpen((o) => !o);
  };

  const itemCls = "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-muted";

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        title="Actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 60 }}
          className="w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
          role="menu"
        >
          <a href={invoiceHref} onClick={() => setOpen(false)} className={`${itemCls} text-foreground`} role="menuitem">
            <Download className="h-4 w-4 text-emerald-600" /> Download invoice
          </a>
          <button
            type="button"
            disabled={refunding}
            onClick={() => { setOpen(false); onRefund(); }}
            className={`${itemCls} text-red-600 disabled:opacity-50`}
            role="menuitem"
          >
            <RotateCcw className="h-4 w-4" /> Refund
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ── Projects (campaign) management ── */
function ProjectsTab() {
  const { data, isLoading } = useGetAdminCampaignsQuery({ status: "" });
  const [activate] = useActivateCampaignMutation();
  const [pause] = usePauseCampaignMutation();
  const [updateSchedule, { isLoading: saving }] = useUpdateCampaignScheduleMutation();
  const campaigns = data?.data ?? [];

  const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

  const onToggle = async (id: string, active: boolean) => {
    try {
      if (active) { await pause(id).unwrap(); toast.success("Project deactivated"); }
      else { await activate(id).unwrap(); toast.success("Project activated"); }
    } catch {}
  };
  const onDates = async (id: string, startDate: string, endDate: string) => {
    try {
      await updateSchedule({ id, startDate: startDate || null, endDate: endDate || null }).unwrap();
      toast.success("Schedule updated");
    } catch {}
  };

  if (isLoading) return <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading projects…</div>;

  return (
    <div className="space-y-3">
      {campaigns.map((c) => {
        const active = c.status === "ACTIVE";
        return (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">{c.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">Raised {bdt(Number(c.raisedAmount))}{c.goalAmount ? ` of ${bdt(Number(c.goalAmount))}` : ""}</p>
            </div>
            <ScheduleEditor
              start={toDateInput(c.startDate)}
              end={toDateInput(c.endDate)}
              saving={saving}
              onSave={(s, e) => onDates(c.id, s, e)}
            />
            <Link
              href={`/admin/donation/project/${c.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <ExternalLink className="h-4 w-4 text-emerald-600" /> View details
            </Link>
            <button
              onClick={() => onToggle(c.id, active)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors shrink-0 ${active ? "border border-border text-muted-foreground hover:text-red-600 hover:border-red-300" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
            >
              {active ? <><PowerOff className="h-4 w-4" /> Deactivate</> : <><Power className="h-4 w-4" /> Activate</>}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ScheduleEditor({ start, end, saving, onSave }: { start: string; end: string; saving: boolean; onSave: (s: string, e: string) => void }) {
  const [s, setS] = useState(start);
  const [e, setE] = useState(end);
  const dirty = s !== start || e !== end;
  return (
    <div className="flex items-end gap-2">
      <label className="text-[11px] text-muted-foreground">Start
        <input type="date" value={s} onChange={(ev) => setS(ev.target.value)} className="block mt-0.5 rounded-md border border-border bg-background px-2 py-1 text-xs" />
      </label>
      <label className="text-[11px] text-muted-foreground">End
        <input type="date" value={e} onChange={(ev) => setE(ev.target.value)} className="block mt-0.5 rounded-md border border-border bg-background px-2 py-1 text-xs" />
      </label>
      {dirty && (
        <button onClick={() => onSave(s, e)} disabled={saving} className="rounded-md bg-emerald-600 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">Save</button>
      )}
    </div>
  );
}

/* ── Manual entry modal ── */
function ManualEntryModal({ onClose }: { onClose: () => void }) {
  const { data: campaigns } = useGetCampaignsQuery({ status: "ACTIVE" });
  const [create, { isLoading }] = useCreateManualDonationMutation();

  const [kind, setKind] = useState<"PROJECT" | "OTHER">("PROJECT");
  const [campaignId, setCampaignId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [method, setMethod] = useState<ManualDonationBody["method"]>("MANUAL");
  const [pledgeReference, setPledgeReference] = useState("");
  const [donatedAt, setDonatedAt] = useState("");
  const [sendReceiptEmail, setSendReceiptEmail] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kind === "PROJECT" && !campaignId) return toast.error("Choose a project");
    if (kind === "OTHER" && !purpose.trim()) return toast.error("Enter a purpose");
    if (!amount || Number(amount) <= 0) return toast.error("Enter an amount");
    if (!donorName.trim() || !donorEmail.trim()) return toast.error("Donor name and email are required");

    const body: ManualDonationBody = {
      amount: String(amount),
      kind,
      campaignId: kind === "PROJECT" ? campaignId : undefined,
      purpose: kind === "OTHER" ? purpose.trim() : undefined,
      method,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      donorPhone: donorPhone.trim() || undefined,
      pledgeReference: pledgeReference.trim() || undefined,
      donatedAt: donatedAt || undefined,
      sendReceiptEmail,
    };
    try {
      await create(body).unwrap();
      toast.success("Donation recorded");
      onClose();
    } catch {}
  };

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Record a donation</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted/50 border border-border p-1">
          {(["PROJECT", "OTHER"] as const).map((k) => (
            <button type="button" key={k} onClick={() => setKind(k)} className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${kind === k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              {k === "PROJECT" ? "Project" : "Other (Zakat/Sadakah)"}
            </button>
          ))}
        </div>

        {kind === "PROJECT" ? (
          <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className={inputCls}>
            <option value="" disabled>Choose a project…</option>
            {campaigns?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        ) : (
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Purpose (e.g. Zakat)" className={inputCls} />
        )}

        <div className="grid grid-cols-2 gap-3">
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (BDT)" className={inputCls} />
          <select value={method} onChange={(e) => setMethod(e.target.value as ManualDonationBody["method"])} className={inputCls}>
            {["MANUAL", "BANK_TRANSFER", "MOBILE_BANKING", "SSLCOMMERZ"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Donor name" className={inputCls} />
          <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="Donor email" className={inputCls} />
          <input value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="Phone (optional)" className={inputCls} />
          <input value={pledgeReference} onChange={(e) => setPledgeReference(e.target.value)} placeholder="Reference (optional)" className={inputCls} />
          <label className="text-[11px] text-muted-foreground col-span-2">Donation date (optional)
            <input type="date" value={donatedAt} onChange={(e) => setDonatedAt(e.target.value)} className={`${inputCls} mt-0.5`} />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={sendReceiptEmail} onChange={(e) => setSendReceiptEmail(e.target.checked)} className="h-4 w-4 rounded border-border accent-emerald-600" />
          Email a PDF receipt to the donor
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Record
          </button>
        </div>
      </form>
    </div>
  );
}
