"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminGetCardQuery } from "@/redux/features/content/contentApi";
import CardForm from "../CardForm";
import { ArrowLeft } from "lucide-react";

export default function AdminHeroEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: card, isLoading, isError } = useAdminGetCardQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="h-10 w-72 rounded bg-muted animate-pulse" />
        <div className="h-80 w-full max-w-3xl rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 max-w-xl">
        <p className="text-sm font-semibold text-foreground">Card not found.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          It may have been deleted, or the id is invalid.
        </p>
        <Link
          href="/admin/hero"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
      </div>
    );
  }

  return <CardForm mode={{ kind: "edit", card }} />;
}
