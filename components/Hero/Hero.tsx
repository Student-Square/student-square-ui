"use client";

import HeroCards from "./HeroCards";
import RotatingText from "@/components/ui/rotating-text";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Users, GraduationCap, Heart, School, UserCheck } from "lucide-react";

const heroStats = [
  // 1-1 counselling support
  {
    icon: Heart,
    value: "1-1",
    label: "Counselling",
    gradient: "from-emerald-500/20 to-teal-500/20",
    accent: "from-emerald-500 to-teal-500",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  // Total programs delivered
  {
    icon: GraduationCap,
    value: "150+",
    label: "Programs Delivered",
    gradient: "from-blue-500/20 to-cyan-500/20",
    accent: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  // Students reached across campuses
  {
    icon: School,
    value: "25+",
    label: "Campus Students",
    gradient: "from-rose-500/20 to-pink-500/20",
    accent: "from-rose-500 to-pink-500",
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  // Active, engaged members
  {
    icon: UserCheck,
    value: "500+",
    label: "Active Members",
    gradient: "from-amber-500/20 to-orange-500/20",
    accent: "from-amber-500 to-orange-500",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8">
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Hero Content */}
      <div className="relative z-10 py-4 sm:py-6 lg:py-10">
        {/* Hero Text */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-center sm:mb-10 lg:mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm 2xl:px-5 2xl:py-2 2xl:text-base 3xl:px-6 3xl:py-2.5 3xl:text-lg 4xl:text-xl"
            >
              <Sparkles className="h-2.5 w-2.5 text-primary sm:h-4 sm:w-4" />
              <span className="uppercase tracking-wider">Empowering Tomorrow&apos;s Leaders</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto max-w-4xl font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl"
            >
              <span className="text-foreground">Empowering </span>
              
              <span className="text-foreground"> Students</span>
              <br />
              <span className="mt-2 inline-flex flex-wrap items-center justify-center gap-2 sm:mt-4 md:mt-6">
                <span className="text-foreground">Through</span>
                <RotatingText
                  texts={["Counselling", "Advocacy", "Support", "Education", "Community"]}
                  mainClassName="px-2 sm:px-3 md:px-4 bg-emerald-600 text-white overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg shadow-lg"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:mt-6 sm:text-base lg:text-lg 2xl:max-w-3xl 2xl:text-xl 3xl:max-w-4xl 3xl:text-2xl 4xl:max-w-5xl 4xl:text-3xl"
            >
              Student Square provides counselling, advocacy, and community programs 
              to help students and families thrive in their educational journey.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex flex-row items-center justify-center gap-2 sm:mt-8 sm:gap-4"
            >
              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-emerald-600 px-4 text-xs font-medium text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 sm:h-12 sm:gap-2 sm:px-8 sm:text-sm 2xl:h-14 2xl:px-10 2xl:text-base 3xl:h-16 3xl:px-12 3xl:text-lg 4xl:h-20 4xl:px-14 4xl:text-xl"
              >
                <span>Get Involved</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex h-9 items-center justify-center gap-1.5 rounded-full bg-zinc-800 px-4 text-xs font-medium text-white transition-all hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 sm:h-12 sm:gap-2 sm:px-8 sm:text-sm 2xl:h-14 2xl:px-10 2xl:text-base 3xl:h-16 3xl:px-12 3xl:text-lg 4xl:h-20 4xl:px-14 4xl:text-xl"
              >
                <span>Contact Us</span>
              </motion.button>
            </motion.div>

            {/* Stat Bar under CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 sm:mt-10 lg:mt-12"
            >
              {/* Separate stat cards */}
              <div className="mx-auto grid w-full max-w-5xl grid-cols-4 gap-2 sm:gap-4">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group relative"
                  >
                    {/* Glow */}
                    <div
                      className={`pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition duration-500 group-hover:opacity-25 ${stat.accent}`}
                    />

                    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-transparent px-2.5 py-3 shadow-lg transition-all duration-300 group-hover:shadow-2xl sm:px-5 sm:py-4">
                      {/* Value */}
                      <span
                        className={`mb-0.5 bg-gradient-to-br bg-clip-text text-xl font-bold text-transparent transition-all duration-300 sm:mb-1 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${stat.accent}`}
                      >
                        {stat.value}
                      </span>

                      {/* Label */}
                      <span className="text-center text-[10px] font-medium leading-tight text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-xs lg:text-sm">
                        {stat.label}
                      </span>

                      {/* Decorative corner */}
                      <div
                        className={`pointer-events-none absolute right-0 top-0 h-10 w-10 rounded-bl-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-40 sm:h-14 sm:w-14 ${stat.gradient}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>

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
