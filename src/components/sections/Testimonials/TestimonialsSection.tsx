"use client"

import { useEffect, useRef } from "react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi"

/** Keep cards a similar height by cutting at the sentence nearest 220 chars. */
function excerpt(text: string, limit = 220): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "))
  return lastStop > limit / 2 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}…`
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { data } = useGetStoriesQuery({ limit: 12 })

  // Real students, in their own words: the summary is the opening of the story
  // each of them wrote, first person. The `quote` field is not used here — for
  // most of these stories it carries the source document's headline ("From
  // Father's Shop to RU Glory") rather than anything the student said, and
  // setting that in quotation marks would put words in their mouth.
  const testimonials = (data?.data ?? [])
    .filter((story) => story.summary)
    .map((story) => ({
      text: excerpt(story.summary as string),
      name: story.name,
      role: [story.department, story.university].filter(Boolean).join(", "),
      image: story.coverImage?.url,
    }))

  const hasTestimonials = testimonials.length > 0

  // Depends on hasTestimonials because the section is not in the DOM until the
  // stories arrive — observing on mount alone would leave it stuck at opacity 0.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              timers.push(
                setTimeout(() => {
                  element.classList.add("animate-fade-in-up")
                }, index * 300),
              )
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [hasTestimonials])

  if (!hasTestimonials) return null

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out inline-flex items-center gap-2 text-muted-foreground text-sm font-medium tracking-wider uppercase mb-6">
            <div className="w-8 h-px bg-primary/50" />
            Success Stories
            <div className="w-8 h-px bg-primary/50" />
          </div>
          <h2 className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 tracking-tight text-balance">
            The students we{" "}
            <span className="font-medium italic bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent dark:from-green-400 dark:to-green-500">
              empower
            </span>
          </h2>
          <p className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Students across Bangladesh on what changed for them through our counselling, advocacy, and wellbeing programmes
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out relative flex justify-center items-center min-h-[400px] md:min-h-[480px] overflow-hidden">
          <div
            className="flex gap-4 md:gap-6 max-w-6xl px-4"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={18} className="flex-1 w-full max-w-xs sm:max-w-sm" />
            <TestimonialsColumn
              testimonials={testimonials.slice(2, 5)}
              duration={14}
              className="flex-1 hidden md:block max-w-sm"
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(5, 8)}
              duration={20}
              className="flex-1 hidden lg:block max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
