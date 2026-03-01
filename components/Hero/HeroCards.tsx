"use client";

import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cardData } from "@/data/cardData";
import { useMediaQuery } from "@/hooks/use-media-query";


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
  category,
  isMain = false,
  delay = 0,
}: {
  image: string;
  title: string;
  category: string;
  isMain?: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl ${
      isMain ? "h-[160px] sm:h-[220px] md:h-[280px] lg:h-full" : "h-[140px] sm:h-[180px] md:h-[220px] lg:h-[240px]"
    }`}
  >
    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]"
            priority={isMain}
            sizes={isMain ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
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
      

    </div>

    {isMain && <ProgressIndicator duration={7000} />}
    
    {/* Hover border effect */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 ease-out group-hover:border-white/20 sm:rounded-3xl" />
  </motion.div>
);

const HeroCards = () => {
  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    const mainInterval = setInterval(() => {
      setCurrentMainIndex((prev) => (prev + 1) % cardData.mainFeature.length);
    }, 7000);

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => prev + 1);
    }, 3000);

    return () => {
      clearInterval(mainInterval);
      clearInterval(imageInterval);
    };
  }, []);

  const mainFeature = cardData.mainFeature[currentMainIndex];
  const mainImage = mainFeature.images[imageIndex % mainFeature.images.length];
  const secondaryFeature = cardData.secondaryFeature[0];
  const thirdFeature = cardData.thirdFeature[0];
  const blog1 = cardData.blogCard1[0];
  const blog2 = cardData.blogCard2[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
      {/* Main Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
        {/* Main Feature - Large Card */}
        <div className="lg:col-span-2 lg:row-span-2">
          <motion.div
            key={mainFeature.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full"
          >
            <FeatureCard
              image={mainImage}
              title={mainFeature.title}
              category={mainFeature.category}
              isMain
            />
          </motion.div>
        </div>

        {/* Secondary Feature */}
        <div className="lg:col-span-1">
          <FeatureCard
            image={secondaryFeature.images[0]}
            title={secondaryFeature.title}
            category={secondaryFeature.category}
            delay={0.1}
          />
        </div>

        {/* Third Feature */}
        <div className="lg:col-span-1">
          <FeatureCard
            image={thirdFeature.images[0]}
            title={thirdFeature.title}
            category={thirdFeature.category}
            delay={0.2}
          />
        </div>
      </div>

      {/* Bottom Row - Blog Cards (Stories & Scholarships) - Hidden on mobile */}
      {!isMobile && (
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:mt-6 lg:gap-6">
          <FeatureCard
            image={blog1.image}
            title={blog1.title}
            category={blog1.category}
            delay={0.3}
          />
          <FeatureCard
            image={blog2.image}
            title={blog2.title}
            category={blog2.category}
            delay={0.4}
          />
        </div>
      )}
    </div>
  );
};

export default HeroCards;
