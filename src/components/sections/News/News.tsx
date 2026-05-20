"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { newsData } from "@/data/news"

export default function News() {
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
          
          {/* Top badge (like Success Stories) */}
          <div className="inline-flex items-center gap-2 text-muted-foreground text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-4 sm:mb-6">
            <div className="w-8 h-px bg-primary/50" />
            Press
            <div className="w-8 h-px bg-primary/50" />
          </div>
          
          {/* Main Title */}
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight text-balance sm:mb-3">
            Student Square
            <br />
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400">
                in the News
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/0 via-emerald-600/50 to-emerald-600/0 rounded-full blur" />
            </span>
          </h2>
          
          {/* Subtitle */}
          
          
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-4">
          {/* Main Featured News - left card, rounded left only on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Link href={`/news/${newsData[0].id}`} className="group block h-full">
              <div className="relative w-full h-56 sm:h-96 md:h-[450px] lg:h-[520px] rounded-2xl lg:rounded-l-2xl lg:rounded-r-none overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <Image
                  src={newsData[0].image || "/placeholder.svg"}
                  alt={newsData[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10">
                  <div className="space-y-2 sm:space-y-4">
                    <span className="text-[10px] sm:text-sm text-white/70 font-medium tracking-wide">
                      {newsData[0].date}
                    </span>
                    {/* Title */}
                    <div>
                      <h3 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight group-hover:text-emerald-200 transition-colors duration-300 text-balance">
                        {newsData[0].title}
                      </h3>
                    </div>

                    {/* Read more arrow */}
                    
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side News Cards - right cards, rounded right only on desktop */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-4">
            {newsData.slice(1, 3).map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/news/${news.id}`} className="block h-full">
                  <div className="relative w-full h-48 sm:h-64 lg:h-[252px] rounded-xl lg:rounded-r-2xl lg:rounded-l-none overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                      <div className="space-y-1 sm:space-y-2">
                        <span className="text-[10px] sm:text-xs font-medium text-white/70 tracking-wide">
                          {news.date}
                        </span>
                        <h4 className="text-xs sm:text-base font-semibold text-white leading-snug group-hover:text-emerald-200 transition-colors duration-300 line-clamp-3">
                          {news.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All News Section */}
        {newsData.length > 3 && (
          <motion.div
            className="mt-10 sm:mt-12 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
              {newsData.slice(3).map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/news/${news.id}`} className="block h-full">
                    <div className="relative w-full h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                      <Image
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <p className="text-[10px] sm:text-xs text-white/70 font-medium mb-1 sm:mb-2">{news.date}</p>
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors line-clamp-2">
                          {news.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          className="text-center mt-8 sm:mt-10 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            href="/news"
            className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-12 px-4 sm:px-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span>View All News & Updates</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
