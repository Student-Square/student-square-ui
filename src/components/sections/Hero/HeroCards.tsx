"use client";

import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetCardsQuery } from "@/redux/features/content/contentApi";
import type { ApiFeatureCard } from "@/types/content";
import { useMediaQuery } from "@/hooks/use-media-query";

const PLACEHOLDER_IMAGE = "/images/student-square-school-session.jpg";

// Animated Progress Indicator
const ProgressIndicator = ({ duration = 7000 }: { duration?: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % duration;
      const progressPercent = (elapsed / duration) * 100;
      setProgress(progressPercent);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [duration]);

  return (
    <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-white/10 sm:h-1">
      <motion.div
        className="h-full bg-white/60"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({
  image,
  title,
  titleBn,
  category,
  href,
  isMain = false,
  delay = 0,
}: {
  image: string | null;
  title: string;
  titleBn?: string | null;
  category: string;
  href?: string;
  isMain?: boolean;
  delay?: number;
}) => {
  const resolvedImage = image ?? PLACEHOLDER_IMAGE;
  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl ${
      isMain ? "h-[220px] sm:h-[260px] md:h-[300px] lg:h-full" : "h-[120px] sm:h-[150px] md:h-[200px] lg:h-[240px]"
    }`}
  >
    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {isMain ? (
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_70%,black_100%)]">
              <Image
                src={resolvedImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
                priority={isMain}
                sizes={
                  isMain
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                }
              />
            </div>
          ) : (
            <Image
              src={resolvedImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
              priority={isMain}
              sizes={
                isMain
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
    <ProgressiveBlur
      className="pointer-events-none absolute bottom-0 left-0 h-[25%] w-full sm:h-[30%]"
      blurIntensity={1.5}
      blurLayers={4}
    />

    <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 md:p-6">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
        className="mb-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-white backdrop-blur-sm sm:mb-2 sm:px-3 sm:py-1 sm:text-xs"
      >
        {category}
      </motion.span>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3 }}
        className={`font-semibold leading-tight text-white ${
          isMain
            ? "text-xs sm:text-xl md:text-2xl lg:text-3xl"
            : "text-[10px] sm:text-base md:text-lg lg:text-xl"
        }`}
      >
        {title}
      </motion.h3>
      {isMain && titleBn && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="mt-1 text-[9px] sm:text-xs md:text-sm text-white/75 leading-relaxed line-clamp-2"
        >
          {titleBn}
        </motion.p>
      )}
    </div>

    {isMain && <ProgressIndicator duration={7000} />}

    {/* Hover affordance — arrow in top-right corner */}
    {href && (
      <span
        aria-hidden
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300"
      >
        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
    )}

    {/* Click overlay — covers the whole card */}
    {href && (
      <Link
        href={href}
        aria-label={title}
        className="absolute inset-0 z-40 rounded-2xl sm:rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      />
    )}
  </motion.div>
  );
};

// Skeleton card — preserves the hero layout while data is loading
const SkeletonCard = ({ isMain = false }: { isMain?: boolean }) => (
  <div
    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-muted/60 animate-pulse ${
      isMain
        ? "h-[220px] sm:h-[260px] md:h-[300px] lg:h-full"
        : "h-[120px] sm:h-[150px] md:h-[200px] lg:h-[240px]"
    }`}
  />
);

const HeroCards = () => {
  // Fetch all cards; RTK Query deduplicates requests automatically.
  const { data: allCards = [], isLoading, isError } = useGetCardsQuery();

  const mainCards     = allCards.filter((c: ApiFeatureCard) => c.slot === "main_carousel");
  const secondary     = allCards.find((c: ApiFeatureCard) => c.slot === "secondary");
  const third         = allCards.find((c: ApiFeatureCard) => c.slot === "third");
  const blog1         = allCards.find((c: ApiFeatureCard) => c.slot === "blog_1");
  const blog2         = allCards.find((c: ApiFeatureCard) => c.slot === "blog_2");

  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 639px)");

  // Rotate the main carousel. Declared BEFORE any early returns so the hook
  // order is identical on every render (Rules of Hooks).
  useEffect(() => {
    if (mainCards.length <= 1) return;
    const mainInterval = setInterval(() => {
      setCurrentMainIndex((prev) => (prev + 1) % mainCards.length);
    }, 7000);
    return () => clearInterval(mainInterval);
  }, [mainCards.length]);

  // Loading skeleton — keeps the page from jumping when data arrives
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
          <div className="col-span-2 lg:col-span-2 lg:row-span-2">
            <SkeletonCard isMain />
          </div>
          <div className="lg:col-span-1"><SkeletonCard /></div>
          <div className="lg:col-span-1"><SkeletonCard /></div>
        </div>
        {!isMobile && (
          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:mt-6 lg:gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
      </div>
    );
  }

  // Backend down or empty result — fail open with a quiet placeholder
  if (isError || allCards.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <p className="text-sm font-semibold text-foreground">
            Featured content will be back shortly.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;re refreshing what&apos;s on display. Check back in a moment.
          </p>
        </div>
      </div>
    );
  }

  const mainFeature = mainCards[currentMainIndex];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
        {/* Main Feature - Large Card */}
        {mainFeature && (
          <div className="col-span-2 lg:col-span-2 lg:row-span-2">
            <motion.div
              key={mainFeature.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full"
            >
              <FeatureCard
                image={mainFeature.image}
                title={mainFeature.title}
                titleBn={mainFeature.titleBn}
                category={mainFeature.category}
                href={mainFeature.href}
                isMain
              />
            </motion.div>
          </div>
        )}

        {/* Secondary Feature */}
        {secondary && (
          <div className="lg:col-span-1">
            <FeatureCard
              image={secondary.image}
              title={secondary.title}
              category={secondary.category}
              href={secondary.href}
              delay={0.1}
            />
          </div>
        )}

        {/* Third Feature */}
        {third && (
          <div className="lg:col-span-1">
            <FeatureCard
              image={third.image}
              title={third.title}
              category={third.category}
              href={third.href}
              delay={0.2}
            />
          </div>
        )}
      </div>

      {/* Bottom Row - Blog Cards (Stories & Scholarships) - Hidden on mobile */}
      {!isMobile && (blog1 || blog2) && (
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:mt-6 lg:gap-6">
          {blog1 && (
            <FeatureCard
              image={blog1.image}
              title={blog1.title}
              category={blog1.category}
              href={blog1.href}
              delay={0.3}
            />
          )}
          {blog2 && (
            <FeatureCard
              image={blog2.image}
              title={blog2.title}
              category={blog2.category}
              href={blog2.href}
              delay={0.4}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HeroCards;
