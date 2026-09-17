"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Quote } from "lucide-react"
import type { ApiStoryListItem } from "@/types/stories"
import { useLanguage } from "@/components/i18n/LanguageProvider"

const PLACEHOLDER = "/images/student-square-school-session.jpg"

interface StoryCardProps {
  story: ApiStoryListItem
}

/**
 * The homepage's story card: a portrait photo with its words laid over the
 * lower part. The photos are of people, mostly head-and-shoulders, so a tall
 * frame anchored to the top keeps faces whole. The stories pages keep StoryCard.
 */
export default function StoryPortraitCard({ story }: StoryCardProps) {
  const { t, pick, tr } = useLanguage()
  const image = story.coverImage?.url ?? PLACEHOLDER
  const href = `/blog/real-life-stories/${story.slug}`
  const quote = pick(story.quote, story.quoteBn) || pick(story.summary, story.summaryBn)
  // No Bangla column for these three — the known-content table covers them.
  const achievement = tr(story.achievement)
  const department = tr(story.department)
  const university = tr(story.university)
  const name = tr(story.name)

  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl lg:aspect-[4/5] bg-muted shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/15 dark:ring-white/10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      {/* Clear over the face, dark and softly blurred where the text sits. The
          blur fades out upwards, so it never sits hard across the photo. */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 backdrop-blur-[3px] [mask-image:linear-gradient(to_top,black_45%,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-40% to-transparent to-80%" />

      {achievement && (
        <span
          title={achievement}
          className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-emerald-300"
        >
          {achievement}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
        {quote && (
          <div className="mb-3 hidden sm:block">
            <Quote aria-hidden className="h-5 w-5 fill-emerald-400/90 text-emerald-400/90" />
            <p className="mt-1.5 line-clamp-3 text-sm font-medium leading-snug text-white/95">{quote}</p>
          </div>
        )}

        <h3 className="text-sm font-bold leading-snug text-white sm:text-lg">{name}</h3>
        {department && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75 sm:text-xs">{department}</p>
        )}
        {university && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-300 sm:text-xs">
            <MapPin aria-hidden className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{university}</span>
          </p>
        )}

        {/* Revealed on hover or keyboard focus. The row collapses to no height
            otherwise, so the text sits at the foot of the card until then. */}
        <div className="hidden grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 sm:grid">
          <div className="overflow-hidden">
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
              {t("common.readStory")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
