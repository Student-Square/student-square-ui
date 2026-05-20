"use client"

import { motion } from "motion/react"
import Link from "next/link"
import blogData from "@/data/blog"
import SingleBlogCard from "./SingleBlogCard"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function BlogSection() {
  const isMobile = useMediaQuery("(max-width: 639px)")
  const displayedBlogs = isMobile ? blogData.slice(0, 3) : blogData
  return (
    <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background Glow Effect */}
          <div className="absolute -inset-x-8 -inset-y-12 sm:-inset-x-12 sm:-inset-y-16 md:-inset-x-16 md:-inset-y-20 bg-gradient-to-r from-emerald-600/0 via-emerald-600/5 to-emerald-600/0 rounded-3xl blur-3xl pointer-events-none -z-10" />
          <div className="absolute -inset-x-4 -inset-y-8 sm:-inset-x-8 sm:-inset-y-12 md:-inset-x-12 md:-inset-y-16 bg-gradient-to-b from-emerald-500/0 via-teal-500/3 to-emerald-500/0 rounded-3xl blur-2xl pointer-events-none -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-500/8 border border-emerald-500/20 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 hover:bg-emerald-500/15 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Latest Insights
          </div>

          {/* Title */}
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight text-balance">
            Student Square
            <br />
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400">
                Blog & Stories
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/0 via-emerald-600/50 to-emerald-600/0 rounded-full blur" />
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 font-normal leading-relaxed mt-4 sm:mt-8">
            Discover insights, stories, and updates from our community. Learn about education, counselling, and initiatives transforming lives.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          {displayedBlogs.map((blog, index) => (
            <SingleBlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href="#"
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-8 py-2 sm:py-3.5 text-xs sm:text-base font-medium border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-300 group"
          >
            <span>Explore All Articles</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
