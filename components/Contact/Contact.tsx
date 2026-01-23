"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "sent">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    setTimeout(() => setFormState("sent"), 1500)
  }

  return (
    <section id="contact-form" className="py-10 sm:py-12 md:py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            className="space-y-8 lg:space-y-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-6">Get in Touch</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-md">
                Connect with our strategic investment team to discuss ventures, partnerships, or institutional
                inquiries.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">Head Office</h4>
                  <p className="text-sm sm:text-base text-muted-foreground font-light">Godhagarhi, Rajshahi </p>
                </div>
              </div>

              

              <div className="flex gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Mail size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">Email Inquiries</h4>
                  <p className="text-sm sm:text-base text-muted-foreground font-light">contact@studentsquare.org</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light">support@studentsquaer.org</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-card/50 border border-border/50 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {formState === "sent" ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Send size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Message Sent</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Thank you for reaching out. Our team will contact you shortly.</p>
                <Button
                  variant="outline"
                  className="mt-6 sm:mt-8 rounded-full bg-transparent"
                  onClick={() => setFormState("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="full-name" className="text-xs sm:text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      id="full-name"
                      name="full-name"
                      placeholder="Enter your name"
                      className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@company.com"
                      className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="subject" className="text-xs sm:text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Venture Inquiry / Partnership"
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
                    required
                    aria-required="true"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={formState === "submitting"}
                  aria-label={formState === "submitting" ? "Submitting your inquiry" : "Submit contact form inquiry"}
                  className="w-full bg-primary py-4 sm:py-6 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold hover:shadow-lg transition-all"
                >
                  {formState === "submitting" ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
