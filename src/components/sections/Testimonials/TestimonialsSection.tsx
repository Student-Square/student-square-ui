"use client"

import { useEffect, useRef } from "react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

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
  }, [])

  const testimonials = [
    {
      text: "Student Square helped me navigate through my toughest academic challenges. Their counselling services gave me clarity and direction when I needed it most.",
      name: "Counselling Workshop",
      role: "Educational Support",
      image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    },
    {
      text: "The advocacy team fought for my rights when I faced unfair treatment. I felt truly supported throughout the entire process.",
      name: "Prize Recognition",
      role: "Achievement Celebration",
      image: "/images/brain-battle-prize-ceremony.jpg",
    },
    {
      text: "Thanks to Student Square's wellbeing programs, I learned to manage stress and maintain a healthy work-life balance during exams.",
      name: "Community Service",
      role: "Social Impact",
      image: "/images/emergency-tran-bitoron-activities-5.jpg",
    },
    {
      text: "Their community events helped me connect with like-minded students. I found my support network through their workshops.",
      name: "Relief Initiatives",
      role: "Community Support",
      image: "/images/emergency-tran-bitoron-activities-2.jpg",
    },
    {
      text: "The mental health resources provided by Student Square were instrumental in my recovery journey. Professional, compassionate, and always available.",
      name: "Cooperative Programs",
      role: "Social Building",
      image: "/images/relation-will-be-cooperative-for-social-building2.jpg",
    },
    {
      text: "As an international student, Student Square made me feel at home. Their cultural programs and support services are exceptional.",
      name: "Environmental Action",
      role: "Community Growth",
      image: "/images/student-square-one-minute-investment-project-2.jpg",
    },
    {
      text: "The career counselling sessions helped me discover my passion and plan my future with confidence. Highly recommended!",
      name: "Emergency Response",
      role: "Community Resilience",
      image: "/images/emergency-tran-bitoron-activities-4.jpg",
    },
    {
      text: "Student Square's peer mentorship program connected me with seniors who guided me through my first year challenges.",
      name: "Water Relief Support",
      role: "Disaster Response",
      image: "/images/emergency-tran-bitoron-activities-3.jpg",
    },
  ]

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
            Discover how students across Ireland are transforming their academic journey with our counselling, advocacy, and wellbeing services
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
