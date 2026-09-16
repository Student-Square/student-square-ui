'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { HERO_TOP_SCRIM } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getServiceBySlug, services } from "@/data/services";
import { siteConfig } from "@/config/site";
import { useImpactStats } from "@/components/common/ImpactStats";
import { useLanguage } from "@/components/i18n/LanguageProvider";
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
  const { lang, t, pick } = useLanguage();
  const impactStats = useImpactStats();
  const service = getServiceBySlug(slug);
  if (!service) redirect("/what-we-do");

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);
  const shareUrl = `${siteConfig.url}/what-we-do/${service.slug}`;
  const title = pick(service.title, service.titleBn);
  const body = lang === "BN" && service.bodyBn.length > 0 ? service.bodyBn : service.body;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="relative">
        {/* Full-bleed cover image. Runs to the top of the page with the
            transparent navbar floating over it. */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative left-1/2 w-screen -translate-x-1/2"
        >
          <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] min-h-[200px] max-h-[700px] overflow-hidden bg-muted">
            <img
              src={service.heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className={HERO_TOP_SCRIM} />
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
                {t("common.home")}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/what-we-do"
                className="hover:text-emerald-600 transition-colors"
              >
                {t("wwd.badge")}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground line-clamp-1">
                {pick(service.shortTitle, service.shortTitleBn)}
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
                {t("wwd.programme")}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed"
              >
                {pick(service.description, service.descriptionBn)}
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
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
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
              {body.map((para, i) => (
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
                {t("common.impactSoFar")}
              </p>
              <ul className="mt-3 space-y-2.5">
                {impactStats.map((s) => (
                  <li key={s.label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold">{s.value}</span>{" "}
                      <span className="text-muted-foreground">
                        {s.label}
                        {s.detail ? ` — ${s.detail}` : ""}
                      </span>
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
                {t("wwd.allProgrammes")}
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
                  <Share2 className="h-3.5 w-3.5" />
                  {t("common.share")}
                </span>
                {/* These were bare buttons with no handler, so they did nothing.
                    Real share URLs now, built from the canonical page address. */}
                {[
                  { label: t("common.shareFacebook"), Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                  { label: t("common.shareX"), Icon: Twitter, href: `https://x.com/intent/post?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}` },
                  { label: t("common.shareLinkedIn"), Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
                <button
                  type="button"
                  aria-label={t("common.copyLink")}
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
                    {t("wwd.exploreMore")}
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                    {t("wwd.otherProgrammes")}
                  </h2>
                </div>
                <Link
                  href="/what-we-do"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:gap-2.5 transition-all"
                >
                  {t("common.viewAll")}
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
                          alt={pick(s.title, s.titleBn)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 flex-1">
                          {pick(s.title, s.titleBn)}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                          {t("common.learnMore")}
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
