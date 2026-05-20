"use client"

import { motion } from "motion/react"

export default function SectionDivider() {
  return (
    <div className="relative py-6 sm:py-8 md:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left gradient line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-emerald-500/50" />
          
          {/* Center decorative element */}
          <div className="mx-4 sm:mx-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          </div>
          
          {/* Right gradient line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border/50 to-emerald-500/50" />
        </motion.div>
      </div>
    </div>
  )
}
