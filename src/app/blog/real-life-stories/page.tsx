'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Crumb,
  Loader2,
  Quote,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import StoryCard from "@/components/sections/Stories/StoryCard";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type SortOption = "default" | "name-asc" | "name-desc";
const PAGE_SIZE = 6;

/** Dictionary keys for the sort menu. */
const sortLabels: Record<SortOption, string> = {
  default: "stories.sort.default",
  "name-asc": "stories.sort.nameAsc",
  "name-desc": "stories.sort.nameDesc",
};

const SORT_MAP: Record<SortOption, { sortBy: string; sortOrder: "asc" | "desc" }> = {
  default: { sortBy: "publishedAt", sortOrder: "desc" },
  "name-asc": { sortBy: "name", sortOrder: "asc" },
  "name-desc": { sortBy: "name", sortOrder: "desc" },
};

// useSearchParams() needs a Suspense boundary, or `next build` refuses to
// prerender the page.
export default function RealLifeStoriesPage() {
  return (
    <Suspense fallback={null}>
      <RealLifeStoriesContent />
    </Suspense>
  );
}

function RealLifeStoriesContent() {
  const { t, pick, num, tr } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFilterReset = useRef(true);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  // Accepts an updater like useState's setter — Prev/Next pass one. Taking only
  // a number, it wrote the function itself into ?page=, which parsed as NaN
  // and sent both buttons back to page 1.
  const setPage = useCallback(
    (next: number | ((current: number) => number)) => {
      const target = typeof next === "function" ? next(page) : next;
      const params = new URLSearchParams(searchParams.toString());
      if (target <= 1) params.delete("page");
      else params.set("page", String(target));
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [page, pathname, router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (skipFilterReset.current) {
      skipFilterReset.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("page")) return;
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // Intentionally ignore searchParams: only reset page when filters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, sort]);

  const queryParams = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    ...SORT_MAP[sort],
    ...(debouncedQuery && { searchTerm: debouncedQuery }),
  }), [page, sort, debouncedQuery]);

  const { data, isLoading, isFetching } = useGetStoriesQuery(queryParams);

  const stories = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / PAGE_SIZE)) : 1;

  const featured = page === 1 && !debouncedQuery ? (stories[0] ?? null) : null;
  const gridStories = featured ? stories.slice(1) : stories;

  const isBusy = isLoading || isFetching;
  const hasActiveFilters = debouncedQuery !== "" || sort !== "default";

  const clearFilters = () => {
    setQuery("");
    setSort("default");
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const max = totalPages;
    const c = page;
    if (max <= 7) {
      for (let i = 1; i <= max; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (c > 3) pages.push("ellipsis");
    for (let i = Math.max(2, c - 1); i <= Math.min(max - 1, c + 1); i++) pages.push(i);
    if (c < max - 2) pages.push("ellipsis");
    pages.push(max);
    return pages;
  }, [totalPages, page]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-5"
          >
            <Link href="/" className="hover:text-emerald-600 transition-colors">{t("common.home")}</Link>
            <Crumb className="h-3 w-3" />
            <Link href="/blog" className="hover:text-emerald-600 transition-colors">{t("common.blog")}</Link>
            <Crumb className="h-3 w-3" />
            <span className="text-foreground">{t("blog.storiesBadge")}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-5"
          >
            <Sparkles className="h-3 w-3" />
            {t("blog.storiesBadge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-3xl leading-tight"
          >
            {t("stories.headingLead")}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              {t("stories.headingAccent")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl"
          >
            {t("stories.intro")}
          </motion.p>
        </div>
      </section>

      {/* Featured */}
      {featured && !isBusy && (
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-5 sm:mb-6">
              {t("stories.featured")}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/blog/real-life-stories/${featured.slug}`}
                className="group flex flex-col lg:flex-row bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="w-full h-[240px] sm:h-[280px] lg:w-[420px] lg:h-[320px] shrink-0 overflow-hidden bg-muted">
                  {featured.coverImage ? (
                    <img
                      src={featured.coverImage.url}
                      alt={featured.coverImage.alt ?? featured.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
                      <Users className="h-20 w-20 text-emerald-300 dark:text-emerald-700" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <Quote className="h-7 w-7 text-emerald-600 mb-3" />
                  <blockquote className="text-base sm:text-lg lg:text-xl text-foreground italic leading-relaxed">
                    &ldquo;{pick(featured.quote, featured.quoteBn)}&rdquo;
                  </blockquote>

                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-border">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                        {tr(featured.name)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tr(featured.department)}
                        {featured.university && ` · ${tr(featured.university)}`}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all whitespace-nowrap">
                      {t("common.readStory")}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Controls + grid */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-6">
            <div className="relative flex-1 min-w-0 max-w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("stories.searchPlaceholder")}
                className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label={t("common.clearSearch")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                {t("common.sort")}
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm rounded-lg bg-card border border-border px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <option key={opt} value={opt}>{t(sortLabels[opt])}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors lg:ml-auto"
              >
                <X className="h-3.5 w-3.5" />
                {t("common.clearAll")}
              </button>
            )}
          </div>

          {/* Count */}
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("stories.all")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {meta ? (
                <>
                  {t(meta.total === 1 ? "stories.countOne" : "stories.countMany", { count: meta.total })}
                  {meta.total > 0 && totalPages > 1 && t("common.pageOf", { page, total: totalPages })}
                </>
              ) : null}
            </span>
          </div>

          {/* Loading */}
          {isBusy && (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              {t("stories.loading")}
            </div>
          )}

          {/* Empty */}
          {!isBusy && gridStories.length === 0 && !featured && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
              <p className="text-sm font-semibold text-foreground">{t("stories.noMatch")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("stories.tryKeyword")}</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  {t("common.resetFilters")}
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!isBusy && gridStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {gridStories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex"
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isBusy && totalPages > 1 && (
            <nav
              aria-label={t("common.pagination")}
              className="mt-12 flex items-center justify-center gap-1.5 flex-wrap"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("common.prev")}</span>
              </button>

              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-2 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={page === p ? "page" : undefined}
                    className={`min-w-[36px] px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      page === p
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                        : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
                    }`}
                  >
                    {num(p, false)}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors"
              >
                <span className="hidden sm:inline">{t("common.next")}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </nav>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
