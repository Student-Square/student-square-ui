"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { useLookupDonationQuery } from "@/redux/features/donations/donationsApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";

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
  const { t, tr, digits, date } = useLanguage();
  const token = useSearchParams().get("token") ?? "";
  const { data, isLoading, isError } = useLookupDonationQuery(token, {
    skip: !token,
  });

  if (!token) return <Message text={t("donate.receipt.noToken")} />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> {t("donate.receipt.loading")}
      </div>
    );
  if (isError || !data) return <Message text={t("donate.receipt.notFound")} />;

  const target = data.campaign?.title
    ? tr(data.campaign.title)
    : data.purpose ?? t("donate.receipt.generalFund");
  const amount =
    data.currency === "BDT" ? t("donate.amount", { amount: digits(data.amount) }) : `${data.currency} ${data.amount}`;
  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );

  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t("donate.receipt.title")}</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{data.receiptNo}</p>
      </div>
      <div className="mt-6">
        {row(t("donate.receipt.donor"), data.isAnonymous ? t("donate.receipt.anonymous") : data.donorName)}
        {row(t("donate.receipt.supports"), target)}
        {row(t("donate.receipt.amount"), amount)}
        {row(t("donate.receipt.status"), <span className={statusColor[data.status] ?? ""}>{t(`donate.status.${data.status}`)}</span>)}
        {row(t("donate.receipt.date"), date(data.paidAt ?? data.createdAt, "long"))}
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {data.status === "PAID" ? (
          <a
            href={`${API_BASE}/donations/invoice?token=${encodeURIComponent(token)}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4" /> {t("donate.receipt.download")}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-1">
            {t("donate.receipt.pending")}
          </p>
        )}
        <Link href="/donate" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t("donate.backToDonate")}
        </Link>
      </div>
    </div>
  );
}

function Message({ text }: { text: string }) {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href="/donate" className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:underline">
        {t("donate.backToDonate")}
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
