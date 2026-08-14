"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Activity,
  Loader2,
  Search,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users2,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
} from "lucide-react";
import {
  useGetAttemptsSummaryQuery,
  useGetAdminDonationsQuery,
  useVerifyDonationMutation,
} from "@/redux/features/donations/adminDonationsApi";
import { useGetAdminCampaignsQuery } from "@/redux/features/campaigns/adminCampaignsApi";
import type { AdminDonation, DonationStatus } from "@/types/donations";

const PAGE_SIZE = 15;
const ALL_ATTEMPTS = "PENDING,FAILED,CANCELLED";
const bdt = (n: number) => `৳${n.toLocaleString()}`;
const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const statusStyle: Record<DonationStatus, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-muted text-muted-foreground",
};

export default function PaymentAttemptsPage() {
  const [campaignId, setCampaignId] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_ATTEMPTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data: campaignsData } = useGetAdminCampaignsQuery({ status: "" });
  const campaigns = campaignsData?.data ?? [];

  const { data: summary } = useGetAttemptsSummaryQuery(
    { campaignId: campaignId || undefined },
    { pollingInterval: 30_000 },
  );

  const { data, isFetching } = useGetAdminDonationsQuery(
    {
      page,
      limit: PAGE_SIZE,
      status: statusFilter,
      campaignId: campaignId || undefined,
      searchTerm: searchTerm || undefined,
    },
    { pollingInterval: 30_000 },
  );
  const [verifyDonation] = useVerifyDonationMutation();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await verifyDonation(id).unwrap();
      if (res.paid) toast.success("Gateway confirmed payment — marked paid");
      else toast.info(`Still not completed at the gateway (status: ${res.status})`);
    } catch {
      toast.error("Could not verify with the gateway");
    } finally { setVerifyingId(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl 2xl:max-w-none">
      <Link href="/admin/donation" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to donations
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
          <Activity className="h-6 w-6 text-amber-600" /> Payment attempts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone who started a payment — including those who never completed or whose payment failed. Filter by project to see where donors drop off.
        </p>
      </div>

      {/* Funnel summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <FunnelCard icon={<Users2 className="h-4 w-4 text-sky-600" />} label="Started" value={String(summary?.started ?? 0)} sub="attempts" />
        <FunnelCard
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          label="Completed"
          value={String(summary?.completed.count ?? 0)}
          sub={`${summary?.conversion ?? 0}% conversion`}
        />
        <FunnelCard icon={<Clock className="h-4 w-4 text-amber-600" />} label="Pending" value={String(summary?.pending.count ?? 0)} sub={bdt(summary?.pending.total ?? 0)} />
        <FunnelCard icon={<XCircle className="h-4 w-4 text-red-600" />} label="Failed" value={String(summary?.failed.count ?? 0)} sub={bdt(summary?.failed.total ?? 0)} />
        <FunnelCard icon={<Ban className="h-4 w-4 text-muted-foreground" />} label="Cancelled" value={String(summary?.cancelled.count ?? 0)} sub={bdt(summary?.cancelled.total ?? 0)} />
      </div>

      {/* Conversion bar */}
      {summary && summary.started > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Conversion (completed ÷ started)</span>
            <span className="font-semibold text-foreground">{summary.conversion}%</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500" style={{ width: `${(summary.completed.count / summary.started) * 100}%` }} title={`Completed ${summary.completed.count}`} />
            <div className="h-full bg-amber-400" style={{ width: `${(summary.pending.count / summary.started) * 100}%` }} title={`Pending ${summary.pending.count}`} />
            <div className="h-full bg-red-400" style={{ width: `${(summary.failed.count / summary.started) * 100}%` }} title={`Failed ${summary.failed.count}`} />
            <div className="h-full bg-muted-foreground/40" style={{ width: `${(summary.cancelled.count / summary.started) * 100}%` }} title={`Cancelled ${summary.cancelled.count}`} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search name, email, receipt…"
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select value={campaignId} onChange={(e) => { setCampaignId(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">All projects</option>
          {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value={ALL_ATTEMPTS}>All attempts</option>
          <option value="PENDING">Pending (not completed)</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Started</th>
                <th className="px-4 py-3 font-semibold">Donor</th>
                <th className="px-4 py-3 font-semibold">Supports</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No attempts match.</td></tr>
              )}
              {rows.map((d: AdminDonation) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDateTime(d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                    <p className="text-[11px] text-muted-foreground">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{d.campaign?.title ?? d.purpose ?? "General"}</td>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{d.currency} {d.amount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.method}</td>
                  <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[d.status]}`}>{d.status}</span></td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {d.status === "PENDING" && d.method === "SSLCOMMERZ" && (
                      <button onClick={() => onVerify(d.id)} disabled={verifyingId === d.id} className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
                        {verifyingId === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />} Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            {isFetching && <Loader2 className="h-3 w-3 animate-spin" />} {total} total · page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{icon} {label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
