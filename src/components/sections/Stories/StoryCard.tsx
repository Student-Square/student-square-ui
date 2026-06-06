"use client"

import Link from "next/link"
import { ArrowRight, GraduationCap, MapPin } from "lucide-react"
import type { ApiStoryListItem } from "@/types/stories"

const PLACEHOLDER = "/images/student-square-school-session.jpg"

interface StoryCardProps {
  story: ApiStoryListItem
}

export default function StoryCard({ story }: StoryCardProps) {
  const image = story.coverImage?.url ?? PLACEHOLDER
  const href = `/blog/real-life-stories/${story.slug}`

  return (
    <Link
      href={href}
      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={story.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-base sm:text-lg font-bold drop-shadow leading-snug">
            {story.name}
          </h3>
          {story.department && (
            <p className="text-white/85 text-xs flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="h-3 w-3" />
              {story.department}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {story.university && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-3">
            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
            {story.university}
          </p>
        )}

        {story.quote && (
          <blockquote className="relative pl-4 border-l-2 border-emerald-500/60 text-xs sm:text-sm text-foreground italic leading-relaxed line-clamp-3 flex-1">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
        )}

        {!story.quote && story.summary && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {story.summary}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-border">
          {story.achievement ? (
            <span title={story.achievement} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 whitespace-nowrap">
              {story.achievement.length > 40 ? `${story.achievement.slice(0, 35)}…` : story.achievement}
            </span>
          ) : (
            <span />
          )}
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  )
}
