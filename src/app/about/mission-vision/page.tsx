'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";

export default function MissionVisionPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[55vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg"
          alt="Our Vision & Mission"
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
            Our Vision &amp; Mission
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-12">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-3">Vision</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our vision is to foster an inclusive society where every individual's potential is nurtured and
              developed, free from any form of discrimination.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-3">Mission</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our mission is to empower individuals through education and skill development, creating a society
              free from discrimination and equipped to tackle global challenges collectively such as poverty,
              climate change, inequality, and health crises.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-3">Legal Status</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Registered under The Trust Act 1908 in Bangladesh.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Inclusivity", desc: "We believe in creating opportunities for everyone." },
                { title: "Empowerment", desc: "We enable individuals to achieve their full potential." },
                { title: "Sustainability", desc: "We work towards long-term positive impact." },
                { title: "Integrity", desc: "We operate with transparency and ethical standards." },
              ].map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border p-5 hover:border-emerald-500/50 transition-colors"
                >
                  <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
