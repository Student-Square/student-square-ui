'use client';

import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";

export default function WhatWeDoPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[40vh] min-h-[240px] w-full overflow-hidden">
        <img
          src="/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg"
          alt="What We Do"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase"
          >
            What We Do
          </motion.h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">

          {/* Logo + description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <img
                src="/images/ss-logo.png"
                alt="Student Square"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
              Student Square is a non-profit organization that provides one-to-one counseling to students
              which empower them with decision making skills in academic and career paths. We bridge the
              understanding gap between students and parents through counseling on both ends. We aim to
              promote an educative, taboo-free, non-stereotypical environment within the family.
            </p>
          </motion.div>

          {/* Service cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/what-we-do/${service.slug}`}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex items-end justify-between gap-2">
                    <h2 className="text-sm font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors">
                      {service.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
