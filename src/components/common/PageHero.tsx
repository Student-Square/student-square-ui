"use client";

import { motion } from "motion/react";
import { fadeInOnMount } from "@/lib/motion";

type PageHeroProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  /** Override the responsive height. Defaults to the standard about-page banner. */
  heightClassName?: string;
};

/** Default banner height — reduced on small screens, taller on desktop. */
const DEFAULT_HEIGHT = "h-[35vh] sm:h-[45vh] lg:h-[55vh] min-h-[220px]";

/**
 * Full-bleed page banner: cover image, dark gradient, animated title.
 * Sits directly below the fixed navbar (mt-* offsets).
 */
export default function PageHero({
  imageSrc,
  imageAlt,
  title,
  heightClassName = DEFAULT_HEIGHT,
}: PageHeroProps) {
  return (
    <section
      className={`relative mt-12 sm:mt-14 lg:mt-16 ${heightClassName} w-full overflow-hidden`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      <div className="absolute bottom-0 left-0 px-6 pb-10 sm:px-10 lg:px-16">
        <motion.h1
          {...fadeInOnMount}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}
