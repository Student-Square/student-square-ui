'use client';

import dynamic from "next/dynamic";
import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import { NAVBAR_OFFSET } from "@/components/common/Header/navbarHeight";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getCountryBySlug } from "@/data/locations";
import ImpactStats from "@/components/common/ImpactStats";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const CountryMap = dynamic(
  () => import("@/components/maps/CountryMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-white" style={{ minHeight: 360 }}>
        <div className="h-2 w-full bg-muted animate-pulse" />
      </div>
    ),
  }
);

export default function CountryPage() {
  const { country: slug } = useParams<{ country: string }>();
  const { t, pick } = useLanguage();
  const country = getCountryBySlug(slug);
  if (!country) redirect("/about/where-we-work");
  const countryName = pick(country.name, country.nameBn);
  const description = pick(country.description, country.descriptionBn);

  const half = Math.ceil(country.cities.length / 2);
  const col1 = country.cities.slice(0, half);
  const col2 = country.cities.slice(half);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Country choropleth map */}
      <div className={`${NAVBAR_OFFSET} w-full border-b border-border`}>
        <CountryMap country={slug} />
      </div>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/about/where-we-work" className="hover:text-emerald-600 transition-colors">
              {t("where.title")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{countryName}</span>
          </div>

          {/* Country name + description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-4">{countryName}</h1>
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

          {/* City listing */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-3">{countryName}</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              <div className="space-y-0.5">
                {col1.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/about/where-we-work/${country.slug}/${city.slug}`}
                    className="block text-sm text-foreground hover:text-emerald-600 transition-colors py-0.5"
                  >
                    {pick(city.name, city.nameBn)}
                  </Link>
                ))}
              </div>
              <div className="space-y-0.5">
                {col2.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/about/where-we-work/${country.slug}/${city.slug}`}
                    className="block text-sm text-foreground hover:text-emerald-600 transition-colors py-0.5"
                  >
                    {pick(city.name, city.nameBn)}
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
