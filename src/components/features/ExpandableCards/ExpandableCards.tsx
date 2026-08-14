"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { BookOpen, GraduationCap, HeartHandshake } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * The three sections the client's homepage document names: "Magazine,
 * Education and Career Blog, Real Life Stories". Artwork is the cover supplied
 * for each in docs/fronted all pages/images.
 */
const cardsData = [
  {
    id: "magazine",
    title: "Magazine",
    href: "/blog/magazine",
    image: "/images/start-magazine.webp",
    tintClass: "bg-gradient-to-br from-blue-900/90 via-blue-700/70 to-cyan-500/40",
    footerLabel: "Magazine",
    icon: BookOpen,
    buttonHoverClass: "hover:bg-blue-500/70 hover:border-blue-300/80",
    iconColorClass: "text-blue-700",
  },
  {
    id: "education-career-blog",
    title: "Education &\nCareer Blog",
    href: "/blog/education-career",
    image: "/images/start-education-career-blog.webp",
    tintClass: "bg-gradient-to-br from-teal-950/85 via-emerald-900/70 to-black/55",
    footerLabel: "Education & Career Blog",
    icon: GraduationCap,
    buttonHoverClass: "hover:bg-emerald-500/70 hover:border-emerald-300/80",
    iconColorClass: "text-emerald-700",
  },
  {
    id: "real-life-stories",
    title: "Real life\nstories",
    href: "/blog/real-life-stories",
    image: "/images/start-real-life-stories.webp",
    tintClass: "bg-gradient-to-br from-violet-950/90 via-purple-900/70 to-indigo-700/50",
    footerLabel: "Real life stories",
    icon: HeartHandshake,
    buttonHoverClass: "hover:bg-violet-500/70 hover:border-violet-300/80",
    iconColorClass: "text-violet-700",
  },
]

export default function ExpandableCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="relative w-full px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="container relative z-10 mx-auto w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <div className="p-2 sm:p-3 md:p-4">
          {/* Expandable Cards Row */}
          <motion.div
            className="flex flex-col gap-4 md:min-h-[520px] md:flex-row md:gap-5 lg:min-h-[580px] xl:min-h-[620px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {cardsData.map((card, index) => {
              const isExpanded = activeIndex === index
              const Icon = card.icon

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className={cn(
                    "group relative w-full min-w-0 select-none overflow-hidden rounded-lg transition-[flex] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:rounded-xl",
                    "h-[320px] sm:h-[400px] md:h-auto",
                    isExpanded ? "md:flex-[1.7]" : "md:flex-1"
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onTouchStart={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${card.image})` }}
                    />
                    {/* Both washes lift on hover so the artwork shows in its
                        own colours; the bottom gradient stays partly on to
                        keep the white label readable. */}
                    <div
                      className={cn(
                        "absolute inset-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0",
                        card.tintClass
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/72 transition-opacity duration-300 group-hover:opacity-45" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-7">
                    <h3 className="max-w-[13ch] whitespace-pre-line font-heading text-2xl font-semibold leading-[1.05] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] sm:text-3xl md:text-[2.2rem]">
                      {card.title}
                    </h3>

                    <div className="mt-4">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md transition-all duration-200 sm:px-3 sm:py-2 sm:text-sm",
                          card.buttonHoverClass,
                          "lg:opacity-0 lg:translate-y-2 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:pointer-events-auto lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:pointer-events-auto"
                        )}
                      >
                        <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white sm:h-6 sm:w-6", card.iconColorClass)}>
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>
                        <span className="truncate whitespace-nowrap">{card.footerLabel}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </motion.div>

          {/* View All Changes Button */}
          <motion.div
            className="text-center mt-12 sm:mt-16 md:mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg border-2 border-emerald-600 text-emerald-600 font-medium text-sm sm:text-base hover:bg-emerald-600 hover:text-white transition-colors"
            >
              View All Changes
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
