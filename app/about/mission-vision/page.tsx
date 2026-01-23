'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MissionVisionPage() {
  return (
    <main className="min-h-screen relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Aurora 
          colorStops={["#10B981", "#030712", "#10B981"]}
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/about">
                <button className="mb-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold">
                  <ArrowLeft className="h-4 w-4" />
                  Back to About
                </button>
              </Link>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold tracking-tight text-foreground">
                Our Vision & Mission
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="flex-grow relative py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our vision is to foster an inclusive society where every individual's potential is nurtured and developed, free from any form of discrimination.
                </p>
              </motion.div>

              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to empower individuals through education and skill development, creating a society free from discrimination and equipped to tackle global challenges collectively such as poverty, climate change, inequality, and health crises.
                </p>
              </motion.div>

              {/* Legal Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">Legal Status</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Registered under The Trust Act 1908 in Bangladesh, Student Square operates as a registered non-profit organization dedicated to serving communities.
                </p>
              </motion.div>

              {/* Core Values */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Inclusivity", desc: "We believe in creating opportunities for everyone" },
                    { title: "Empowerment", desc: "We enable individuals to achieve their full potential" },
                    { title: "Sustainability", desc: "We work towards long-term positive impact" },
                    { title: "Integrity", desc: "We operate with transparency and ethical standards" }
                  ].map((value, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 transition-all duration-300"
                    >
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
