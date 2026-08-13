'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { services } from "@/data/services";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";

export default function WhatWeDoPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortTitle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero (no image banner) */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-32 -left-24 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-5"
              >
                <Sparkles className="h-3 w-3" />
                What We Do
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight"
              >
                Building futures through{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  counselling, advocacy, and action.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl"
              >
                Student Square is a non-profit that provides one-to-one counselling
                to students, bridges the understanding gap between students and
                parents, and promotes an educative, taboo-free, non-stereotypical
                environment within the family and community.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/get-involved"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
                >
                  Get involved
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 transition-colors"
                >
                  About us
                </Link>
              </motion.div>
            </div>

            {/* Stat cluster */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md lg:ml-auto"
            >
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <Users className="h-5 w-5 text-emerald-600 mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  350k+
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  students reached
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <Compass className="h-5 w-5 text-emerald-600 mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {services.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  core programmes
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-900/20 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                  Active in
                </p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-foreground leading-snug">
                  Rajshahi · Dhaka · Chittagong · UK
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-border bg-background/60 backdrop-blur sticky top-12 sm:top-14 lg:top-16 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programmes..."
                className="w-full pl-9 pr-9 py-2 text-sm rounded-lg bg-card border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
            <p className="text-xs text-muted-foreground ml-auto">
              Showing {filtered.length} of {services.length} programmes
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/40">
              <p className="text-sm font-semibold text-foreground">
                No programmes match your search.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {filtered.map((service, i) => (
                <motion.article
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/what-we-do/${service.slug}`}
                    className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur text-emerald-700 dark:text-emerald-300 border border-white/40 dark:border-emerald-800/60 shadow-sm">
                        Programme {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {service.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all whitespace-nowrap">
                          Learn more
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 p-6 sm:p-10 lg:p-12">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-black/10 blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100/90">
                  Join the movement
                </p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Help us reach more students across more communities.
                </h3>
                <p className="mt-3 text-sm text-emerald-50/90 leading-relaxed max-w-xl">
                  Whether you want to volunteer, partner with us, or support our
                  work financially — there is a place for you in this work.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-self-end">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  Donate now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/get-involved"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
