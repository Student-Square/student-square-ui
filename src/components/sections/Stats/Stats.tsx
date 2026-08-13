"use client"

import { motion, useInView, useMotionValue, useSpring } from "motion/react"
import { useEffect, useRef } from "react"
import { Users, Trees, Hospital, School } from "lucide-react"
import { useGetPageSectionsQuery } from "@/redux/features/content/contentApi"

type ImpactStat = { value: string; label: string; detail?: string }
type ImpactStats = { heading?: string; subheading?: string; items?: ImpactStat[] }

/** Card styling, applied in order. Presentation only — the copy comes from the API. */
const STYLES = [
  {
    icon: Users,
    gradient: "from-amber-500/20 to-orange-500/20",
    accent: "from-amber-500 to-orange-500",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  {
    icon: School,
    gradient: "from-emerald-500/20 to-teal-500/20",
    accent: "from-emerald-500 to-teal-500",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    icon: Trees,
    gradient: "from-green-500/20 to-lime-500/20",
    accent: "from-green-500 to-lime-500",
    iconColor: "text-green-500 dark:text-lime-400",
  },
  {
    icon: Hospital,
    gradient: "from-blue-500/20 to-cyan-500/20",
    accent: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500 dark:text-cyan-400",
  },
]

/** "5,000+" → 5000 plus the "+" so the counter can animate to the figure. */
function parseValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^([\d.,]+)(.*)$/)
  if (!match) return { number: 0, suffix: value }
  return { number: Number(match[1].replace(/,/g, "")), suffix: match[2] }
}

/** Thousands separators so 5000 reads as the source's "5,000+". */
function format(value: number, suffix: string): string {
  const rounded = value % 1 === 0 ? value : Number(value.toFixed(1))
  return `${rounded.toLocaleString("en-US")}${suffix}`
}

/** The design highlights the figure onward ("A Strong Community of | 5000+ Students"). */
function splitHeading(heading: string): [string, string] {
  const words = heading.split(" ")
  const i = words.findIndex((w) => /\d/.test(w))
  if (i === -1) return [heading, ""]
  return [words.slice(0, i).join(" "), words.slice(i).join(" ")]
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (ref.current && !ref.current.textContent) {
      ref.current.textContent = format(value, suffix)
    }
  }, [value, suffix])

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    } else if (ref.current) {
      ref.current.textContent = format(value, suffix)
    }
  }, [motionValue, isInView, value, suffix])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest, suffix)
      }
    })
    
    return () => unsubscribe()
  }, [springValue, suffix])

  return <span ref={ref} className="inline-block" />
}

const Stats = () => {
  const { data: sections } = useGetPageSectionsQuery("home")
  const impact = (sections?.find((s) => s.sectionKey === "impact-stats")?.content ??
    {}) as ImpactStats

  const stats = (impact.items ?? []).map((item, i) => ({
    ...STYLES[i % STYLES.length],
    ...parseValue(item.value),
    label: item.label,
    detail: item.detail,
  }))

  if (stats.length === 0) return null

  const [headingLead, headingAccent] = splitHeading(impact.heading ?? "")

  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-16">
      <div className="container relative mx-auto px-4 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-10"
        >
          {/* <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-xl sm:mb-8 sm:px-5 sm:py-2.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
              Our Impact in Numbers
            </span>
          </motion.div> */}
          <h2 className="font-heading mb-4 px-4 text-3xl font-bold tracking-[0.02em] leading-tight text-foreground sm:mb-6 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
            {headingLead}
            {headingAccent && (
              <>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400">
                  {headingAccent}
                </span>
              </>
            )}
          </h2>
          {impact.subheading && (
            <p className="mx-auto max-w-2xl px-4 text-sm font-light leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              {impact.subheading}
            </p>
          )}
        </motion.div>

        {/* Mobile Grid Layout */}
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:gap-4 md:hidden">
          {stats.map((stat, index) => (
            <motion.div
              key={`mobile_${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group relative"
            >
              <div className="relative h-full rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-2xl sm:rounded-2xl sm:p-5">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`mb-3 inline-flex rounded-lg border border-border/40 bg-gradient-to-br p-2 shadow-lg backdrop-blur-xl sm:mb-4 sm:rounded-xl sm:p-3 ${stat.gradient}`}
                >
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </motion.div>

                <div className={`mb-1 bg-gradient-to-br bg-clip-text text-xl font-bold text-transparent sm:mb-2 sm:text-2xl ${stat.accent}`}>
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                {stat.detail && (
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/70">
                    {stat.detail}
                  </p>
                )}

                <div className={`absolute right-0 top-0 h-12 w-12 rounded-bl-full bg-gradient-to-br opacity-30 sm:h-16 sm:w-16 ${stat.gradient}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop & Tablet Grid Layout */}
        <div className="mx-auto hidden max-w-7xl grid-cols-2 gap-4 md:grid lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="group relative"
            >
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition duration-500 group-hover:opacity-30 ${stat.accent}`} />

              <div className="relative h-full rounded-2xl border border-border/40 bg-card/60 p-6 backdrop-blur-2xl transition-all duration-300 group-hover:shadow-2xl sm:p-7 lg:p-8">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`mb-4 inline-flex rounded-xl border border-border/40 bg-gradient-to-br p-3 shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:shadow-xl sm:mb-6 sm:p-4 ${stat.gradient}`}
                >
                  <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${stat.iconColor}`} />
                </motion.div>

                <div className={`mb-2 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent transition-all duration-300 sm:mb-3 sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl ${stat.accent}`}>
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-sm md:text-base lg:text-base">
                  {stat.label}
                </p>
                {stat.detail && (
                  <p className="mt-1 text-xs leading-snug text-muted-foreground/70">
                    {stat.detail}
                  </p>
                )}

                <div className={`absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-50 sm:h-24 sm:w-24 ${stat.gradient}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-8 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent sm:mt-10 md:mt-12"
        />
      </div>
    </section>
  )
}

export default Stats
