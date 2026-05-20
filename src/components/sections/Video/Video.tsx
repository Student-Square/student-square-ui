"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const VIMEO_EMBED_URL =
  "https://player.vimeo.com/video/1173247360?title=0&byline=0&portrait=0&badge=0&autopause=0&autoplay=1&muted=1&player_id=0&app_id=58479";

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
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
            See How Your're Bringing Change
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            Discover how Student Square's comprehensive approach can support your journey toward success and wellbeing.
          </p>
        </motion.div>

        {/* Vimeo Player with thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-full max-w-4xl mx-auto"
        >
          <div className="relative w-full aspect-video rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
            {!isPlaying && (
              <>
                <Image
                  src="/images/thumbnail.webp"
                  alt="Student Square impact video thumbnail"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 768px, 100vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/35" />
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="group absolute inset-0 flex items-center justify-center"
                  aria-label="Play impact video"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-0.5 h-7 w-7 sm:h-8 sm:w-8" />
                  </span>
                </button>
              </>
            )}

            {isPlaying && (
              <iframe
                src={VIMEO_EMBED_URL}
                className="w-full h-full"
                title="Student Square impact video"
                allowFullScreen
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
