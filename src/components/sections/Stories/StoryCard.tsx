"use client"

import Image from "next/image"
import { StudentStory } from "@/data/stories"

interface StoryCardProps {
  story: StudentStory
}

export default function StoryCard({ story }: StoryCardProps) {
  const handleCardClick = () => {
    window.location.href = `/blog/real-life-stories/${story.id}`
  }

  return (
    <div className="w-full max-w-[340px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[380px] xl:max-w-[400px] 2xl:max-w-[460px] mx-auto group">
      <div
        className="relative z-10 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-gray-800/50 shadow-md shadow-gray-200/50 dark:shadow-none hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1"
        onClick={handleCardClick}
      >
        <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={story.image}
            alt={story.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            priority={story.id === 1}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 33%, rgba(0,0,0,0.3) 66%, transparent 100%)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-16 md:h-20 lg:h-24"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 33%, rgba(0,0,0,0.3) 66%, transparent 100%)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10">
            <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold mb-1 sm:mb-1.5 drop-shadow-2xl tracking-tight">
              {story.name}
            </h3>
            <p className="text-white/95 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base font-semibold mb-0.5 drop-shadow-lg">
              {story.role}
            </p>
            <p className="text-white/85 text-[11px] sm:text-xs md:text-xs lg:text-xs xl:text-sm drop-shadow-md flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {story.university}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-4 md:p-5 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 backdrop-blur-sm">
          <div className="mb-3">
            <blockquote className="text-gray-700 dark:text-gray-300 italic text-center text-xs sm:text-xs md:text-sm leading-relaxed relative pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-purple-500 line-clamp-2">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
          </div>

          <div className="mb-3">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-xs md:text-sm leading-relaxed line-clamp-2">
              {story.story}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[10px] md:text-[11px] font-semibold border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {story.achievement}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none" />
      </div>
    </div>
  )
}
