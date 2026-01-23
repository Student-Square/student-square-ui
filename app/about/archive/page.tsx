'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Archive } from "lucide-react";

const archivedContent = [
  {
    title: "2023 Community Building Initiative",
    description: "Our community engagement programs that ran throughout 2023",
    year: "2023"
  },
  {
    title: "Educational Accessibility Drive 2022",
    description: "Campaign to increase access to education for underprivileged students",
    year: "2022"
  },
  {
    title: "Mental Health Awareness Program 2021",
    description: "Comprehensive mental health support and awareness initiative",
    year: "2021"
  },
  {
    title: "Digital Skills Training Series",
    description: "Programs designed to bridge the digital divide in communities",
    year: "2022"
  },
  {
    title: "Women Empowerment Initiative",
    description: "Focused programs on gender equality and women's rights",
    year: "2023"
  },
  {
    title: "Youth Leadership Conference 2020",
    description: "Inaugural conference bringing together young leaders from across regions",
    year: "2020"
  }
];

export default function ArchivePage() {
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
                Archive
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Explore our past initiatives, programs, and milestones that have shaped Student Square's journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline View */}
        <section className="flex-grow relative py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <div className="space-y-6">
              {archivedContent.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-8 top-2 h-5 w-5 rounded-full bg-emerald-600 border-4 border-background ring-1 ring-emerald-500/30" />
                  
                  {/* Timeline line */}
                  {index !== archivedContent.length - 1 && (
                    <div className="absolute -left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent" />
                  )}

                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 ml-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <Archive className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {item.year}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/30"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Since our founding, Student Square has grown from a small initiative to a global organization with a presence in over 40 countries. Our archive serves as a testament to the continuous evolution of our programs and our commitment to addressing emerging challenges.
                </p>
                <p>
                  We celebrate all the initiatives that came before us, as they have shaped who we are today and informed the direction of our future work. Each program, each campaign, and each community partnership has contributed to our understanding of how best to serve and empower individuals.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
