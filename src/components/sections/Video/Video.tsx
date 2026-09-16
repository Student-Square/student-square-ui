"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useGetPageSectionsQuery } from "@/redux/features/content/contentApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Seeded as the `documentary` section of the home page. */
type Documentary = {
  title?: string;
  heading?: string;
  youtubeId?: string;
  url?: string;
  poster?: string;
};

const FALLBACK_YOUTUBE_ID = "-bx-buDUX-Y";
/** Custom-made poster; preferred over YouTube's auto-generated maxresdefault. */
const FALLBACK_POSTER = "/images/documentary-thumbnail.webp";

export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { data } = useGetPageSectionsQuery("home");
  const { t, tr } = useLanguage();
  const documentary = data?.find((s) => s.sectionKey === "documentary")?.content as
    | Documentary
    | undefined;

  const youtubeId = documentary?.youtubeId ?? FALLBACK_YOUTUBE_ID;
  const poster = documentary?.poster ?? FALLBACK_POSTER;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <section className="relative w-full pt-2 sm:pt-3 md:pt-4 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[0.02em] text-balance text-foreground mb-4 sm:mb-3">
            {t("home.videoTitle")}
          </h2>
          <p className="text-sm sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            {t("home.videoDescription")}
          </p>
        </motion.div>

        {/* YouTube player, revealed once the poster is clicked */}
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
                  src={poster}
                  alt={documentary?.title ? tr(documentary.title) : t("home.documentaryAlt")}
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
                  aria-label={t("home.playImpactVideo")}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-0.5 h-7 w-7 sm:h-8 sm:w-8" />
                  </span>
                </button>
              </>
            )}

            {isPlaying && (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title={documentary?.title ? tr(documentary.title) : t("home.documentaryAlt")}
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
