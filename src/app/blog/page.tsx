'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import blogData from "@/data/blog";
import { storiesData } from "@/data/stories";
import type { BlogCategory } from "@/types/blog";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Quote,
  Search,
  Sparkles,
  Users,
  X,
  SlidersHorizontal,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";
const PAGE_SIZE = 6;

const sortLabels: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "title-asc": "Title A → Z",
  "title-desc": "Title Z → A",
};

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategory | "All">("All");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<BlogCategory>();
    blogData.forEach((b) => set.add(b.category));
    return ["All", ...Array.from(set)] as const;
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    blogData.forEach((b) => b.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogData.length };
    blogData.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = blogData.filter((b) => {
      const matchCategory = category === "All" || b.category === category;
      const matchTag = activeTag === "All" || b.tags.includes(activeTag);
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.paragraph.toLowerCase().includes(q) ||
        b.author.name.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchTag && matchQuery;
    });

    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.publishedAt.localeCompare(a.publishedAt);
        case "oldest":
          return a.publishedAt.localeCompare(b.publishedAt);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
      }
    });

    return list;
  }, [query, category, activeTag, sort]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [query, category, activeTag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  // Featured is the newest post that matches the *category* (so it changes with tab)
  const featured = useMemo(() => {
    const pool =
      category === "All"
        ? blogData
        : blogData.filter((b) => b.category === category);
    return [...pool].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt)
    )[0];
  }, [category]);

  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setActiveTag("All");
    setSort("newest");
  };

  const hasActiveFilters =
    query !== "" || category !== "All" || activeTag !== "All" || sort !== "newest";

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const max = totalPages;
    const c = safePage;
    if (max <= 7) {
      for (let i = 1; i <= max; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (c > 3) pages.push("ellipsis");
    for (let i = Math.max(2, c - 1); i <= Math.min(max - 1, c + 1); i++) {
      pages.push(i);
    }
    if (c < max - 2) pages.push("ellipsis");
    pages.push(max);
    return pages;
  }, [totalPages, safePage]);

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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-5"
          >
            <Sparkles className="h-3 w-3" />
            Blog &amp; Stories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-3xl leading-tight"
          >
            Insights, updates, and stories from the{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Student Square
            </span>{" "}
            community.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl"
          >
            Read about our programs, the people who make them possible, and the
            change we are building together — one student, one community at a
            time.
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {categories.map((c) => {
              const isActive = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c as BlogCategory | "All")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
                  }`}
                >
                  {c}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {categoryCounts[c] ?? 0}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="flex items-baseline justify-between mb-5 sm:mb-6 gap-3 flex-wrap">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Featured in {category === "All" ? "All Stories" : category}
              </h2>
            </div>

            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/blog/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="lg:col-span-2 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-600 text-white">
                      {featured.category}
                    </span>
                    {featured.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight group-hover:text-emerald-600 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {featured.paragraph}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={featured.author.image}
                        alt={featured.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {featured.author.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {featured.publishDate}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all whitespace-nowrap">
                      Read story
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Real Life Stories promo */}
      <section className="pb-10 sm:pb-14 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/40 dark:via-background dark:to-emerald-950/30"
          >
            <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Left: copy */}
              <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-300/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider w-fit">
                  <Users className="h-3 w-3" />
                  Real Life Stories
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Read how students like you{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                    found their path.
                  </span>
                </h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                  First-person stories from students across Bangladesh whose
                  lives have been shaped by counselling, scholarships, and
                  community support.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/blog/real-life-stories"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
                  >
                    Browse all stories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {storiesData.length} stories and counting
                  </span>
                </div>
              </div>

              {/* Right: stacked story previews */}
              <div className="lg:col-span-2 p-6 sm:p-8 lg:p-8 lg:pl-0">
                <div className="space-y-3 sm:space-y-4">
                  {storiesData.slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      href={`/blog/real-life-stories/${s.id}`}
                      className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/80 backdrop-blur border border-border hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 transition-all"
                    >
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                          <Quote className="h-2.5 w-2.5" />
                          <span className="italic line-clamp-1">
                            {s.quote}
                          </span>
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:rotate-12 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls + grid */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-0 max-w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, authors, topics..."
                className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-xs font-semibold text-muted-foreground whitespace-nowrap"
              >
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm rounded-lg bg-card border border-border px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <option key={opt} value={opt}>
                    {sortLabels[opt]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen((s) => !s)}
              className="lg:hidden inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {filtersOpen ? "Hide filters" : "Filters"}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors lg:ml-auto"
              >
                <X className="h-3.5 w-3.5" />
                Clear all
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div
            className={`mb-6 ${filtersOpen ? "block" : "hidden lg:block"}`}
          >
            <div className="rounded-lg border border-border bg-card/60 p-3 sm:p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
                Filter by tag
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const isActive = activeTag === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setActiveTag(t)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        isActive
                          ? "bg-foreground border-foreground text-background"
                          : "bg-card border-border text-muted-foreground hover:border-emerald-500/60 hover:text-emerald-600"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {category === "All" ? "Latest Articles" : `${category} Articles`}
            </h2>
            <span className="text-xs text-muted-foreground">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
              {filtered.length > 0 && (
                <>
                  {" "}— page {safePage} of {totalPages}
                </>
              )}
            </span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
              <p className="text-sm font-semibold text-foreground">
                No articles match your filters.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different keyword, category, or tag.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {paginated.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur text-emerald-700 dark:text-emerald-300 border border-white/40 dark:border-emerald-800/60 shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        <span>{post.publishDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {post.paragraph}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                          />
                          <p className="text-[11px] font-semibold text-foreground truncate">
                            {post.author.name}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-center gap-1.5 flex-wrap"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <span
                    key={`e-${idx}`}
                    className="px-2 text-xs text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={safePage === p ? "page" : undefined}
                    className={`min-w-[36px] px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      safePage === p
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                        : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
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
