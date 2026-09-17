"use client";

import Link from "next/link";
import { ArrowUp, CreditCard, Globe, Landmark, Moon, ShieldCheck, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { container, eyebrow, heading, sub } from "../ui";
import { useDonationDetails } from "../useDonateContent";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const WALLET_LOGOS = [
  { src: "/images/bkash-logo.webp", alt: "bKash" },
  { src: "/images/Nagad-Logo.png", alt: "Nagad" },
  { src: "/images/rocket-logo.png", alt: "Rocket" },
];

/**
 * Every way to pay, in one place: online through the gateway (what the form
 * above does), or directly to the foundation's bank account or mobile-banking
 * number. Kept side by side so a donor paying bKash through the gateway is not
 * confused with one sending money to the bKash number, and so Zakat is
 * explained once for both. The account details are published fundraising
 * details and come from site settings.
 */
export default function DonateWaysToGiveSection() {
  const { bankTransfer, mobileBanking, zakat, isLoading: detailsLoading } = useDonationDetails();
  const { lang, t, tr, rich } = useLanguage();

  // Account, SWIFT, routing and phone numbers stay in ASCII digits: donors copy
  // them into banking apps, which do not accept Bangla numerals.
  const bankRows = [
    { key: "donate.accountName", value: bankTransfer?.accountName && tr(bankTransfer.accountName) },
    { key: "donate.accountNo", value: bankTransfer?.accountNumber },
    { key: "donate.bank", value: bankTransfer?.bank && tr(bankTransfer.bank) },
    { key: "donate.swift", value: bankTransfer?.swift },
    { key: "donate.routing", value: bankTransfer?.routingNumber },
  ].filter((row) => Boolean(row.value));
  const hasDirect = bankRows.length > 0 || Boolean(mobileBanking?.number);
  // Hold the second column while the details load, so the section does not
  // jump from one column to two when they arrive.
  const directColumn = hasDirect || detailsLoading;

  return (
    <section id="how-to-donate" className="pb-14 pt-4 sm:pb-20 sm:pt-6">
      <div className={container}>
        <span className={eyebrow}>{t("donate.ways.eyebrow")}</span>
        <h2 className={heading}>{t("donate.directHeading")}</h2>
        <p className={sub}>{t("donate.ways.body")}</p>

        <div className={`mt-10 grid grid-cols-1 gap-6 ${directColumn ? "lg:grid-cols-2" : ""}`}>
          {/* Online, through the gateway */}
          <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <ColumnHeader icon={Globe} title={t("donate.ways.online")} subtitle={t("donate.paymentHeading")} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("donate.paymentBody")}</p>

            <ul className="mt-2 flex-1 divide-y divide-border">
              <MethodRow icon={CreditCard} title={t("donate.card")} body={t("donate.cardBody")} />
              <MethodRow icon={Smartphone} title={t("donate.mobile")} body={t("donate.mobileBody")}>
                <div className="mt-2.5 flex gap-2">
                  {WALLET_LOGOS.map((logo) => (
                    <span key={logo.alt} className="flex h-7 items-center rounded-md border border-border bg-white px-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.src} alt={tr(logo.alt)} className="h-4 w-auto object-contain" />
                    </span>
                  ))}
                </div>
              </MethodRow>
              <MethodRow icon={Landmark} title={t("donate.internet")} body={t("donate.internetBody")} />
            </ul>

            <a
              href="#donate-main"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <ArrowUp className="h-4 w-4" />
              {t("donate.ways.onlineCta")}
            </a>
          </article>

          {/* Direct, without the gateway */}
          {detailsLoading && !hasDirect && (
            <article
              aria-busy="true"
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
              <div className="h-28 animate-pulse rounded-xl bg-muted" />
            </article>
          )}
          {hasDirect && (
            <article className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <ColumnHeader icon={ShieldCheck} title={t("donate.directEyebrow")} subtitle={t("donate.ways.directSub")} />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("donate.directBody")}</p>

              {bankRows.length > 0 && (
                <div className="mt-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Landmark aria-hidden className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {t("donate.bankTransfer")}
                  </p>
                  <dl className="mt-2 divide-y divide-border rounded-xl border border-border px-4">
                    {bankRows.map((row) => (
                      <div key={row.key} className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-xs text-muted-foreground">{t(row.key)}</dt>
                        <dd className="text-right text-sm font-semibold text-foreground">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {mobileBanking?.number && (
                <div className="mt-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Smartphone aria-hidden className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {t("donate.mobile")}
                    <span className="font-normal text-muted-foreground">
                      · {(mobileBanking.providers ?? []).map((provider) => tr(provider)).join(" / ")}
                    </span>
                  </p>
                  <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      {t("donate.sendMoneyTo")}
                    </p>
                    <p className="mt-1.5 text-2xl font-bold tracking-wide text-emerald-700 dark:text-emerald-300 sm:text-3xl">
                      {mobileBanking.number}
                    </p>
                    {mobileBanking.accountType && (
                      <p className="mt-1 text-xs text-muted-foreground">({tr(mobileBanking.accountType)})</p>
                    )}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>

        {/* Zakat, once: the foundation's message beside the instruction for
            each way of paying. */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-background to-amber-50/70 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-background dark:to-amber-950/20">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-5 lg:items-center lg:gap-10">
            {/* The message */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm dark:bg-amber-900/40 dark:text-amber-300">
                  <Moon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {t("donate.zakatSadaqah")}
                </span>
              </div>
              {zakat?.noteBn && (
                <p className="mt-4 text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
                  {zakat.noteBn}
                </p>
              )}
              {zakat?.noteEn && (lang === "EN" || !zakat.noteBn) && (
                <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">{zakat.noteEn}</p>
              )}
            </div>

            {/* How to give it */}
            <ul className="grid gap-3 lg:col-span-3">
              <ZakatStep icon={Globe} title={t("donate.ways.online")}>
                {rich("donate.zakatGatewayBody", {
                  link: (
                    <Link
                      href="/donate/general"
                      className="font-semibold text-emerald-700 underline decoration-emerald-600/30 underline-offset-4 hover:decoration-emerald-600 dark:text-emerald-400"
                    >
                      {t("donate.generalCta")}
                    </Link>
                  ),
                })}
              </ZakatStep>
              {hasDirect && zakat?.reference && (
                <ZakatStep icon={Landmark} title={t("donate.directEyebrow")}>
                  {tr(zakat.reference)}
                </ZakatStep>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ColumnHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function MethodRow({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <li className="flex gap-3 py-4">
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
        {children}
      </div>
    </li>
  );
}

function ZakatStep({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
