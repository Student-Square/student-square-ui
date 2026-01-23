'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WhoWeArePage() {
  const teamMembers = [
    { name: "Leadership Team", role: "Guiding our organization", count: "5+" },
    { name: "Program Coordinators", role: "Implementing initiatives", count: "50+" },
    { name: "Counselors & Mentors", role: "Supporting individuals", count: "100+" },
    { name: "Volunteers", role: "Community advocates", count: "500+" }
  ];

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
                Who We Are
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Student Square is made up of passionate individuals dedicated to creating positive change. Our diverse team brings together experience, compassion, and commitment to our mission.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="flex-grow relative py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <div className="space-y-12">
              {/* Team Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 transition-all duration-300"
                    >
                      <div className="text-3xl font-bold text-emerald-600 mb-2">{member.count}</div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Mission-driven Approach */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">What Drives Us</h2>
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every member of Student Square is driven by a shared passion: to create lasting positive change in the lives of individuals and communities. We believe that education and empowerment are the keys to building a more inclusive world.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our team works across various functions—from program delivery to community engagement, research, and advocacy—all united by our commitment to our vision and mission.
                  </p>
                </div>
              </motion.div>

              {/* Diversity and Inclusion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Diversity & Inclusion</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are committed to building a diverse and inclusive organization. Our team represents different backgrounds, experiences, and perspectives, which strengthens our ability to serve communities effectively and understand the challenges we aim to address.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
