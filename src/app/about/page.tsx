'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const aboutCards = [
  {
    id: 1,
    title: "Our Vision and Mission",
    description: "Learn about our vision to foster an inclusive society",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    href: "/about/mission-vision",
  },
  {
    id: 2,
    title: "Who We Are",
    description: "Discover the team and values behind Student Square",
    image: "/images/student-square-introduction-presention-by-Humayra-Nasrin.jpg",
    href: "/about/who-we-are",
  },
  {
    id: 3,
    title: "Where We Work",
    description: "Explore our global presence and impact",
    image: "/images/student-square-at-kustia-district.jpg",
    href: "/about/where-we-work",
  },
  {
    id: 4,
    title: "Annual Reports & Financials",
    description: "Access our annual reports and financial transparency",
    image: "/images/student-square-one-minute-investment-project.jpg",
    href: "/about/reports",
  },
  {
    id: 5,
    title: "Press",
    description: "Media coverage and news about Student Square",
    image: "/images/brain-battle-prize-ceremony.jpg",
    href: "/about/press",
  },
  {
    id: 6,
    title: "Archive",
    description: "Browse past initiatives and historical content",
    image: "/images/emergency-tran-bitoron-activities.jpg",
    href: "/about/archive",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero — starts below the fixed navbar */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[30vh] sm:h-[40vh] lg:h-[50vh] min-h-[200px] w-full overflow-hidden">
        <img
          src="/images/student-square-school-session.jpg"
          alt="About Us"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 px-6 pb-10 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            About Us
          </motion.h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Student Square is a non-profit organization devoted to building an inclusive society where every
              individual's potential is nurtured and developed, free from discrimination.
            </p>
            <Link href="/about/who-we-are">
              <button className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-6 py-2 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-accent transition-colors">
                Our People
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured card */}
      <section className="bg-background pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/about/mission-vision">
              <div className="group relative overflow-hidden rounded-2xl border border-border cursor-pointer hover:border-emerald-500/50 transition-all duration-300">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src="/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg"
                    alt="Our Vision and Mission"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Our Vision and Mission</h2>
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="bg-background py-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
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
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors text-sm">
                        {card.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">{card.description}</p>
                      <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
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
