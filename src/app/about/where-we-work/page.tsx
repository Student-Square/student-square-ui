'use client';

import dynamic from "next/dynamic";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { NAVBAR_OFFSET } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { locations } from "@/data/locations";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const WorldMap = dynamic(() => import("@/components/maps/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-[#cde8f0]" style={{ height: 380 }} />
  ),
});

export default function WhereWeWorkPage() {
  const { t, pick } = useLanguage();

  return (
    <main className="min-h-screen">
      <Header />

      {/* World map */}
      <div className={`${NAVBAR_OFFSET} w-full`}>
        <WorldMap />
      </div>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{t("where.title")}</h1>
            <p className="text-base text-foreground leading-relaxed mb-4">
              {t("where.p1")}
            </p>
            <p className="text-base text-foreground leading-relaxed mb-4">
              {t("where.p2")}
            </p>
            <p className="text-base text-foreground leading-relaxed">
              {t("where.p3")}
            </p>
          </motion.div>

          {/* Country / city listings */}
          <div className="space-y-8">
            {locations.map((country, i) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/about/where-we-work/${country.slug}`}
                  className="inline-block text-xl font-bold text-foreground hover:text-emerald-600 transition-colors mb-2"
                >
                  {pick(country.name, country.nameBn)}
                </Link>

                {/* Two-column city grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                  {country.cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/about/where-we-work/${country.slug}/${city.slug}`}
                      className="text-sm text-foreground hover:text-emerald-600 transition-colors py-0.5"
                    >
                      {pick(city.name, city.nameBn)}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
