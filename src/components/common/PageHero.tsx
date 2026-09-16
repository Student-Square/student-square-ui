"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeInOnMount } from "@/lib/motion";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { HERO_TOP_SCRIM } from "./Header/navbarHeight";

type PageHeroProps = {
  imageSrc: string;
  /** English alt text; shown in Bangla when it is a known string. */
  imageAlt: string;
  /** Dictionary key for the alt text, for server pages that cannot call t(). */
  imageAltKey?: string;
  /**
   * A string is translated when it is a known one (editable page titles come
   * from the API in English). Server pages pass <T k="…" /> instead.
   */
  title: ReactNode;
  /** Override the responsive height. Defaults to the standard about-page banner. */
  heightClassName?: string;
};

/** Default banner height — reduced on small screens, taller on desktop. */
const DEFAULT_HEIGHT = "h-[35vh] sm:h-[45vh] lg:h-[55vh] min-h-[220px]";

/**
 * Full-bleed page banner: cover image, dark gradient, animated title.
 *
 * The image runs to the very top of the page and the fixed navbar floats over
 * it — the same treatment the homepage hero uses. Pushing the section down
 * instead (with a top margin) left a band of bare page background between the
 * navbar and the image, which read as a black bar on dark backgrounds.
 *
 * Because the navbar is transparent until you scroll, the top scrim below is
 * what keeps its links legible over a bright photo.
 */
export default function PageHero({
  imageSrc,
  imageAlt,
  imageAltKey,
  title,
  heightClassName = DEFAULT_HEIGHT,
}: PageHeroProps) {
  const { t, tr } = useLanguage();
  return (
    <section
      className={`relative ${heightClassName} w-full overflow-hidden`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAltKey ? t(imageAltKey) : tr(imageAlt)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      <div className={HERO_TOP_SCRIM} />
      <div className="absolute bottom-0 left-0 px-6 pb-10 sm:px-10 lg:px-16">
        <motion.h1
          {...fadeInOnMount}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
        >
          {typeof title === "string" ? tr(title) : title}
        </motion.h1>
      </div>
    </section>
  );
}
