"use client";

import { Landmark, Smartphone } from "lucide-react";
import { container, eyebrow, heading, sub } from "../ui";
import { useDonationDetails } from "../useDonateContent";

/**
 * "HOW TO DONATE" — the foundation's own bank and mobile-banking details, for
 * donors who would rather transfer directly than use the gateway. The numbers
 * are published fundraising details and come from site settings.
 */
export default function DonateHowToSection() {
  const { bankTransfer, mobileBanking, zakat } = useDonationDetails();

  const bankRows = [
    { key: "A/C Name", value: bankTransfer?.accountName },
    { key: "A/C No", value: bankTransfer?.accountNumber },
    { key: "Bank", value: bankTransfer?.bank },
    { key: "SWIFT", value: bankTransfer?.swift },
    { key: "Routing Number", value: bankTransfer?.routingNumber },
  ].filter((row) => Boolean(row.value));

  if (bankRows.length === 0 && !mobileBanking?.number) return null;

  return (
    <section id="how-to-donate" className="py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>Direct Giving</span>
        <h2 className={heading}>How to Donate</h2>
        <p className={sub}>
          Prefer to give without the gateway? Send your contribution straight to our bank account or
          mobile banking number below.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {bankRows.length > 0 && (
            <article className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Bank Transfer</h3>
                  <p className="text-xs text-muted-foreground">Islami Bank Bangladesh</p>
                </div>
              </div>
              <dl className="divide-y divide-border">
                {bankRows.map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-xs text-muted-foreground">{row.key}</dt>
                    <dd className="text-right text-sm font-semibold text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          )}

          {mobileBanking?.number && (
            <article className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Mobile Banking</h3>
                  <p className="text-xs text-muted-foreground">
                    {(mobileBanking.providers ?? []).join(" / ")}
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Send Money To
                </p>
                <p className="mt-2 text-2xl font-bold tracking-wide text-emerald-700 dark:text-emerald-300 sm:text-3xl">
                  {mobileBanking.number}
                </p>
                {mobileBanking.accountType && (
                  <p className="mt-1 text-xs text-muted-foreground">({mobileBanking.accountType})</p>
                )}
              </div>
            </article>
          )}
        </div>

        {(zakat?.reference || zakat?.noteBn || zakat?.noteEn) && (
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/60 to-transparent dark:border-amber-900/70 dark:from-amber-950/40 dark:via-amber-950/15">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl shadow-sm dark:bg-amber-900/50">
                🌙
              </div>

              <div>
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  Zakat &amp; Sadaqah
                </span>

                {zakat.reference && (
                  <p className="mt-4 text-base font-semibold leading-relaxed text-foreground sm:text-lg">
                    {zakat.reference}
                  </p>
                )}

                {(zakat.noteBn || zakat.noteEn) && (
                  <blockquote className="mt-5 border-l-2 border-amber-400 pl-5 dark:border-amber-600">
                    {zakat.noteBn && (
                      <p className="text-[15px] leading-loose text-foreground">{zakat.noteBn}</p>
                    )}
                    {zakat.noteEn && (
                      <footer className="mt-2 text-sm italic text-muted-foreground">
                        {zakat.noteEn}
                      </footer>
                    )}
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
