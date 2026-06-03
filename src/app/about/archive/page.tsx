'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { Archive } from "lucide-react";

const archivedContent = [
  { title: "2023 Community Building Initiative", description: "Our community engagement programs that ran throughout 2023", year: "2023" },
  { title: "Educational Accessibility Drive 2022", description: "Campaign to increase access to education for underprivileged students", year: "2022" },
  { title: "Mental Health Awareness Program 2021", description: "Comprehensive mental health support and awareness initiative", year: "2021" },
  { title: "Digital Skills Training Series", description: "Programs designed to bridge the digital divide in communities", year: "2022" },
  { title: "Women Empowerment Initiative", description: "Focused programs on gender equality and women's rights", year: "2023" },
  { title: "Youth Leadership Conference 2020", description: "Inaugural conference bringing together young leaders from across regions", year: "2020" },
];

export default function ArchivePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[35vh] sm:h-[45vh] lg:h-[55vh] min-h-[220px] w-full overflow-hidden">
        <img
          src="/images/emergency-tran-bitoron-activities.jpg"
          alt="Archive"
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
            Archive
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
              Explore our past initiatives, programs, and milestones that have shaped Student Square's journey from a
              small initiative to a growing international organization.
            </p>
          </motion.div>

          <div className="space-y-4">
            {archivedContent.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group flex items-start gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/50 transition-colors"
              >
                <Archive className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1">{item.year}</div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
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
            <h2 className="text-xl font-bold text-foreground mb-3">Our Journey</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Since our founding, Student Square has grown from a small initiative to an organization with presence
              across multiple countries. Each program, campaign, and community partnership has contributed to our
              understanding of how best to serve and empower individuals.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
