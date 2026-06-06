"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function ComingSoonPage({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 max-w-xl">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-semibold">Coming soon</span>
      </div>
      <h1 className="text-xl font-bold text-foreground">{label}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This section is planned but not yet built.
      </p>
      <Link
        href="/admin"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
