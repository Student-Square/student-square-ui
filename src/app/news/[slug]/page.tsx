'use client';

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useGetBlogBySlugQuery, useGetBlogsQuery } from "@/redux/features/blogs/blogsApi";

const PLACEHOLDER = "/images/emergency-tran-bitoron-activities-4.jpg";

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: item, isLoading, isError } = useGetBlogBySlugQuery(slug);
  const { data: allNews } = useGetBlogsQuery({ categorySlug: "news", limit: 4 });

  if (isError) {
    router.replace("/news");
    return null;
  }

  const related = allNews?.data?.filter((n) => n.slug !== slug).slice(0, 2) ?? [];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[40vh] min-h-[240px] w-full overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : (
          <Image
            src={item?.coverImage?.url ?? PLACEHOLDER}
            alt={item?.title ?? "News"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        {item && (
          <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug"
            >
              {item.title}
            </motion.h1>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/news" className="hover:text-emerald-600 transition-colors">News</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{item?.title}</span>
          </div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 flex-wrap"
          >
            {item?.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {item.category.name}
              </span>
            )}
            {item?.publishedAt && (
              <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
            )}
          </motion.div>

          {/* Body */}
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {item?.body?.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
              ))}
            </motion.div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-base font-bold text-foreground mb-4">More News</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/news/${r.slug}`}
                    className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      <Image
                        src={r.coverImage?.url ?? PLACEHOLDER}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-3 flex items-end justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
