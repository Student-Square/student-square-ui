"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Story } from "@/data/storiesData"

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group flex flex-col items-center text-center"
    >
      {/* Student Image */}
      <div className="relative w-full aspect-square rounded-lg sm:rounded-2xl overflow-hidden bg-muted mb-3 sm:mb-4 md:mb-6 border border-border hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300">
        <Image
          src={story.image || "/placeholder.svg"}
          alt={story.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Student Info */}
      <div className="w-full">
        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-foreground mb-1">
          {story.name}
        </h3>
        {story.university && (
          <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2 sm:mb-3">
            {story.university}
          </p>
        )}
        <div className="hidden sm:flex flex-wrap gap-2 justify-center mb-3">
          {story.category && (
            <span className="inline-block px-2 py-1 text-[9px] sm:text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
              {story.category}
            </span>
          )}
          {story.benefit && (
            <span className="inline-block px-2 py-1 text-[9px] sm:text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full font-medium">
              {story.benefit}
            </span>
          )}
        </div>
        <p className="hidden sm:block text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
          {story.content}
        </p>
      </div>
    </motion.div>
  )
}
