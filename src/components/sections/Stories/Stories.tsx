"use client"

import { motion } from "motion/react"
import Link from "next/link"
import StoryPortraitCard from "./StoryPortraitCard"
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi"
import { useLanguage } from "@/components/i18n/LanguageProvider"

const SkeletonCard = () => <div className="aspect-[3/4] animate-pulse rounded-2xl bg-muted lg:aspect-[4/5]" />

// Always two rows: four cards two across on phones and tablets, six three
// across on laptops (15-inch screens run 1280–1536px wide, where four across
// was cramped), and all eight four across on large monitors.
const cardVisibility = (index: number) =>
  index < 4 ? "block" : index < 6 ? "hidden lg:block" : "hidden 3xl:block"

export default function Stories() {
  const { data, isLoading } = useGetStoriesQuery({ limit: 8 })
  const { t } = useLanguage()
  const stories = data?.data ?? []

  return (
    <section id="stories" className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-[0.02em] text-gray-900 dark:text-white sm:text-4xl md:text-[48px] lg:text-[48px] xl:text-[48px]">
            {t("home.storiesHeadingLead")}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200">
              {t("home.realLifeStories")}
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-sm md:text-base">
            {t("home.storiesDescription")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 3xl:grid-cols-4">
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
                  <StoryPortraitCard story={story} />
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
            {t("home.viewMoreStories")}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
