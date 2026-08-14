"use client"

import { motion } from "motion/react"
import Link from "next/link"
import StoryCard from "./StoryCard"
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi"

const SkeletonCard = () => (
  <div className="rounded-2xl border border-border overflow-hidden animate-pulse bg-card">
    <div className="aspect-[16/10] bg-muted" />
    <div className="p-5 space-y-3">
      <div className="h-2.5 bg-muted rounded w-2/5" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-5/6" />
      <div className="h-3 bg-muted rounded w-4/6" />
    </div>
  </div>
)

const cardVisibility = (index: number) =>
  index < 4 ? "flex" : index < 6 ? "hidden sm:flex" : "hidden 2xl:flex"

export default function Stories() {
  const { data, isLoading } = useGetStoriesQuery({ limit: 8 })
  const stories = data?.data ?? []

  return (
    <section id="stories" className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-[0.02em] text-gray-900 dark:text-white sm:text-4xl md:text-[48px] lg:text-[48px] xl:text-[48px]">
            Hundreds of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200">
              Real Life Stories
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm md:text-base">
            Transformative journeys from students across Bangladesh shaped by Student Square&apos;s programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={cardVisibility(i)}>
                  <SkeletonCard />
                </div>
              ))
            : stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={cardVisibility(index)}
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-10 md:mt-12 flex justify-center"
        >
          <Link
            href="/blog/real-life-stories"
            className="inline-flex items-center justify-center rounded-full border border-emerald-500/70 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-600 transition-colors sm:px-7 sm:py-3 sm:text-base"
          >
            View More Stories
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
