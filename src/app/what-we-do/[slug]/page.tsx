'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getServiceBySlug, services } from "@/data/services";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  if (!service) redirect("/what-we-do");

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
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
            {service.title}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/what-we-do" className="hover:text-emerald-600 transition-colors">
              What We Do
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{service.shortTitle}</span>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-foreground leading-relaxed">{service.description}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 border-t border-b border-border py-8"
          >
            {service.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-start gap-1 mt-1">
                  <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Body paragraphs */}
          {service.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
              className="text-base text-foreground leading-relaxed"
            >
              {para}
            </motion.p>
          ))}

          {/* Other services */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">More from What We Do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/what-we-do/${s.slug}`}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex items-end justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors">
                      {s.shortTitle}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
