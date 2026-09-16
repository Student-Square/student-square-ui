'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import PageHero from "@/components/common/PageHero";
import Container from "@/components/common/Container";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { motion } from "motion/react";
import { fadeInWhileInView } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Vision & Mission is the featured banner above the grid, so it has no card
// here — listing it twice read as a duplicate.
const aboutCards = [
  {
    id: 2,
    titleKey: "about.card.whoWeAre",
    descriptionKey: "about.card.whoWeAreDesc",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    href: "/about/who-we-are",
  },
  {
    id: 3,
    titleKey: "about.card.whereWeWork",
    descriptionKey: "about.card.whereWeWorkDesc",
    image: "/images/student-square-at-kustia-district.jpg",
    href: "/about/where-we-work",
  },
  {
    id: 4,
    titleKey: "about.card.reports",
    descriptionKey: "about.card.reportsDesc",
    image: "/images/student-square-one-minute-investment-project.jpg",
    href: "/about/reports",
  },
  {
    id: 5,
    titleKey: "about.card.news",
    descriptionKey: "about.card.newsDesc",
    image: "/images/brain-battle-prize-ceremony.jpg",
    href: "/news",
  },
  {
    id: 6,
    titleKey: "about.card.archive",
    descriptionKey: "about.card.archiveDesc",
    image: "/images/emergency-tran-bitoron-activities.jpg",
    href: "/about/archive",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero — starts below the fixed navbar */}
      <PageHero
        imageSrc="/images/student-square-school-session.jpg"
        imageAlt={t("about.title")}
        title={t("about.title")}
        heightClassName="h-[30vh] sm:h-[40vh] lg:h-[50vh] min-h-[200px]"
      />

      {/* Intro */}
      <section className="bg-background py-12 lg:py-16">
        <Container className="text-center">
          <motion.div {...fadeInWhileInView}>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t("about.intro")}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Featured card */}
      <section className="bg-background pb-10">
        <Container>
          <motion.div {...fadeInWhileInView}>
            <Link href="/about/mission-vision">
              <div className="group relative overflow-hidden rounded-2xl border border-border cursor-pointer hover:border-emerald-500/50 transition-all duration-300">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src="/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg"
                    alt={t("about.visionMission")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{t("about.visionMission")}</h2>
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                      {t("about.explore")} <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Card Grid */}
      <section className="bg-background py-10 pb-20">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aboutCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href={card.href}>
                  <div className="group relative overflow-hidden rounded-xl border border-border hover:border-emerald-500/50 transition-all duration-300 cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={card.image}
                        alt={t(card.titleKey)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors text-sm">
                        {t(card.titleKey)}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">{t(card.descriptionKey)}</p>
                      <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        {t("common.learnMoreTitle")} <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
