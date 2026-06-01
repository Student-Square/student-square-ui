"use client";

import { Heart, Zap } from "lucide-react";

export default function DonationPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Donation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Support the Student Square mission.
        </p>
      </div>

      {/* Coming soon card */}
      <div className="rounded-2xl border border-dashed border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-900/10 py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-5">
          <div className="h-20 w-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <Heart className="h-9 w-9 text-rose-500" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-sm">
            <Zap className="h-3 w-3 text-white" />
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 dark:bg-amber-900/30 dark:border-amber-700 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-4">
          Coming Soon
        </span>

        <h2 className="text-xl font-bold text-foreground">Donation portal is on its way</h2>
        <p className="mt-2.5 text-sm text-muted-foreground max-w-sm leading-relaxed">
          We&apos;re building a seamless way for you to support Student Square. Soon you&apos;ll
          be able to make one-time or recurring donations directly from your dashboard.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
          {[
            { label: "One-time", description: "Give once, any amount" },
            { label: "Monthly", description: "Recurring support" },
            { label: "Campaign", description: "Support specific goals" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-rose-200 dark:border-rose-800/40 bg-white dark:bg-rose-900/10 px-4 py-3 text-center opacity-60"
            >
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
