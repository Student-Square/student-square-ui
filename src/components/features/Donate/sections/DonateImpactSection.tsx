"use client";

import { ArrowRight } from "lucide-react";
import { amountOptions, oneTimeInlineImpacts } from "../constants";
import { container, eyebrow, heading, sub } from "../ui";
import { useDonateContent } from "../useDonateContent";

interface DonateImpactSectionProps {
  currentAmt: number;
  onAmountPick: (amount: number) => void;
}

/**
 * "MAKE AN IMPACT" — the four preset amounts shown together with what each one
 * funds, so a donor can choose by outcome rather than by number. Picking one
 * sets the amount and returns them to the form.
 */
export default function DonateImpactSection({ currentAmt, onAmountPick }: DonateImpactSectionProps) {
  const { makeAnImpact } = useDonateContent();

  const amounts =
    makeAnImpact?.amounts ??
    amountOptions.map((amount) => ({ amount, impact: oneTimeInlineImpacts[amount] }));

  const choose = (amount: number) => {
    onAmountPick(amount);
    document.getElementById("donate-main")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="make-an-impact" className="py-14 sm:py-20">
      <div className={container}>
        <div className="text-center">
          <span className={eyebrow}>{makeAnImpact?.eyebrow ?? "Make an Impact"}</span>
          <h2 className={heading}>
            {makeAnImpact?.heading ?? "Make a Difference with Your Donation"}
          </h2>
          <p className={`${sub} mx-auto text-center`}>
            {makeAnImpact?.body ??
              "Every penny counts. Select your donation amount below and help us continue our mission across Bangladesh."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {amounts.map(({ amount, impact }) => {
            const active = currentAmt === amount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => choose(amount)}
                className={`group flex flex-col gap-3 rounded-2xl border-2 p-6 text-left transition-all hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg ${
                  active
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  ৳{amount.toLocaleString()}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{impact}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Give ৳{amount.toLocaleString()}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
