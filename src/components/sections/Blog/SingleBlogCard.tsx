"use client"

import type { ApiBlogListItem } from "@/types/blogs"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

const formatDate = (iso: string | null) => {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function SingleBlogCard({ blog, index }: { blog: ApiBlogListItem; index: number }) {
  const badge = blog.tags[0]?.tag.name ?? blog.category.name
  const author = blog.displayAuthorName

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${blog.category.slug}/${blog.id}`} className="group block h-full">
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
          {/* Image Container — omitted entirely for posts without a cover,
              otherwise the card opens with a tall empty panel. */}
          {blog.coverImage ? (
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-muted">
              <Image
                src={blog.coverImage.url}
                alt={blog.coverImage.alt ?? blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {badge && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold bg-emerald-600 text-white rounded-full backdrop-blur-sm group-hover:bg-emerald-700 transition-colors">
                    {badge}
                  </span>
                </div>
              )}
            </div>
          ) : (
            badge && (
              <div className="px-3 pt-3 sm:px-6 sm:pt-6">
                <span className="inline-flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold bg-emerald-600 text-white rounded-full transition-colors group-hover:bg-emerald-700">
                  {badge}
                </span>
              </div>
            )
          )}

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-3 sm:p-6 md:p-7">
            {/* Title */}
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-4 line-clamp-3 group-hover:text-emerald-600 transition-colors duration-300">
              {blog.title}
            </h3>

            {/* Description */}
            <p className="text-[10px] sm:text-base text-muted-foreground mb-3 sm:mb-6 flex-grow line-clamp-3 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Divider */}
            <div className="h-px bg-border/30 mb-3 sm:mb-5" />

            {/* Author and Date Section */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Author */}
              {author && (
                <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                  {blog.displayAuthorImage && (
                    <div className="relative h-7 w-7 sm:h-11 sm:w-11 flex-shrink-0 rounded-full overflow-hidden border border-border/30">
                      <Image
                        src={blog.displayAuthorImage}
                        alt={author}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-sm font-semibold text-foreground truncate">
                      {author}
                    </p>
                    {blog.displayAuthorTitle && (
                      <p className="text-[9px] sm:text-xs text-muted-foreground truncate">
                        {blog.displayAuthorTitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {formatDate(blog.publishedAt)}
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
