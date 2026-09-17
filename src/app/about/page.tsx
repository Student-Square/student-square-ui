'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const sections = [
  {
    id: "mission",
    titleKey: "about.visionMission",
    descriptionKey: "about.visionMissionDesc",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    href: "/about/mission-vision",
  },
  {
    id: "who",
    titleKey: "about.card.whoWeAre",
    descriptionKey: "about.card.whoWeAreDesc",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    href: "/about/who-we-are",
  },
  {
    id: "where",
    titleKey: "about.card.whereWeWork",
    descriptionKey: "about.card.whereWeWorkDesc",
    image: "/images/student-square-at-kustia-district.jpg",
    href: "/about/where-we-work",
  },
  {
    id: "reports",
    titleKey: "about.card.reports",
    descriptionKey: "about.card.reportsDesc",
    image: "/images/student-square-one-minute-investment-project.jpg",
    href: "/about/reports",
  },
  {
    id: "news",
    titleKey: "about.card.news",
    descriptionKey: "about.card.newsDesc",
    image: "/images/brain-battle-prize-ceremony.jpg",
    href: "/news",
  },
  {
    id: "archive",
    titleKey: "about.card.archive",
    descriptionKey: "about.card.archiveDesc",
    image: "/images/emergency-tran-bitoron-activities.jpg",
    href: "/about/archive",
  },
];

export default function AboutPage() {
  const { t, digits } = useLanguage();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((section) =>
      [t(section.titleKey), t(section.descriptionKey)].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query, t]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className={`relative ${NAVBAR_PAD_TOP} overflow-hidden border-b border-border`}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl sm:h-96 sm:w-96 dark:bg-emerald-500/10" />
          <div className="absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl dark:bg-emerald-400/10" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                <Sparkles className="h-3 w-3" />
                {t("about.badge")}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                {t("about.headingLead")}{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  {t("about.headingAccent")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {t("about.intro")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/what-we-do"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 transition-colors hover:bg-emerald-700"
                >
                  {t("about.seeWork")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about/who-we-are"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-emerald-500/60 hover:text-emerald-600"
                >
                  {t("about.card.whoWeAre")}
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid max-w-md grid-cols-2 gap-3 sm:gap-4 lg:ml-auto"
            >
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <BookOpen className="mb-3 h-5 w-5 text-emerald-600" />
                <p className="text-2xl font-bold text-foreground sm:text-3xl">
                  {digits(String(sections.length).padStart(2, "0"))}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t("about.sectionsLabel")}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <Compass className="mb-3 h-5 w-5 text-emerald-600" />
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{digits("4")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("wwd.activeIn")}</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/60 dark:bg-emerald-900/20 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                  {t("wwd.activeIn")}
                </p>
                <p className="mt-1 text-base font-semibold leading-snug text-foreground sm:text-lg">
                  {t("wwd.activePlaces")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="sticky top-12 z-10 border-b border-border bg-background/60 backdrop-blur sm:top-14 lg:top-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-12">
          <div className="relative min-w-[200px] max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("about.searchPlaceholder")}
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("common.clearSearch")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="ml-auto text-xs text-muted-foreground">
            {t("about.showing", { shown: filtered.length, total: sections.length })}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center">
              <p className="text-sm font-semibold text-foreground">{t("about.noMatch")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("about.tryKeyword")}</p>
            </div>
          ) : (
            <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {filtered.map((section, i) => (
                <motion.article
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={section.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={section.image}
                        alt={t(section.titleKey)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-800/60 dark:bg-black/80 dark:text-emerald-300">
                        {t("about.sectionNumber", {
                          n: digits(String(i + 1).padStart(2, "0")),
                        })}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-600 sm:text-lg">
                        {t(section.titleKey)}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {t(section.descriptionKey)}
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-emerald-600 transition-all group-hover:gap-2.5">
                          {t("common.learnMore")}
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

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 dark:from-emerald-700 dark:to-emerald-600 sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100/90">
                  {t("wwd.joinEyebrow")}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {t("wwd.joinHeading")}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/90">
                  {t("wwd.joinBody")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:justify-self-end">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
                >
                  {t("wwd.donateNow")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("wwd.volunteer")}
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
