'use client';

import dynamic from "next/dynamic";
import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { NAVBAR_OFFSET } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getCityBySlug } from "@/data/locations";
import ImpactStats from "@/components/common/ImpactStats";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const CountryMap = dynamic(
  () => import("@/components/maps/CountryMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-white" style={{ minHeight: 340 }}>
        <div className="h-2 w-full bg-muted animate-pulse" />
      </div>
    ),
  }
);

export default function CityPage() {
  const { country: countrySlug, city: citySlug } = useParams<{ country: string; city: string }>();
  const { t, pick } = useLanguage();
  const result = getCityBySlug(countrySlug, citySlug);
  if (!result) redirect(`/about/where-we-work/${countrySlug}`);

  const { country, city } = result;
  const countryName = pick(country.name, country.nameBn);
  const cityName = pick(city.name, city.nameBn);
  const description = pick(city.description, city.descriptionBn);
  const half = Math.ceil(country.cities.length / 2);
  const col1 = country.cities.slice(0, half);
  const col2 = country.cities.slice(half);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className={`relative ${NAVBAR_OFFSET} h-[36vh] min-h-[220px] w-full overflow-hidden`}>
        <img
          src={city.image}
          alt={cityName}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            {cityName}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/about/where-we-work" className="hover:text-emerald-600 transition-colors">
              {t("where.title")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/about/where-we-work/${country.slug}`}
              className="hover:text-emerald-600 transition-colors"
            >
              {countryName}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{cityName}</span>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-foreground leading-relaxed">{description}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ImpactStats />
          </motion.div>

          {/* Second paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-foreground leading-relaxed">{description}</p>
          </motion.div>

          {/* Mini country map — highlights current city's district */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-border"
          >
            <CountryMap country={countrySlug} />
          </motion.div>

          {/* All cities in this country */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-3">{countryName}</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              <div className="space-y-0.5">
                {col1.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/about/where-we-work/${country.slug}/${c.slug}`}
                    className={`block text-sm py-0.5 transition-colors ${
                      c.slug === city.slug
                        ? "font-semibold text-emerald-600"
                        : "text-foreground hover:text-emerald-600"
                    }`}
                  >
                    {pick(c.name, c.nameBn)}
                  </Link>
                ))}
              </div>
              <div className="space-y-0.5">
                {col2.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/about/where-we-work/${country.slug}/${c.slug}`}
                    className={`block text-sm py-0.5 transition-colors ${
                      c.slug === city.slug
                        ? "font-semibold text-emerald-600"
                        : "text-foreground hover:text-emerald-600"
                    }`}
                  >
                    {pick(c.name, c.nameBn)}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
