"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { partnersData } from "@/data/partners"

export default function Partners() {
  return (
    <section className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container relative z-10 w-full max-w-7xl mx-auto 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance text-foreground mb-4 sm:mb-3">
            Trusted by the best companies
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-4">
            Companies that have been supporting our organization.
          </p>
        </motion.div>

        {/* Desktop Partners Carousel */}
        <motion.div
          className="hidden sm:block text-center px-4 overflow-hidden animate-fade-in-trust"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden w-full">
            {/* Left gradient fade */}
            <div className="absolute left-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right gradient fade */}
            <div className="absolute right-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-6 sm:gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-all duration-500 animate-slide-left">
              {/* First set of partners */}
              <div className="flex items-center gap-6 sm:gap-8 md:gap-12 whitespace-nowrap">
                {partnersData.map((partner) => (
                  <Link
                    key={partner.id}
                    href={partner.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0"
                  >
                    <div className="relative w-28 sm:w-32 md:w-40 h-20 sm:h-24 md:h-28 flex items-center justify-center">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 200px"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-6 sm:gap-8 md:gap-12 whitespace-nowrap">
                {partnersData.map((partner) => (
                  <Link
                    key={`${partner.id}-dup`}
                    href={partner.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0"
                  >
                    <div className="relative w-28 sm:w-32 md:w-40 h-20 sm:h-24 md:h-28 flex items-center justify-center">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 200px"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Partners Carousel */}
        <motion.div
          className="sm:hidden text-center px-4 mb-8 overflow-hidden animate-fade-in-trust"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden w-full max-w-sm mx-auto">
            {/* Left blur fade */}
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right blur fade */}
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-4 opacity-70 animate-slide-left-mobile">
              {/* First set of partners */}
              <div className="flex items-center gap-4 whitespace-nowrap">
                {partnersData.map((partner) => (
                  <Link
                    key={partner.id}
                    href={partner.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0"
                  >
                    <div className="relative w-20 h-16 flex items-center justify-center">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        sizes="80px"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-4 whitespace-nowrap">
                {partnersData.map((partner) => (
                  <Link
                    key={`${partner.id}-dup`}
                    href={partner.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0"
                  >
                    <div className="relative w-20 h-16 flex items-center justify-center">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        sizes="80px"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
