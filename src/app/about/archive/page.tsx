'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import { motion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useGetPageSectionsQuery } from "@/redux/features/content/contentApi";
import { ARCHIVE_PAGE_SLUG, ARCHIVE_SECTION_KEY, parseArchiveItems } from "@/lib/archive";

export default function ArchivePage() {
  const { t, stored } = useLanguage();
  const { data, isLoading } = useGetPageSectionsQuery(ARCHIVE_PAGE_SLUG);
  const section = data?.find((row) => row.sectionKey === ARCHIVE_SECTION_KEY);
  const items = parseArchiveItems(section?.content);

  return (
    <main className="min-h-screen">
      <Header />

      <PageHero
        imageSrc="/images/emergency-tran-bitoron-activities.jpg"
        imageAlt={t("about.card.archive")}
        title={t("about.card.archive")}
      />

      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("archive.intro")}
            </p>
          </motion.div>

          {!isLoading && items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-xl border border-dashed border-border p-8 text-center"
            >
              <p className="text-sm text-muted-foreground">{t("archive.empty")}</p>
            </motion.div>
          )}

          {items.length > 0 && (
            <ol className="space-y-6">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  {item.year && (
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                      {item.year}
                    </p>
                  )}
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    {stored(item.title, item.titleBn)}
                  </h2>
                  {(item.description || item.descriptionBn) && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {stored(item.description, item.descriptionBn)}
                    </p>
                  )}
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
