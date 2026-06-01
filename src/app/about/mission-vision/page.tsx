'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetEditablePageQuery } from "@/redux/features/content/contentApi";
import type { ApiEditablePage } from "@/types/content";
import EditPageButton from "@/components/admin/EditPageButton";

const PAGE_SLUG = "about-mission-vision" as const;

/**
 * Fallback content — used while the API is loading, or if the page row
 * doesn't exist yet (first render before the admin has saved anything).
 * Keeps the page visually correct even before the backend is wired up.
 */
const FALLBACK: ApiEditablePage = {
  slug: PAGE_SLUG,
  heroTitle: "Our Vision & Mission",
  bannerUrl: "/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg",
  bannerAlt: "Our Vision & Mission",
  sections: [
    {
      id: "fallback-1",
      heading: "Vision",
      body:
        "Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination.",
      order: 1,
    },
    {
      id: "fallback-2",
      heading: "Mission",
      body:
        "Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.",
      order: 2,
    },
    {
      id: "fallback-3",
      heading: "Legal Status",
      body: "Registered under The Trust Act 1908 in Bangladesh.",
      order: 3,
    },
  ],
  updatedAt: "",
};

export default function MissionVisionPage() {
  const { data, isError } = useGetEditablePageQuery(PAGE_SLUG);

  // Use API data when it's there; otherwise fall back to the canned content.
  // (isLoading also returns fallback for now — same shape, just static.)
  const page: ApiEditablePage = data ?? FALLBACK;
  // Backend may omit `sections` on a freshly-created row — coerce to [] then
  // fall back to the canned content if the result is empty.
  const apiSections = Array.isArray(data?.sections) ? data!.sections : [];
  const sections =
    isError || !data || apiSections.length === 0
      ? FALLBACK.sections
      : apiSections;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[55vh] min-h-[320px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.bannerUrl ?? FALLBACK.bannerUrl ?? ""}
          alt={page.bannerAlt ?? page.heroTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 px-6 pb-10 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            {page.heroTitle}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-12">
          {sortedSections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {section.heading}
              </h2>
              {/* Body is plain text; preserve line breaks but escape HTML. */}
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Visible only to admins/editors */}
      <EditPageButton slug={PAGE_SLUG} />
    </main>
  );
}
