"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { useLookupDonationQuery } from "@/redux/features/donations/donationsApi";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const statusColor: Record<string, string> = {
  PAID: "text-emerald-600",
  PENDING: "text-amber-600",
  FAILED: "text-red-600",
  CANCELLED: "text-muted-foreground",
  REFUNDED: "text-muted-foreground",
};

function ReceiptView() {
  const token = useSearchParams().get("token") ?? "";
  const { data, isLoading, isError } = useLookupDonationQuery(token, {
    skip: !token,
  });

  if (!token) return <Message text="No receipt token provided." />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading receipt…
      </div>
    );
  if (isError || !data) return <Message text="Receipt not found." />;

  const target = data.campaign?.title ?? data.purpose ?? "General Fund";
  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );

  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Donation Receipt</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{data.receiptNo}</p>
      </div>
      <div className="mt-6">
        {row("Donor", data.isAnonymous ? "Anonymous" : data.donorName)}
        {row("Supports", target)}
        {row("Amount", `${data.currency} ${data.amount}`)}
        {row("Status", <span className={statusColor[data.status] ?? ""}>{data.status}</span>)}
        {row("Date", new Date(data.paidAt ?? data.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }))}
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {data.status === "PAID" ? (
          <a
            href={`${API_BASE}/donations/invoice?token=${encodeURIComponent(token)}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4" /> Download PDF invoice
          </a>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-1">
            Your invoice will be available here once payment is confirmed.
          </p>
        )}
        <Link href="/donate" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to donate
        </Link>
      </div>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href="/donate" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:underline">
        Back to donate
      </Link>
    </div>
  );
}

export default function DonateReceiptPage() {
  return (
    <main className="mt-12 sm:mt-14 lg:mt-16 flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}>
        <ReceiptView />
      </Suspense>
    </main>
  );
}
