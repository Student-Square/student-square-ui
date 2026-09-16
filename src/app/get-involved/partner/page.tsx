'use client';

import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { partners } from "@/data/partners";
import { siteConfig } from "@/config/site";
import { ChevronRight, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// Questions and answers live in the dictionary as partner.faqN.q / partner.faqN.a.
const FAQ = [
  { value: "how-to-become", n: 1 },
  { value: "what-to-expect", n: 2 },
  { value: "staying-in-touch", n: 3 },
];

export default function PartnerPage() {
  const { t, pick } = useLanguage();
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src="/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg"
          alt={t("partner.title")}
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
            {t("partner.title")}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 space-y-10">

          {/* Intro text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-foreground leading-relaxed mb-2">
              {t("partner.intro1")}
            </p>
            <p className="text-sm text-foreground leading-relaxed mb-4">
              {t("partner.intro2")}
            </p>
            <p className="text-sm text-foreground mb-1">{t("partner.contactAt")}</p>
            <ul className="text-sm text-foreground space-y-0.5 ml-4">
              <li>
                <span className="font-semibold">{t("partner.email")}</span>{" "}
                <a href="mailto:admin@studentsquare.org" className="hover:text-emerald-600 transition-colors">
                  admin@studentsquare.org
                </a>
              </li>
              <li>
                <span className="font-semibold">{t("partner.phone")}</span>{" "}
                <a href={siteConfig.contact.phoneTel} className="hover:text-emerald-600 transition-colors">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {FAQ.map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="border-0 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="bg-[#d4f0a0] hover:bg-[#c5e88a] dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 px-4 py-3 text-sm font-semibold text-foreground hover:no-underline rounded-lg data-[state=open]:rounded-b-none transition-colors">
                    {t(`partner.faq${item.n}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#eaf8d0] dark:bg-emerald-900/20 px-4 text-sm text-foreground rounded-b-lg">
                    {t(`partner.faq${item.n}.a`, { phone: siteConfig.contact.phoneDisplay })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-foreground text-center pt-2"
          >
            {t("partner.cta")}
          </motion.h2>

          {/* Partner type cards */}
          <div className="space-y-5">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/get-involved/partner/${partner.slug}`}
                  className="group relative block rounded-xl overflow-hidden h-52 sm:h-60"
                >
                  {/* Background image */}
                  <img
                    src={partner.image}
                    alt={pick(partner.title, partner.titleBn)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {pick(partner.title, partner.titleBn)}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2 max-w-md">
                        {t("partner.cardBody")}
                      </p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/90 hover:bg-emerald-600 text-foreground hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                      {t("partner.donate")} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
