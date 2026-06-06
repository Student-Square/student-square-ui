"use client";

import Link from "next/link";
import { Bookmark, ExternalLink } from "lucide-react";

export default function SavedArticlesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Saved Articles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Articles and posts you&apos;ve bookmarked for later.
        </p>
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-4">
          <Bookmark className="h-8 w-8 text-violet-500" />
        </div>
        <h2 className="text-base font-semibold text-foreground">No saved articles</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
          When you bookmark an article, it will appear here so you can find it easily later.
        </p>
        <Link
          href="/blog/magazine"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-emerald-500/50 hover:text-emerald-600 transition-colors"
        >
          Explore articles <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
