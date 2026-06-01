"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function Contact() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "sent">("idle")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [weeklyUpdates, setWeeklyUpdates] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) return
    setFormState("submitting")
    setTimeout(() => setFormState("sent"), 1500)
  }

  const mapEmbedUrl =
    "https://maps.google.com/maps?output=embed&q=STUDENT+SQUARE+OFFICE,+F89F%2B54W+Model+Thana+Road,+Godagari,+Rajshahi,+Bangladesh&z=18&t=m"

  return (
    <section id="contact-form" className="py-10 sm:py-12 md:py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: Address + Map (stacked) */}
          <motion.div
            className="flex flex-col gap-6 lg:gap-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.02em] text-foreground mb-3 sm:mb-6">Get in Touch</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-md mb-6">
                Connect with our strategic investment team to discuss ventures, partnerships, or institutional
                inquiries.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">Head Office</h4>
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      2nd Floor, Jalal Super Market, Thana Road
                      <br />
                      Godagari-6290, Rajshahi, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">Phone / Email</h4>
                    <div>
                      <a href="tel:+8801711455858" className="block text-sm sm:text-base text-muted-foreground font-light hover:text-primary transition-colors">+88 01711455858</a>
                      <a href="mailto:studentsquarebd@gmail.com" className="block text-sm sm:text-base text-muted-foreground font-light hover:text-primary transition-colors">studentsquarebd@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex flex-col gap-2">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 shadow-lg min-h-[250px] sm:min-h-[280px] lg:min-h-[320px] flex-1">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "250px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Student Square Office"
                  className="w-full h-full min-h-[250px]"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=STUDENT+SQUARE+OFFICE,+F89F%2B54W+Model+Thana+Road,+Godagari,+Rajshahi,+Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <MapPin size={16} />
                Open in Google Maps
              </a>
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
                  <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">
                    Phone Number (preferably WhatsApp)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                    aria-required="false"
                  />
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
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 min-h-[180px] sm:min-h-[220px] text-sm sm:text-base"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      required
                      aria-required="true"
                      className="mt-0.5"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      I have read and accept the terms and conditions
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={weeklyUpdates}
                      onCheckedChange={(checked) => setWeeklyUpdates(checked === true)}
                      className="mt-0.5"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      I would like to receive weekly updates from MRG
                    </span>
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={formState === "submitting" || !termsAccepted}
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
