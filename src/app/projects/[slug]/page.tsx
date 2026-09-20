'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { HERO_TOP_SCRIM } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import {
  useGetCampaignBySlugQuery,
  useGetCampaignsQuery,
} from "@/redux/features/campaigns/campaignsApi";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Blank-line separated paragraphs, matching how the seed stores descriptions. */
function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, pick } = useLanguage();
  const {
    data: project,
    isLoading,
    isError,
  } = useGetCampaignBySlugQuery(slug, { skip: !slug });
  const { data: allProjects } = useGetCampaignsQuery({ status: "ACTIVE" });

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header overDarkHero />
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <div className="h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] min-h-[200px] max-h-[700px] w-full animate-pulse bg-muted" />
        </div>
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
              {t("projects.notFound")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("projects.notFoundBody")}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline"
            >
              {t("projects.backHome")}
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
  const title = pick(project.title, project.titleBn);
  const paragraphs = toParagraphs(pick(project.description, project.descriptionBn));

  return (
    <main className="min-h-screen">
      <Header overDarkHero />

      {/* Full-bleed cover — runs to the top under the transparent navbar */}
      <section className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] min-h-[200px] max-h-[700px] overflow-hidden bg-muted">
          {project.coverImage && (
            <img
              src={project.coverImage.url}
              alt={project.coverImage.alt ?? title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className={HERO_TOP_SCRIM} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-emerald-600 transition-colors">{t("common.home")}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-emerald-600 transition-colors">{t("projects.title")}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{title}</span>
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
              {pick(project.summary, project.summaryBn)}
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
              <h2 className="text-base font-bold text-foreground mb-4">{t("projects.other")}</h2>
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
                          alt={r.coverImage.alt ?? pick(r.title, r.titleBn)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-3 flex items-end justify-between gap-2">
                      <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {pick(r.title, r.titleBn)}
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
