"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Testimonial {
  text: string
  name: string
  role: string
  image?: string
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[]
  duration?: number
  className?: string
}

/** A column needs at least this many cards per copy to be taller than its window. */
const MIN_CARDS_PER_COPY = 4

/**
 * An endlessly scrolling column of testimonials. The parent gives it a fixed
 * height; the track holds two identical copies and moves up by exactly one
 * copy (-50%), then starts over, so the join is invisible.
 *
 * Each copy carries its own bottom padding equal to the gap between cards, so
 * the distance from the last card of one copy to the first of the next matches
 * every other gap. A short list is repeated until a copy is taller than the
 * window; otherwise the end of it would show as empty space.
 */
export function TestimonialsColumn({ testimonials, duration = 15, className }: TestimonialsColumnProps) {
  if (testimonials.length === 0) return null

  let items = testimonials
  while (items.length < MIN_CARDS_PER_COPY) items = items.concat(testimonials)

  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex flex-col gap-4 pb-4">
            {items.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(/s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(-2)
    .map((part) => part[0])
    .join("")

  const caption = (light: boolean) => (
    <>
      <p className={cn("truncate text-sm font-semibold", light ? "text-white" : "text-foreground")}>{testimonial.name}</p>
      <p className={cn("line-clamp-1 text-xs leading-snug", light ? "text-white/80" : "text-muted-foreground")}>
        {testimonial.role}
      </p>
    </>
  )

  return (
    <figure className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-500/30">
      {/* The photo as a band across the top with the name on it: large enough
          to see the student, without the separate name row below. */}
      {testimonial.image && (
        <div className="relative h-44 w-full">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-50% to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-3">{caption(true)}</figcaption>
        </div>
      )}

      <div className="p-5">
        <Quote aria-hidden className="h-5 w-5 fill-emerald-500/20 text-emerald-500" />
        <blockquote className="mt-2 text-sm leading-relaxed text-foreground/80">
          {/* Some summaries arrive already quoted; the card supplies its own marks. */}
          &ldquo;{testimonial.text.trim().replace(/^["“”']+|["“”']+$/g, "")}&rdquo;
        </blockquote>
        {!testimonial.image && (
          <figcaption className="mt-4 flex items-center gap-3 border-t border-border/40 pt-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {initials}
            </div>
            <div className="min-w-0">{caption(false)}</div>
          </figcaption>
        )}
      </div>
    </figure>
  )
}
