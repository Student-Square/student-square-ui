'use client';

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { Download, FileText } from "lucide-react";

const reports = [
  {
    title: "Annual Report 2024",
    description: "Comprehensive review of our impact and initiatives throughout 2024",
    year: "2024",
    type: "Annual Report",
    size: "2.4 MB",
  },
  {
    title: "Impact Assessment 2023",
    description: "Detailed analysis of our programs' effectiveness and community reach",
    year: "2023",
    type: "Impact Report",
    size: "1.8 MB",
  },
  {
    title: "Financial Transparency Report 2024",
    description: "Complete financial statements and fund allocation details",
    year: "2024",
    type: "Financial Report",
    size: "1.2 MB",
  },
  {
    title: "Sustainability Report 2023",
    description: "Our commitment to sustainable development goals",
    year: "2023",
    type: "Sustainability",
    size: "3.1 MB",
  },
];

export default function ReportsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[55vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="/images/student-square-one-minute-investment-project.jpg"
          alt="Annual Reports & Financials"
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
            Annual Reports &amp; Financials
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
            <p className="text-base text-muted-foreground leading-relaxed">
              We believe in transparency. Access our annual reports, impact assessments, and financial statements to
              understand how we allocate resources and measure our progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reports.map((report, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border p-5 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="h-6 w-6 text-emerald-600" />
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      {report.year}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{report.type} · {report.size}</span>
                    <button className="flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-600/20 transition-colors">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-3">Our Commitment to Transparency</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Student Square publishes regular reports and financial statements to demonstrate accountability to our
              donors, supporters, and the communities we serve. Our financial records are independently audited to
              ensure accuracy and compliance with international standards.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
