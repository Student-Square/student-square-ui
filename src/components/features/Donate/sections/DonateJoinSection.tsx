"use client";

import { ArrowRight } from "lucide-react";
import { container } from "../ui";
import { useDonateContent } from "../useDonateContent";

export default function DonateJoinSection() {
  const { joinUs } = useDonateContent();

  return (
    <section className="border-y border-border bg-emerald-50/60 py-12 dark:bg-emerald-950/20 sm:py-16">
      <div className={container}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {joinUs?.heading ?? "Join Us Today"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {joinUs?.body ??
              "Be a part of this transformative journey. Your single penny can spark a chain reaction of positive change. Donate now and help us make a difference in the lives of countless individuals."}
          </p>
          <a
            href="#donate-main"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition-colors hover:bg-emerald-700"
          >
            Donate Now
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
