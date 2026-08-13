'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { ArrowRight, ExternalLink, Newspaper } from "lucide-react";
import { useGetBlogsQuery } from "@/redux/features/blogs/blogsApi";
import type { ApiBlogListItem } from "@/types/blogs";

const PLACEHOLDER = "/images/emergency-tran-bitoron-activities-4.jpg";

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/** Coverage by an outlet links out to their article; our own posts link to the write-up. */
function CoverageCard({ item, index }: { item: ApiBlogListItem; index: number }) {
  const isExternal = Boolean(item.sourceUrl);
  const href = item.sourceUrl ?? `/news/${item.slug}`;
  const className =
    "group block h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow";

  const inner = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <Image
          src={item.coverImage?.url ?? PLACEHOLDER}
          alt={item.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 truncate">
            {item.displayAuthorName ?? item.category?.name ?? "News"}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
            {formatDate(item.publishedAt)}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
            {item.title}
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

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src={PLACEHOLDER}
          alt="News and press"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            News &amp; Press
          </motion.h1>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 space-y-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Media coverage of Student Square&apos;s work across Bangladesh. Coverage by an outlet
            opens the original report on their own site.
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
                No coverage published yet.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                News about our work will appear here as it is published.
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
            <h2 className="text-xl font-bold text-foreground mb-3">For Media Inquiries</h2>
            <p className="text-sm text-muted-foreground mb-4">
              For press releases, interview requests, or media coverage inquiries, please contact
              our communications team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
