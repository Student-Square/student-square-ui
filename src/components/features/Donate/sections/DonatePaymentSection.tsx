"use client";

import Image from "next/image";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { container, eyebrow, heading, sub } from "../ui";

const methods = [
  { src: "/images/bkash-logo.webp", alt: "bKash", label: "bKash" },
  { src: "/images/Nagad-Logo.png", alt: "Nagad", label: "Nagad" },
  { src: "/images/rocket-logo.png", alt: "Rocket", label: "Rocket" },
];

export default function DonatePaymentSection() {
  return (
    <section id="payment" className="border-t border-border bg-muted/30 py-14 sm:py-20">
      <div className={container}>
        <span className={eyebrow}>Payment Methods</span>
        <h2 className={heading}>Pay Securely via SSLCommerz</h2>
        <p className={sub}>
          All donations are processed through SSLCommerz — Bangladesh&apos;s leading payment gateway.
          Your payment is encrypted and secure.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Debit / Credit Card</h3>
                <p className="text-xs text-muted-foreground">All major banks</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pay using any Visa, Mastercard, or local bank debit card. Your card details are handled
              directly by SSLCommerz — we never see them.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Mobile Banking</h3>
                <p className="text-xs text-muted-foreground">bKash · Nagad · Rocket</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {methods.map((m) => (
                <div
                  key={m.alt}
                  className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:border-emerald-500/60"
                >
                  <Image src={m.src} alt={m.alt} width={40} height={40} className="h-10 w-10 rounded-lg object-contain" />
                  <span className="text-[11px] font-bold text-foreground">{m.label}</span>
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
                <h3 className="text-sm font-bold text-foreground">Internet Banking</h3>
                <p className="text-xs text-muted-foreground">50+ banks supported</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pay directly from your bank account via internet banking. Supported by all major
              Bangladeshi banks through the SSLCommerz gateway.
            </p>
          </article>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4">
          <span className="text-base leading-none">🌙</span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Giving Zakat through the gateway?</span>{" "}
            Choose &quot;Other&quot; in the form above and write{" "}
            <span className="font-semibold text-foreground">&quot;যাকাত&quot;</span> as the purpose.
          </p>
        </div>
      </div>
    </section>
  );
}
