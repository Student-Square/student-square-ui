"use client";

import Link from "next/link";
import { ExternalLink, Newspaper } from "lucide-react";

export default function MyBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">My Blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your published and draft blog posts on Student Square.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
          <Newspaper className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-base font-semibold text-foreground">No blog posts yet</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
          Blog posts are written and published by our editorial team. Check back here to see posts you&apos;re credited on.
        </p>
        <Link
          href="/blog"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors"
        >
          Browse the blog <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
