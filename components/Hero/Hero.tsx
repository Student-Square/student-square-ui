"use client";

import HeroCards from "./HeroCards";
import Aurora from "@/components/ui/aurora-effect";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8">
      {/* Aurora - only in Hero section */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Aurora amplitude={1.2} blend={0.6} speed={0.5} />
        <div className="absolute inset-0 bg-background/50 dark:bg-background/60" />
      </div>

      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Hero Content */}
      <div className="relative z-10 py-2 sm:py-4 lg:py-4">
        {/* Hero Text */}
        {/* <HeroIntro /> */}

        {/* Hero Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <HeroCards />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
