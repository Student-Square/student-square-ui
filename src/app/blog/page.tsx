'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import {
  useGetBlogsQuery,
  useGetBlogCategoriesQuery,
} from "@/redux/features/blogs/blogsApi";
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Quote,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";
const PAGE_SIZE = 6;

const sortLabels: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "title-asc": "Title A → Z",
  "title-desc": "Title Z → A",
};

const SORT_MAP: Record<SortOption, { sortBy: string; sortOrder: "asc" | "desc" }> = {
  newest: { sortBy: "publishedAt", sortOrder: "desc" },
  oldest: { sortBy: "publishedAt", sortOrder: "asc" },
  "title-asc": { sortBy: "title", sortOrder: "asc" },
  "title-desc": { sortBy: "title", sortOrder: "desc" },
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedQuery, sort]);

  // Queries
  const { data: categoriesData } = useGetBlogCategoriesQuery();
  const { data: storiesPreview } = useGetStoriesQuery({ limit: 3, sortBy: "publishedAt", sortOrder: "desc" });

  const postParams = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    ...SORT_MAP[sort],
    ...(activeCategory !== "all" && { categorySlug: activeCategory }),
    ...(debouncedQuery && { searchTerm: debouncedQuery }),
  }), [page, sort, activeCategory, debouncedQuery]);

  const { data: postsData, isLoading: postsLoading, isFetching: postsFetching } = useGetBlogsQuery(postParams);

  const posts = postsData?.data ?? [];
  const meta = postsData?.meta;
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / PAGE_SIZE)) : 1;

  const featuredPost = useMemo(() => {
    if (page !== 1 || debouncedQuery) return null;
    return posts.find((p) => p.isFeatured) ?? posts[0] ?? null;
  }, [posts, page, debouncedQuery]);

  const gridPosts = useMemo(() => {
    if (featuredPost) return posts.filter((p) => p.id !== featuredPost.id);
    return posts;
  }, [posts, featuredPost]);

  const categories = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.filter((c) => c._count.posts > 0);
  }, [categoriesData]);


  const stories = storiesPreview?.data ?? [];
  const totalStories = storiesPreview?.meta?.total ?? 0;

  const hasActiveFilters =
    debouncedQuery !== "" || activeCategory !== "all" || sort !== "newest";

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setSort("newest");
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

  const isBusy = postsLoading || postsFetching;

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
            Read about our programs, the people who make them possible, and the change we are
            building together — one student, one community at a time.
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
              }`}
            >
              All
              {meta && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {meta.total}
                </span>
              )}
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-card border-border text-foreground hover:border-emerald-500/60 hover:text-emerald-600"
                  }`}
                >
                  {cat.name}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat._count.posts}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featuredPost && !isBusy && (
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="flex items-baseline justify-between mb-5 sm:mb-6 gap-3 flex-wrap">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Featured in{" "}
                {activeCategory === "all"
                  ? "All Stories"
                  : (categoriesData?.find((c) => c.slug === activeCategory)?.name ?? activeCategory)}
              </h2>
            </div>

            <motion.div
              key={featuredPost.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage.url}
                      alt={featuredPost.coverImage.alt ?? featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
                      <Sparkles className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-2 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-600 text-white">
                      {featuredPost.category.name}
                    </span>
                    {featuredPost.tags.slice(0, 2).map((t) => (
                      <span
                        key={t.tag.id}
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                      >
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight group-hover:text-emerald-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {featuredPost.displayAuthorImage ? (
                        <img
                          src={featuredPost.displayAuthorImage}
                          alt={featuredPost.displayAuthorName ?? "Author"}
                          className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border shrink-0">
                          <Users className="h-4 w-4 text-emerald-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {featuredPost.displayAuthorName ?? "Student Square"}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {formatDate(featuredPost.publishedAt)}
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

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm rounded-lg bg-card border border-border px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <option key={opt} value={opt}>{sortLabels[opt]}</option>
                ))}
              </select>
            </div>

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


          {/* Results count */}
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {activeCategory === "all"
                ? "Latest Articles"
                : `${categoriesData?.find((c) => c.slug === activeCategory)?.name ?? activeCategory} Articles`}
            </h2>
            <span className="text-xs text-muted-foreground">
              {meta ? (
                <>
                  {meta.total} article{meta.total === 1 ? "" : "s"}
                  {meta.total > 0 && totalPages > 1 && ` — page ${page} of ${totalPages}`}
                </>
              ) : null}
            </span>
          </div>

          {/* Loading */}
          {isBusy && (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              Loading articles…
            </div>
          )}

          {/* Empty */}
          {!isBusy && posts.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
              <p className="text-sm font-semibold text-foreground">No articles match your filters.</p>
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
          )}

          {/* Grid */}
          {!isBusy && gridPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {gridPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/blog/${post.category.slug}/${post.id}`}
                    className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage.url}
                          alt={post.coverImage.alt ?? post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
                          <Sparkles className="h-10 w-10 text-emerald-300 dark:text-emerald-700" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur text-emerald-700 dark:text-emerald-300 border border-white/40 dark:border-emerald-800/60 shadow-sm">
                        {post.category.name}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>

                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          {post.displayAuthorImage ? (
                            <img
                              src={post.displayAuthorImage}
                              alt={post.displayAuthorName ?? "Author"}
                              className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border shrink-0">
                              <Users className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                          )}
                          <p className="text-[11px] font-semibold text-foreground truncate">
                            {post.displayAuthorName ?? "Student Square"}
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
          {!isBusy && totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-center gap-1.5 flex-wrap"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
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
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 disabled:opacity-40 transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </nav>
          )}
        </div>
      </section>


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
                  First-person stories from students across Bangladesh whose lives have been shaped by
                  counselling, scholarships, and community support.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/blog/real-life-stories"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
                  >
                    Browse all stories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {totalStories > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {totalStories} stories and counting
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 p-6 sm:p-8 lg:p-8 lg:pl-0">
                <div className="space-y-3 sm:space-y-4">
                  {stories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/blog/real-life-stories/${s.slug}`}
                      className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/80 backdrop-blur border border-border hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 transition-all"
                    >
                      {s.coverImage ? (
                        <img
                          src={s.coverImage.url}
                          alt={s.coverImage.alt ?? s.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border shrink-0">
                          <Users className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                          <Quote className="h-2.5 w-2.5" />
                          <span className="italic line-clamp-1">{s.quote}</span>
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
      <Footer />
    </main>
  );
}
