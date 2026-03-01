"use client"

import { motion } from "motion/react"
import featuresData from "@/data/featuresData"

const FeatureGridPipeline = () => {
  return (
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
  )
}

export default FeatureGridPipeline
