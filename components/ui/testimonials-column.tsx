"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Testimonial {
  text: string
  name: string
  role: string
  image?: string
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[]
  duration?: number
  className?: string
}

export function TestimonialsColumn({ testimonials, duration = 15, className }: TestimonialsColumnProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        animate={{
          y: ["0%", "-50%"],
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
        className="flex flex-col gap-6"
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:border-emerald-500/30 overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Large Image at Top */}
      {testimonial.image && (
        <div className="relative w-full h-56 sm:h-64 overflow-hidden">
          <Image
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90" />
        </div>
      )}
      
      {/* Content Section */}
      <div className="relative p-6 sm:p-8">
        <p className="text-foreground/80 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
        
        {/* Name and Role */}
        <div className="pt-4 border-t border-border/30">
          <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}
