'use client';

import dynamic from "next/dynamic";
import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getCountryBySlug } from "@/data/locations";
import { ChevronRight } from "lucide-react";

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
  const country = getCountryBySlug(slug);
  if (!country) redirect("/about/where-we-work");

  const half = Math.ceil(country.cities.length / 2);
  const col1 = country.cities.slice(0, half);
  const col2 = country.cities.slice(half);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Country choropleth map */}
      <div className="mt-12 sm:mt-14 lg:mt-16 w-full border-b border-border">
        <CountryMap country={slug} />
      </div>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/about/where-we-work" className="hover:text-emerald-600 transition-colors">
              Where We Work
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{country.name}</span>
          </div>

          {/* Country name + description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-4">{country.name}</h1>
            <p className="text-base text-foreground leading-relaxed">{country.description}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 border-t border-b border-border py-8"
          >
            {country.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-start gap-1 mt-1">
                  <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Second paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-foreground leading-relaxed">{country.description}</p>
          </motion.div>

          {/* City listing */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-3">{country.name}</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              <div className="space-y-0.5">
                {col1.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/about/where-we-work/${country.slug}/${city.slug}`}
                    className="block text-sm text-foreground hover:text-emerald-600 transition-colors py-0.5"
                  >
                    {city.name}
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
                    {city.name}
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
