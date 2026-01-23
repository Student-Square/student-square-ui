"use client"

import { motion } from "framer-motion"

// Put your YouTube link here (watch / share / embed / or just video ID)
const YOUTUBE_URL = "https://www.youtube.com/watch?v=Owkmkp7qYAE"

function getYouTubeId(url: string): string {
  try {
    // If it's already just an ID, return as-is
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url

    const parsed = new URL(url)

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const vParam = parsed.searchParams.get("v")
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam

    // Short URL: https://youtu.be/VIDEO_ID
    if (
      (parsed.hostname === "youtu.be" ||
        parsed.hostname === "www.youtu.be") &&
      parsed.pathname.length > 1
    ) {
      const id = parsed.pathname.slice(1)
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id
    }

    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    if (parsed.pathname.startsWith("/embed/")) {
      const id = parsed.pathname.replace("/embed/", "").split("/")[0]
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id
    }
  } catch {
    // Ignore parsing errors and fall through to default
  }

  // Fallback to the original demo video ID
  return "Owkmkp7qYAE"
}

const videoId = getYouTubeId(YOUTUBE_URL)
// rel=0 -> show related videos only from same channel
// modestbranding=1 -> reduce YouTube logo/branding
// iv_load_policy=3 -> hide video annotations
const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`

export default function Video() {
  return (
    <section className="relative w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-balance text-foreground mb-4 sm:mb-3">
            We're Ready to Help
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            Discover how Student Square's comprehensive approach can support your journey toward success and wellbeing.
          </p>
        </motion.div>

        {/* Normal YouTube Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-full max-w-4xl mx-auto"
        >
          <div className="relative w-full aspect-video rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              title="YouTube video player"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
