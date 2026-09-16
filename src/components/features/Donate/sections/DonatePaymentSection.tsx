"use client";

import Image from "next/image";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { container, eyebrow, heading, sub } from "../ui";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const methods = [
  { src: "/images/bkash-logo.webp", alt: "bKash", label: "bKash" },
  { src: "/images/Nagad-Logo.png", alt: "Nagad", label: "Nagad" },
  { src: "/images/rocket-logo.png", alt: "Rocket", label: "Rocket" },
];

export default function DonatePaymentSection() {
  const { t, tr } = useLanguage();
  return (
    <section id="payment" className="border-t border-border bg-muted/30 py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>{t("donate.paymentEyebrow")}</span>
        <h2 className={heading}>{t("donate.paymentHeading")}</h2>
        <p className={sub}>{t("donate.paymentBody")}</p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{t("donate.card")}</h3>
                <p className="text-xs text-muted-foreground">{t("donate.cardSub")}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("donate.cardBody")}
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{t("donate.mobile")}</h3>
                <p className="text-xs text-muted-foreground">{t("donate.mobileSub")}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {methods.map((m) => (
                <div
                  key={m.alt}
                  className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:border-emerald-500/60"
                >
                  <Image src={m.src} alt={m.alt} width={40} height={40} className="h-10 w-10 rounded-lg object-contain" />
                  <span className="text-[11px] font-bold text-foreground">{tr(m.label)}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{t("donate.internet")}</h3>
                <p className="text-xs text-muted-foreground">{t("donate.internetSub")}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("donate.internetBody")}
            </p>
          </article>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4">
          <span className="text-base leading-none">🌙</span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{t("donate.zakatGatewayLead")}</span>{" "}
            {t("donate.zakatGatewayBody")}
          </p>
        </div>
      </div>
    </section>
  );
}
