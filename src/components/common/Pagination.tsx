"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The one page-number control. The windowing rule (first, last, a page either
 * side of the current one, ellipses for the gaps) lived in two copies before
 * this and was about to become four.
 *
 * Renders nothing for a single page, so callers can drop it in without
 * guarding first.
 */

const windowed = (page: number, totalPages: number): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (page > 3) pages.push("ellipsis");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pages = useMemo(() => windowed(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  const arrowCls =
    "inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 flex-wrap ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={arrowCls}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-2 text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={page === p ? "page" : undefined}
            className={`min-w-[36px] px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              page === p
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={arrowCls}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </nav>
  );
}
