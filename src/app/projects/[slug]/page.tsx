'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import {
  useGetCampaignBySlugQuery,
  useGetCampaignsQuery,
} from "@/redux/features/campaigns/campaignsApi";
import { ChevronRight, ArrowRight } from "lucide-react";

/** Blank-line separated paragraphs, matching how the seed stores descriptions. */
function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: project,
    isLoading,
    isError,
  } = useGetCampaignBySlugQuery(slug, { skip: !slug });
  const { data: allProjects } = useGetCampaignsQuery({ status: "ACTIVE" });

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="mt-12 sm:mt-14 lg:mt-16 h-[40vh] min-h-[240px] w-full animate-pulse bg-muted" />
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (isError || !project) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="bg-background py-24">
          <div className="mx-auto max-w-3xl px-6 text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Project not found
            </h1>
            <p className="text-sm text-muted-foreground">
              This project may have been renamed or is no longer running.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline"
            >
              Back to Home
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const related = (allProjects ?? [])
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);
  const paragraphs = toParagraphs(project.description);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[40vh] min-h-[240px] w-full overflow-hidden bg-muted">
        {project.coverImage && (
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt ?? project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug"
          >
            {project.title}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-emerald-600 transition-colors">Our Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{project.title}</span>
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-base text-foreground font-medium leading-relaxed">
              {project.summary}
            </p>
            {paragraphs.map((para, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
            ))}
          </motion.div>

          {/* Related projects */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-base font-bold text-foreground mb-4">Other Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/projects/${r.slug}`}
                    className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {r.coverImage && (
                        <img
                          src={r.coverImage.url}
                          alt={r.coverImage.alt ?? r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
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
