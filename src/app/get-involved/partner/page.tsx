'use client';

import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { partners } from "@/data/partners";
import { ChevronRight, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    value: "how-to-become",
    question: "How to become a partner",
    answer:
      "To become a partner, reach out to us via email at admin@studentsquare.org or call us on 01711455858. Our partnerships team will guide you through our onboarding process, which includes a discovery call, alignment review, and a signed partnership agreement.",
  },
  {
    value: "what-to-expect",
    question: "What to expect from us and what we will expect from you",
    answer:
      "We commit to transparent communication, regular progress updates, joint reporting, and public recognition of your support. In return, we ask partners to honour agreed commitments, share relevant expertise, and engage constructively with our teams and communities.",
  },
  {
    value: "staying-in-touch",
    question: "Staying in touch between funded programmes",
    answer:
      "We maintain active relationships with all partners beyond the life of individual programmes. Partners receive our quarterly newsletter, invitations to events, and dedicated check-ins from our partnerships team throughout the year.",
  },
];

export default function PartnerPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src="/images/pexels-sabbir-bhuiyan-1747552532-32221017.jpg"
          alt="Partner With Us"
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
            Partner With Us
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
              We work alongside our network of over 300 partner organizations representing minority and
              indigenous communities in over 60 countries.
            </p>
            <p className="text-sm text-foreground leading-relaxed mb-4">
              Here you can find information about our partnership process and what to expect every step of
              the way.
            </p>
            <p className="text-sm text-foreground mb-1">Contact us at:</p>
            <ul className="text-sm text-foreground space-y-0.5 ml-4">
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:admin@studentsquare.org" className="hover:text-emerald-600 transition-colors">
                  admin@studentsquare.org
                </a>
              </li>
              <li>
                <span className="font-semibold">Phone:</span>{" "}
                <a href="tel:01711455858" className="hover:text-emerald-600 transition-colors">
                  01711455858
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
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#eaf8d0] dark:bg-emerald-900/20 px-4 text-sm text-foreground rounded-b-lg">
                    {item.answer}
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
            Let&apos;s change the society together.
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
                    alt={partner.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {partner.title}
                      </h3>
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
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
