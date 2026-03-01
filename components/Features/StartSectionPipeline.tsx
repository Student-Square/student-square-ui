"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import TextAnimate from "@/components/ui/text-animate"
import FeatureGridPipeline from "./FeatureGridPipeline"
import StarPopIn from "@/components/ui/star-pop-in"
import ExpandableCards from "../ExpandableCards/ExpandableCards"

const StartSectionPipeline = () => {
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
          All you need is real time dataand real-life stories to shape your career.
          </p>
        </motion.div>

        {/* <FeatureGridPipeline /> */}
        <ExpandableCards/>
      </div>
    </section>
  )
}

export default StartSectionPipeline
