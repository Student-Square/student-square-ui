'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { storiesData } from "@/data/stories";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Crumb,
  GraduationCap,
  MapPin,
  Quote,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type SortOption = "default" | "name-asc" | "name-desc" | "university-asc";
const PAGE_SIZE = 6;

const sortLabels: Record<SortOption, string> = {
  default: "Recommended",
  "name-asc": "Name A → Z",
  "name-desc": "Name Z → A",
  "university-asc": "University A → Z",
};

export default function RealLifeStoriesPage() {
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);

  const universities = useMemo(() => {
    const set = new Set<string>();
    storiesData.forEach((s) => set.add(s.university));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = storiesData.filter((s) => {
      const matchU = university === "All" || s.university === university;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.university.toLowerCase().includes(q) ||
        s.story.toLowerCase().includes(q) ||
        s.achievement.toLowerCase().includes(q);
      return matchU && matchQ;
    });

    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "university-asc")
      list.sort((a, b) => a.university.localeCompare(b.university));

    return list;
  }, [query, university, sort]);

  useEffect(() => {
    setPage(1);
  }, [query, university, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const hasActiveFilters =
    query !== "" || university !== "All" || sort !== "default";

  const clearFilters = () => {
    setQuery("");
    setUniversity("All");
    setSort("default");
  };

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

  const featured = storiesData[0];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero (no banner image) */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-5"
          >
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Crumb className="h-3 w-3" />
            <Link href="/blog" className="hover:text-emerald-600 transition-colors">
              Blog
            </Link>
            <Crumb className="h-3 w-3" />
            <span className="text-foreground">Real Life Stories</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-5"
          >
            <Sparkles className="h-3 w-3" />
            Real Life Stories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-3xl leading-tight"
          >
            Hundreds of journeys.{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              One growing community.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl"
          >
            Students from across Bangladesh share how Student Square&apos;s
            programmes helped them grow, lead, and give back to their
            communities.
          </motion.p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Featured Story
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/blog/real-life-stories/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="lg:col-span-2 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                  <Quote className="h-7 w-7 text-emerald-600 mb-3" />
                  <blockquote className="text-base sm:text-lg lg:text-xl text-foreground italic leading-relaxed">
                    &ldquo;{featured.quote}&rdquo;
                  </blockquote>

                  <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-border">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                        {featured.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {featured.role} · {featured.university}
                      </p>
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
                placeholder="Search by name, role, university..."
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
              <label
                htmlFor="university"
                className="text-xs font-semibold text-muted-foreground whitespace-nowrap"
              >
                University
              </label>
              <select
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="text-sm rounded-lg bg-card border border-border px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors max-w-[180px] sm:max-w-none truncate"
              >
                {universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-xs font-semibold text-muted-foreground whitespace-nowrap"
              >
                Sort
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

          {/* Count */}
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              All Stories
            </h2>
            <span className="text-xs text-muted-foreground">
              {filtered.length} stor{filtered.length === 1 ? "y" : "ies"}
              {filtered.length > 0 && (
                <>
                  {" "}
                  — page {safePage} of {totalPages}
                </>
              )}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
              <p className="text-sm font-semibold text-foreground">
                No stories match your search.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different keyword or university.
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
              {paginated.map((story, i) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/blog/real-life-stories/${story.id}`}
                    className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white text-base sm:text-lg font-bold drop-shadow leading-snug">
                          {story.name}
                        </h3>
                        <p className="text-white/85 text-xs flex items-center gap-1.5 mt-0.5">
                          <GraduationCap className="h-3 w-3" />
                          {story.role}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-3">
                        <MapPin className="h-3 w-3 text-emerald-600" />
                        {story.university}
                      </p>

                      <blockquote className="relative pl-4 border-l-2 border-emerald-500/60 text-xs sm:text-sm text-foreground italic leading-relaxed line-clamp-3 flex-1">
                        &ldquo;{story.quote}&rdquo;
                      </blockquote>

                      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 line-clamp-1">
                          {story.achievement}
                        </span>
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
