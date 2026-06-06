"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Compass,
  Home,
  Users,
} from "lucide-react";

const SUGGESTIONS = [
  { label: "Home", href: "/", icon: Home },
  { label: "What We Do", href: "/what-we-do", icon: Compass },
  { label: "Blog & Stories", href: "/blog", icon: BookOpen },
  { label: "Real Life Stories", href: "/blog/real-life-stories", icon: Users },
] as const;

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Soft backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-72 h-72 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 mb-5"
        >
          Error 404
        </motion.p>

        {/* The big number */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 text-7xl sm:text-8xl md:text-9xl leading-[0.9] mb-4"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          404
        </motion.h1>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
        >
          Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed"
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Try one of the destinations below.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
          >
            <Home className="h-4 w-4" />
            Take me home
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 sm:mt-12"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Quick links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-xs sm:text-sm font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
