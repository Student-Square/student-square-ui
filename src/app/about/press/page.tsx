'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { Calendar, ExternalLink } from "lucide-react";

const pressReleases = [
  {
    title: "Student Square Launches New Mentorship Program",
    date: "January 2025",
    description: "We're excited to announce the launch of our expanded mentorship initiative reaching 500+ young individuals.",
    source: "Student Square News",
  },
  {
    title: "Award for Excellence in Community Development",
    date: "December 2024",
    description: "Student Square recognized for outstanding contribution to community empowerment in South Asia.",
    source: "Global Impact Awards",
  },
  {
    title: "Expanding Operations to 10 New Countries",
    date: "November 2024",
    description: "Announcing our expansion plans to establish programs in 10 new countries across Africa and Asia.",
    source: "Student Square News",
  },
  {
    title: "Partnership with UNESCO on Education Initiative",
    date: "October 2024",
    description: "Student Square partners with UNESCO to expand educational access for underprivileged communities.",
    source: "UNESCO Press Release",
  },
];

export default function PressPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[55vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="/images/brain-battle-prize-ceremony.jpg"
          alt="Press"
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
            Press
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-muted-foreground leading-relaxed">
              Latest news and media coverage about Student Square and our impact initiatives around the world.
            </p>
          </motion.div>

          <div className="space-y-4">
            {pressReleases.map((release, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs text-muted-foreground">{release.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      {release.source}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{release.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-3">For Media Inquiries</h2>
            <p className="text-sm text-muted-foreground mb-4">
              For press releases, interview requests, or media coverage inquiries, please contact our communications team.
            </p>
            <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              Get in Touch
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
