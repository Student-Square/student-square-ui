"use client"

import { motion } from "motion/react"
import ProjectCarousel from "./ProjectCarousel"
import { ArrowRight } from "lucide-react"

export default function OurProjects() {
  return (
    <section id="projects" className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            🚀 Our Projects
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance text-foreground mb-4 sm:mb-6 leading-tight">
            Our Amazing Projects
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            Explore our portfolio of initiatives that showcase our commitment to student support, advocacy, and community engagement.
          </p>
        </motion.div>

        {/* Project Carousel */}
        <motion.div
          className="flex justify-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ProjectCarousel />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
         
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-1.5 h-9 sm:h-12 px-4 sm:px-8 rounded-full bg-emerald-600 text-white font-medium text-xs sm:text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span>Learn More</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
