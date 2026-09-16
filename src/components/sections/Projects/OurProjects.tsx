"use client"

import { motion } from "motion/react"
import ProjectCarousel from "./ProjectCarousel"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/i18n/LanguageProvider"

export default function OurProjects() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[0.02em] text-balance text-foreground mb-4 sm:mb-6 leading-tight">
            {t("home.projectsTitle")}
          </h2>
          <p className="text-sm sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            {t("home.projectsDescription")}
          </p>
        </motion.div>

        {/* Project Carousel */}
        <motion.div
          className="relative left-1/2 mb-8 w-screen -translate-x-1/2 sm:mb-10 md:mb-12"
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
            <span>{t("home.learnMore")}</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
