'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

const pressReleases = [
  {
    title: "Student Square Launches New Mentorship Program",
    date: "January 2025",
    description: "We're excited to announce the launch of our expanded mentorship initiative reaching 500+ young individuals.",
    source: "Student Square News"
  },
  {
    title: "Award for Excellence in Community Development",
    date: "December 2024",
    description: "Student Square recognized for outstanding contribution to community empowerment in South Asia.",
    source: "Global Impact Awards"
  },
  {
    title: "Expanding Operations to 10 New Countries",
    date: "November 2024",
    description: "Announcing our expansion plans to establish programs in 10 new countries across Africa and Asia.",
    source: "Student Square News"
  },
  {
    title: "Partnership with UNESCO on Education Initiative",
    date: "October 2024",
    description: "Student Square partners with UNESCO to expand educational access for underprivileged communities.",
    source: "UNESCO Press Release"
  }
];

export default function PressPage() {
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
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold tracking-tight text-foreground mb-6">
                Press & Media
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Latest news and media coverage about Student Square and our impact initiatives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="flex-grow relative py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          {release.source}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-emerald-600 transition-colors">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground">{release.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact for Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/30"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">For Media Inquiries</h2>
              <p className="text-muted-foreground mb-4">
                For press releases, interview requests, or media coverage inquiries, please contact our communications team.
              </p>
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                Get in Touch
                <ExternalLink className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
