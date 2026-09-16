'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import { motion } from "motion/react";
import { Archive } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// Titles and descriptions live in the dictionary as archive.itemN.*.
const archivedContent = [
  { n: 1, year: 2023 },
  { n: 2, year: 2022 },
  { n: 3, year: 2021 },
  { n: 4, year: 2022 },
  { n: 5, year: 2023 },
  { n: 6, year: 2020 },
];

export default function ArchivePage() {
  const { t, num } = useLanguage();

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

          <div className="space-y-4">
            {archivedContent.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group flex items-start gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/50 transition-colors"
              >
                <Archive className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1">{num(item.year, false)}</div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
                    {t(`archive.item${item.n}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t(`archive.item${item.n}.desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-3">{t("archive.journey")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("archive.journeyBody")}
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
