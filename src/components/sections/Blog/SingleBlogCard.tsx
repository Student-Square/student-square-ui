"use client"

import { Blog } from "@/types/blog"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

export default function SingleBlogCard({ blog, index }: { blog: Blog; index: number }) {
  const { title, image, paragraph, author, tags, publishDate } = blog

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href="#" className="group block h-full">
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-muted">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Tag Badge */}
            {tags[0] && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <span className="inline-flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold bg-emerald-600 text-white rounded-full backdrop-blur-sm group-hover:bg-emerald-700 transition-colors">
                  {tags[0]}
                </span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-3 sm:p-6 md:p-7">
            {/* Title */}
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 line-clamp-3 group-hover:text-emerald-600 transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[10px] sm:text-base text-muted-foreground mb-3 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
              {paragraph}
            </p>

            {/* Divider */}
            <div className="h-px bg-border/30 mb-3 sm:mb-5" />

            {/* Author and Date Section */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Author */}
              <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                <div className="relative h-7 w-7 sm:h-11 sm:w-11 flex-shrink-0 rounded-full overflow-hidden border border-border/30">
                  <Image
                    src={author.image || "/placeholder.svg"}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-sm font-semibold text-foreground truncate">
                    {author.name}
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{author.designation}</p>
                </div>
              </div>

              {/* Date */}
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {publishDate}
                </p>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/0 via-emerald-600/50 to-emerald-600/0 translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
        </div>
      </Link>
    </motion.div>
  )
}
