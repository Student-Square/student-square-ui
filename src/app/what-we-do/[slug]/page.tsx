'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getServiceBySlug, services } from "@/data/services";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  if (!service) redirect("/what-we-do");

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Navbar spacer */}
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        {/* Full-bleed cover image — sits directly under the navbar */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative left-1/2 w-screen -translate-x-1/2"
        >
          <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] min-h-[200px] max-h-[700px] overflow-hidden bg-muted">
            <img
              src={service.heroImage}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            {/* Soft fade at the bottom into the page background */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" />
          </div>
        </motion.section>

        {/* Header section */}
        <section className="pt-8 sm:pt-10 lg:pt-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12">
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
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/what-we-do"
                className="hover:text-emerald-600 transition-colors"
              >
                What We Do
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground line-clamp-1">
                {service.shortTitle}
              </span>
            </motion.div>

            {/* Header text — stacked, max-w constrained */}
            <div className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider"
              >
                Programme
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed"
              >
                {service.description}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats strip — constrained container */}
        <section className="mt-8 sm:mt-10 lg:mt-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {service.stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-emerald-500/40 transition-colors"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-foreground leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {service.body.map((para, i) => (
                <p
                  key={i}
                  className={`text-base text-foreground leading-[1.85] ${
                    i === 0
                      ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-emerald-600 first-letter:leading-none"
                      : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                Why this matters
              </p>
              <ul className="mt-3 space-y-2.5">
                {service.stats.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold">{s.value}</span>{" "}
                      <span className="text-muted-foreground">{s.label}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Share + back */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap"
            >
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All programmes
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </span>
                <button
                  type="button"
                  aria-label="Share on Facebook"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share on Twitter"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share on LinkedIn"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Copy link"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Other programmes */}
        {others.length > 0 && (
          <section className="pb-16 sm:pb-20 lg:pb-24 border-t border-border pt-12 sm:pt-14 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-900/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Explore more
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                    Other programmes
                  </h2>
                </div>
                <Link
                  href="/what-we-do"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:gap-2.5 transition-all"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {others.map((s, i) => (
                  <motion.article
                    key={s.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/what-we-do/${s.slug}`}
                      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 flex-1">
                          {s.title}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                          Learn more
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
