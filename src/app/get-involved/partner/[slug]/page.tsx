'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getPartnerBySlug, partners } from "@/data/partners";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function PartnerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const partner = getPartnerBySlug(slug);
  if (!partner) redirect("/get-involved/partner");

  const next = partners.find((p) => p.slug !== slug);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src={partner.image}
          alt={partner.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            {partner.title}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/get-involved/partner" className="hover:text-emerald-600 transition-colors">
              Partner With Us
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{partner.title}</span>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 border-t border-b border-border py-8"
          >
            {partner.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-start gap-1 mt-1">
                  <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Description paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {partner.description.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
            ))}
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-bold text-foreground mb-3">
              Key Points of {partner.title.replace("Become A ", "").replace("Become An ", "")} Partnership
            </h2>
            <ul className="space-y-1.5 ml-4 list-disc">
              {partner.keyPoints.map((point, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">{point.bold}</span>{point.text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-bold text-foreground mb-3">Our Campaigns</h2>
            <ul className="space-y-1.5 ml-4 list-disc">
              {partner.campaigns.map((item, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">{item.bold}</span>{item.text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Get in touch */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-foreground leading-relaxed italic">
              <Link href="/contact" className="font-semibold not-italic hover:text-emerald-600 transition-colors">
                Get in touch
              </Link>
              {" "}(eita cursor dile jate FIND US page a nie jai ) with us to learn about the
              current requirements for educational accessories and how you can meet these needs.
            </p>
          </motion.div>

          {/* Learn More link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-foreground">
              Learn More about{" "}
              <Link href="/get-involved/partner" className="text-emerald-600 underline hover:text-emerald-700 transition-colors">
                How to Partner With Us
              </Link>
            </p>
          </motion.div>

          {/* Next partner card */}
          {next && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/get-involved/partner/${next.slug}`}
                className="group relative block rounded-xl overflow-hidden h-48 sm:h-56"
              >
                <img
                  src={next.image}
                  alt={next.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{next.title}</h3>
                    <p className="text-xs text-white/80 mt-1 line-clamp-2 max-w-md">
                      Our vision is to foster an inclusive society where every individual's potential is
                      nurtured and developed, free from any form of discrimination.
                    </p>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/90 hover:bg-emerald-600 text-foreground hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                    Donate <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
