"use client";

import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { useGetCampaignsQuery } from "@/redux/features/campaigns/campaignsApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useGetCampaignsQuery({ status: "ACTIVE" });
  const { t, pick } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative mt-12 sm:mt-14 lg:mt-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 mb-3">
            {t("projects.eyebrow")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t("projects.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t("projects.intro")}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(projects ?? []).map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {project.coverImage && (
                      <img
                        src={project.coverImage.url}
                        alt={project.coverImage.alt ?? pick(project.title, project.titleBn)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                      {pick(project.title, project.titleBn)}
                    </h2>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {pick(project.summary, project.summaryBn)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      {t("projects.view")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
