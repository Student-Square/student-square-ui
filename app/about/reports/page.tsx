'use client';

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

const reports = [
  {
    title: "Annual Report 2024",
    description: "Comprehensive review of our impact and initiatives throughout 2024",
    year: "2024",
    type: "Annual Report",
    size: "2.4 MB"
  },
  {
    title: "Impact Assessment 2023",
    description: "Detailed analysis of our programs' effectiveness and community reach",
    year: "2023",
    type: "Impact Report",
    size: "1.8 MB"
  },
  {
    title: "Financial Transparency Report 2024",
    description: "Complete financial statements and fund allocation details",
    year: "2024",
    type: "Financial Report",
    size: "1.2 MB"
  },
  {
    title: "Sustainability Report 2023",
    description: "Our commitment to sustainable development goals",
    year: "2023",
    type: "Sustainability",
    size: "3.1 MB"
  }
];

export default function ReportsPage() {
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
                Reports & Financials
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                We believe in transparency. Access our annual reports, impact assessments, and financial statements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Reports Grid */}
        <section className="flex-grow relative py-12 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 2xl:max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group relative p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      {report.year}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-emerald-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-background/50 border border-border/30">
                        {report.type}
                      </span>
                      <span>{report.size}</span>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 p-2 text-emerald-600 hover:bg-emerald-600/20 transition-colors group-hover:scale-110 duration-300">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Transparency Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-xl border-2 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/30"
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Commitment to Transparency</h2>
              <p className="text-muted-foreground">
                Student Square is committed to transparency in all our operations. We regularly publish our reports and financial statements to demonstrate accountability to our donors, supporters, and the communities we serve. Our financial records are regularly audited by independent auditors to ensure accuracy and compliance with international standards.
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
