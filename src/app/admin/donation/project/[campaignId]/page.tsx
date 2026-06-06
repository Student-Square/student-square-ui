"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Users,
  HandCoins,
  TrendingUp,
  Award,
  Clock,
  XCircle,
  Ban,
  RotateCcw,
  Target,
} from "lucide-react";
import { useGetProjectStatsQuery } from "@/redux/features/donations/adminDonationsApi";
import type { DonationStatus } from "@/types/donations";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const bdt = (n: number) => `৳${n.toLocaleString()}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const statusStyle: Record<DonationStatus, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-muted text-muted-foreground",
};

export default function ProjectDonationDetailsPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;
  const { data, isLoading, isError } = useGetProjectStatsQuery(campaignId, { pollingInterval: 60_000 });

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading project…
      </div>
    );
  if (isError || !data)
    return (
      <div className="max-w-3xl space-y-4">
        <BackLink />
        <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Project not found.</p>
      </div>
    );

  const { campaign, stats, perMethod, topDonors, recent, trend } = data;
  const trendMax = Math.max(1, ...trend.map((t) => t.total));
  const methodMax = Math.max(1, ...perMethod.map((m) => m.total));

  return (
    <div className="space-y-6 max-w-6xl">
      <BackLink />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{campaign.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{campaign.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className={`rounded-full px-2 py-0.5 font-bold ${campaign.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
              {campaign.status}
            </span>
            {campaign.startDate && <span>Opens {fmtDate(campaign.startDate)}</span>}
            {campaign.endDate && <span>· Closes {fmtDate(campaign.endDate)}</span>}
          </div>
        </div>
        <Link
          href="/admin/donation/attempts"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <Clock className="h-4 w-4 text-amber-600" /> See payment attempts
        </Link>
      </div>

      {/* Goal progress */}
      {campaign.goalAmount ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Goal progress</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{bdt(stats.paidTotal)} <span className="text-base font-medium text-muted-foreground">of {bdt(campaign.goalAmount)}</span></p>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{stats.goalProgress ?? 0}%</span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${stats.goalProgress ?? 0}%` }} />
          </div>
        </div>
      ) : null}

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<HandCoins className="h-4 w-4" />} label="Raised (paid)" value={bdt(stats.paidTotal)} sub={`${stats.paidCount} donations`} accent="emerald" />
        <StatCard icon={<Users className="h-4 w-4" />} label="Unique donors" value={String(stats.donorCount)} sub="distinct emails" accent="sky" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Average gift" value={bdt(stats.avgDonation)} sub="per paid donation" accent="violet" />
        <StatCard icon={<Award className="h-4 w-4" />} label="Largest gift" value={bdt(stats.largestDonation)} sub="single donation" accent="amber" />
      </div>

      {/* Secondary (non-completed) stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat icon={<Clock className="h-3.5 w-3.5 text-amber-600" />} label="Pending" count={stats.pending.count} total={stats.pending.total} />
        <MiniStat icon={<XCircle className="h-3.5 w-3.5 text-red-600" />} label="Failed" count={stats.failed.count} total={stats.failed.total} />
        <MiniStat icon={<Ban className="h-3.5 w-3.5 text-muted-foreground" />} label="Cancelled" count={stats.cancelled.count} total={stats.cancelled.total} />
        <MiniStat icon={<RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />} label="Refunded" count={stats.refunded.count} total={stats.refunded.total} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 14-day trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last 14 days (paid)</p>
          <div className="mt-4 flex h-32 items-end gap-1">
            {trend.map((t) => (
              <div key={t.date} className="group relative flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-emerald-500/80 transition-all hover:bg-emerald-500"
                  style={{ height: `${Math.max(2, (t.total / trendMax) * 100)}%` }}
                  title={`${dayLabel(t.date)}: ${bdt(t.total)} (${t.count})`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{trend[0] && dayLabel(trend[0].date)}</span>
            <span>{trend[trend.length - 1] && dayLabel(trend[trend.length - 1].date)}</span>
          </div>
        </div>

        {/* Per-method breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">By payment method (paid)</p>
          <div className="mt-4 space-y-3">
            {perMethod.length === 0 && <p className="text-sm text-muted-foreground">No paid donations yet.</p>}
            {perMethod.map((m) => (
              <div key={m.method} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-xs font-medium text-foreground">{m.method}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-emerald-500" style={{ width: `${(m.total / methodMax) * 100}%` }} />
                </div>
                <span className="w-24 shrink-0 text-right text-sm font-semibold text-foreground">{bdt(m.total)}</span>
                <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">{m.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top donors */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top donors</p>
        <div className="mt-3 space-y-1">
          {topDonors.length === 0 && <p className="text-sm text-muted-foreground">No donors yet.</p>}
          {topDonors.map((t, i) => (
            <div key={t.email} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/30">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{t.email}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-foreground">{bdt(t.total)}</span>
              <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">{t.count} gift{t.count !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent donations */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <p className="border-b border-border px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent activity</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Donor</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No donations yet.</td></tr>
              )}
              {recent.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(d.paidAt ?? d.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                    <p className="text-[11px] text-muted-foreground">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{d.currency} {d.amount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.method}</td>
                  <td className="px-4 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[d.status]}`}>{d.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    {d.status === "PAID" && (
                      <a href={`${API_BASE}/donations/invoice?token=${encodeURIComponent(d.accessToken)}`} className="text-emerald-600 hover:text-emerald-700 inline-flex justify-end">
                        Receipt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/admin/donation" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back to donations
    </Link>
  );
}

const accentMap: Record<string, string> = {
  emerald: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  sky: "text-sky-600 bg-sky-100 dark:bg-sky-900/30",
  violet: "text-violet-600 bg-violet-100 dark:bg-violet-900/30",
  amber: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
};

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentMap[accent]}`}>{icon}</span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function MiniStat({ icon, label, count, total }: { icon: React.ReactNode; label: string; count: number; total: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{icon} {label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{count}</p>
      <p className="text-[11px] text-muted-foreground">{bdt(total)}</p>
    </div>
  );
}
