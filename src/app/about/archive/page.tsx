'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import { motion } from "motion/react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function ArchivePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <PageHero
        imageSrc="/images/emergency-tran-bitoron-activities.jpg"
        imageAlt={t("about.card.archive")}
        title={t("about.card.archive")}
      />

      {/* Content */}
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-dashed border-border p-8 text-center"
          >
            <p className="text-sm text-muted-foreground">{t("archive.empty")}</p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
