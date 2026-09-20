"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The page control, for every paginated surface in the app.
 *
 * Six pages used to hand-roll their own, which is why a donation list, a
 * ledger and a user table all paged differently. This is the only one now.
 *
 * Counts and page size come from the caller — pass backend `total` / `limit` /
 * `totalPages`, never invent them by slicing a full client list.
 *
 * Copy and digits default to English because the admin shells are English
 * only, but the public pages are not: they pass `labels` and `formatNumber`
 * from `useLanguage()` so the same control reads correctly in Bangla.
 */

const DEFAULT_PAGE_SIZES = [10, 20, 50, 100] as const;

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
  total,
  limit,
  onLimitChange,
  pageSizes = DEFAULT_PAGE_SIZES,
  labels,
  formatNumber,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Total matching entries from the API. */
  total?: number;
  /** Page size from the API (also drives the per-page control). */
  limit?: number;
  onLimitChange?: (limit: number) => void;
  pageSizes?: readonly number[];
  /** Translated arrow copy; English when omitted. */
  labels?: { prev: string; next: string; pagination?: string };
  /** Digit rendering, e.g. Bangla numerals; Latin when omitted. */
  formatNumber?: (value: number) => string;
}) {
  const pages = useMemo(() => windowed(page, totalPages), [page, totalPages]);
  const digits = formatNumber ?? ((n: number) => String(n));
  const prevLabel = labels?.prev ?? "Prev";
  const nextLabel = labels?.next ?? "Next";

  const showMeta = typeof total === "number" && typeof limit === "number";
  const showPager = totalPages > 1;

  if (!showMeta && !showPager) return null;

  const from = showMeta && total > 0 ? (page - 1) * limit + 1 : 0;
  const to = showMeta ? Math.min(page * limit, total) : 0;

  const arrowCls =
    "inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors";

  return (
    <nav
      aria-label={labels?.pagination ?? "Pagination"}
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
    >
      {showMeta ? (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            {total === 0 ? "0 entries" : `${from}–${to} of ${total}`}
          </span>
          {onLimitChange ? (
            <label className="flex items-center gap-1.5">
              <span>Per page</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="rounded-md border border-border bg-background px-1.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                aria-label="Entries per page"
              >
                {pageSizes.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span>{limit} per page</span>
          )}
        </div>
      ) : null}

      {showPager ? (
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={arrowCls}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{prevLabel}</span>
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
                {digits(p)}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={arrowCls}
          >
            <span className="hidden sm:inline">{nextLabel}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
