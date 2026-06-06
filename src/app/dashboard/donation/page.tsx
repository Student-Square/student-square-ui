"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetMyDonationsQuery } from "@/redux/features/donations/donationsApi";
import type { ApiDonation, DonationStatus } from "@/types/donations";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const PAGE_SIZE = 10;

const statusStyle: Record<DonationStatus, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-muted text-muted-foreground",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function DonationPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyDonationsQuery({ page, limit: PAGE_SIZE });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Donations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your giving history and receipts.</p>
        </div>
        <Link
          href="/donate"
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Heart className="h-4 w-4" /> Donate
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-emerald-500/70" />
          <h2 className="mt-3 text-lg font-bold text-foreground">No donations yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">When you give, your receipts show up here.</p>
          <Link href="/donate" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Make your first donation
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Supports</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d: ApiDonation) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {fmtDate(d.paidAt ?? d.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {d.campaign?.title ?? d.purpose ?? "General Fund"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                      {d.currency} {d.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyle[d.status]}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {d.status === "PAID" ? (
                        <a
                          href={`${API_BASE}/donations/invoice?token=${encodeURIComponent(d.accessToken)}`}
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-xs"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
