"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import featuresData from "@/data/featuresData"
import TextAnimate from "@/components/ui/text-animate"
import StarPopIn from "@/components/ui/star-pop-in"
import { cn } from "@/lib/utils"

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      <div className="container relative z-10 w-full max-w-7xl mx-auto px-0 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            ✨ Student Square — What We Do
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance text-foreground mb-4 sm:mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
              Your Changes
            </span>
            {" "}
            <span className="relative inline-block">
              <TextAnimate
                text="Start Here"
                type="fadeInUp"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-emerald-600 dark:text-emerald-400 inline-block"
                duration={0.6}
                delay={0.3}
              />
              {" "}
              <StarPopIn size="lg" />
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            We provide integrated solutions across mental health, advocacy, education, and community to help you thrive academically and personally.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="w-full max-w-5xl mx-auto px-2 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Pipeline line - hidden on mobile */}
            <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-400/20 to-transparent hidden sm:block" />

            <ul className="space-y-4 sm:space-y-6 md:space-y-8">
              {featuresData.map((feature, index) => (
                <motion.li
                  key={feature.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="flex gap-3 sm:gap-4 md:gap-6 items-start">
                    {/* Node - only show on desktop */}
                    <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white shadow-lg shrink-0 hidden sm:flex text-sm sm:text-base">
                      {feature.icon}
                      {index !== featuresData.length - 1 && (
                        <div className="absolute left-1/2 top-full -translate-x-1/2 h-6 sm:h-8 w-px bg-gradient-to-b from-emerald-400/50 to-transparent" />
                      )}
                    </div>

                    {/* Mobile icon - show on mobile */}
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white sm:hidden shrink-0 text-sm">
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="group relative rounded-lg sm:rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 p-3 sm:p-4 md:p-6">
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                            {feature.title}
                          </h3>
                          <span className="text-xs text-muted-foreground font-medium shrink-0">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-muted-foreground group-hover:text-foreground leading-relaxed transition-colors line-clamp-2 group-hover:line-clamp-none">
                          {feature.paragraph}
                        </p>
                        {/* Animated underline - expands to full width on hover */}
                        <div className="mt-3 sm:mt-4 h-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full w-8 sm:w-12 group-hover:w-full transition-all duration-500 ease-out" />
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
