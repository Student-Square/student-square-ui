'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header/Header";
import PageHero from "@/components/common/PageHero";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { ArrowRight, ExternalLink, Newspaper } from "lucide-react";
import { useGetBlogsQuery } from "@/redux/features/blogs/blogsApi";
import type { ApiBlogListItem } from "@/types/blogs";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const PLACEHOLDER = "/images/emergency-tran-bitoron-activities-4.jpg";

/** Coverage by an outlet links out to their article; our own posts link to the write-up. */
function CoverageCard({ item, index }: { item: ApiBlogListItem; index: number }) {
  const { t, pick, date } = useLanguage();
  const title = pick(item.title, item.titleBn);
  const isExternal = Boolean(item.sourceUrl);
  const href = item.sourceUrl ?? `/news/${item.slug}`;
  const className =
    "group block h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow";

  const inner = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <Image
          src={item.coverImage?.url ?? PLACEHOLDER}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 truncate">
            {item.displayAuthorName ??
              (item.category ? pick(item.category.name, item.category.nameBn) : t("news.fallbackLabel"))}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
            {date(item.publishedAt, "long")}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
            {title}
          </h2>
          {isExternal ? (
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
          ) : (
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      viewport={{ once: true }}
    >
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={className}>
          {inner}
        </Link>
      )}
    </motion.div>
  );
}

export default function NewsPage() {
  const { data, isLoading } = useGetBlogsQuery({ categorySlug: "news", limit: 20 });
  const items = data?.data ?? [];
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Header />

      <PageHero imageSrc={PLACEHOLDER} imageAlt="News and press" imageAltKey="news.alt" title={t("news.title")} />

      {/* Grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 space-y-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            {t("news.intro")}
          </motion.p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800" />
                  <div className="p-4 space-y-2 bg-card border border-border">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <CoverageCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                {t("news.empty")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("news.emptyBody")}
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-3">{t("news.mediaInquiries")}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t("news.mediaBody")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              {t("common.getInTouch")}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
