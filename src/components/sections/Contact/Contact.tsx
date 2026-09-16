"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/components/i18n/LanguageProvider"
import {
  CONTACT_LIMITS as LIMITS,
  useSubmitContactMessageMutation,
  type ContactSubmitInput,
} from "@/redux/features/contact/contactApi"
import { siteConfig } from "@/config/site"

type ContactField = keyof Omit<ContactSubmitInput, "newsletterOptIn">

// Shown when the server rejects a field. The inputs' own constraints catch most
// of these first, but the server has the final say: it trims before counting,
// and its email check is stricter than the browser's.
const FIELD_MESSAGE_KEYS: Record<ContactField, string> = {
  name: "contact.errorName",
  email: "contact.errorEmail",
  phone: "contact.errorPhone",
  subject: "contact.errorSubject",
  message: "contact.errorMessage",
}

const isContactField = (field: string): field is ContactField =>
  Object.keys(FIELD_MESSAGE_KEYS).includes(field)

function FieldError({ field, message }: { field: ContactField; message?: string }) {
  if (!message) return null
  return (
    <p id={`${field}-error`} className="text-xs sm:text-sm text-destructive">
      {message}
    </p>
  )
}

export default function Contact() {
  const { t } = useLanguage()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [weeklyUpdates, setWeeklyUpdates] = useState(false)
  const [submitContactMessage, { isLoading }] = useSubmitContactMessageMutation()

  // Ties a field to its error message, and clears the message as soon as the
  // visitor starts correcting that field.
  const fieldProps = (field: ContactField) => ({
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby": fieldErrors[field] ? `${field}-error` : undefined,
    onChange: () => {
      if (!fieldErrors[field]) return
      setFieldErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!termsAccepted) return
    setError(null)
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const phone = String(form.get("phone") ?? "").trim()

    try {
      await submitContactMessage({
        name: String(form.get("full-name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: phone || undefined,
        subject: String(form.get("subject") ?? "").trim(),
        message: String(form.get("message") ?? "").trim(),
        newsletterOptIn: weeklyUpdates,
      }).unwrap()
      setSent(true)
    } catch (err) {
      // A 400 names the rejected fields. The rate limiter answers 429 in plain
      // text, which RTK reports as a PARSING_ERROR with the status kept in
      // originalStatus.
      const { status, originalStatus, data } = err as {
        status?: number | string
        originalStatus?: number
        data?: { error?: { body?: { field: string }[] } }
      }
      const rejected = (data?.error?.body ?? []).map((issue) => issue.field).filter(isContactField)

      if (status === 400 && rejected.length > 0) {
        setFieldErrors(Object.fromEntries(rejected.map((field) => [field, t(FIELD_MESSAGE_KEYS[field])])))
        setError(t("contact.errorCheckFields"))
      } else if (status === 429 || originalStatus === 429) {
        setError(t("contact.errorRateLimit"))
      } else {
        setError(t("contact.errorGeneric"))
      }
    }
  }

  const mapEmbedUrl =
    "https://maps.google.com/maps?output=embed&q=STUDENT+SQUARE+OFFICE,+F89F%2B54W+Model+Thana+Road,+Godagari,+Rajshahi,+Bangladesh&z=18&t=m"

  return (
    <section id="contact-form" className="py-6 sm:py-8 md:py-10 relative z-10">
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.02em] text-foreground mb-3 sm:mb-6">{t("contact.getInTouch")}</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-md mb-6">
                {t("contact.intro")}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{t("contact.headOffice")}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {t("contact.addressLine1")}
                      <br />
                      {t("contact.addressLine2")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{t("contact.phoneEmail")}</h4>
                    <div>
                      <a href={siteConfig.contact.phoneTel} className="block text-sm sm:text-base text-muted-foreground font-light hover:text-primary transition-colors">{siteConfig.contact.phoneDisplay}</a>
                      <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="block text-sm sm:text-base text-muted-foreground font-light hover:text-primary transition-colors">{t("contact.whatsapp")}: {siteConfig.contact.whatsappDisplay}</a>
                      <a href={`mailto:${siteConfig.contact.email}`} className="block text-sm sm:text-base text-muted-foreground font-light hover:text-primary transition-colors">{siteConfig.contact.email}</a>
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
                  title={t("contact.officeMapTitle")}
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
                {t("contact.openMaps")}
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
            {sent ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Send size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{t("contact.messageSent")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t("contact.thankYou")}</p>
                <Button
                  variant="outline"
                  className="mt-6 sm:mt-8 rounded-full bg-transparent"
                  onClick={() => {
                    setSent(false)
                    setFieldErrors({})
                    setTermsAccepted(false)
                    setWeeklyUpdates(false)
                  }}
                >
                  {t("contact.sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="full-name" className="text-xs sm:text-sm font-medium text-foreground">
                      {t("contact.fullName")}
                    </label>
                    <Input
                      id="full-name"
                      name="full-name"
                      placeholder={t("contact.namePlaceholder")}
                      className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                      required
                      aria-required="true"
                      minLength={LIMITS.name.min}
                      maxLength={LIMITS.name.max}
                      {...fieldProps("name")}
                    />
                    <FieldError field="name" message={fieldErrors.name} />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
                      {t("contact.emailAddress")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@company.com"
                      className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                      required
                      aria-required="true"
                      maxLength={LIMITS.email.max}
                      // type="email" alone accepts "name@example"; the server
                      // wants a domain with a dot in it.
                      pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                      title={t("contact.errorEmail")}
                      {...fieldProps("email")}
                    />
                    <FieldError field="email" message={fieldErrors.email} />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">
                      {t("contact.phoneNumber")}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                    aria-required="false"
                    maxLength={LIMITS.phone.max}
                    {...fieldProps("phone")}
                  />
                  <FieldError field="phone" message={fieldErrors.phone} />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="subject" className="text-xs sm:text-sm font-medium text-foreground">
                    {t("contact.subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder={t("contact.subjectPlaceholder")}
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 text-sm sm:text-base"
                    required
                    aria-required="true"
                    minLength={LIMITS.subject.min}
                    maxLength={LIMITS.subject.max}
                    {...fieldProps("subject")}
                  />
                  <FieldError field="subject" message={fieldErrors.subject} />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium text-foreground">
                    {t("contact.message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("contact.messagePlaceholder")}
                    className="rounded-lg sm:rounded-xl border-border/50 bg-background/50 min-h-[180px] sm:min-h-[220px] text-sm sm:text-base"
                    required
                    aria-required="true"
                    minLength={LIMITS.message.min}
                    maxLength={LIMITS.message.max}
                    {...fieldProps("message")}
                    aria-describedby={fieldErrors.message ? "message-error" : "message-hint"}
                  />
                  {fieldErrors.message ? (
                    <FieldError field="message" message={fieldErrors.message} />
                  ) : (
                    <p id="message-hint" className="text-xs sm:text-sm text-muted-foreground">
                      {t("contact.messageHint")}
                    </p>
                  )}
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
                      {t("contact.terms")}
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={weeklyUpdates}
                      onCheckedChange={(checked) => setWeeklyUpdates(checked === true)}
                      className="mt-0.5"
                    />
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {t("contact.updates")}
                    </span>
                  </label>
                </div>
                {error && (
                  <p role="alert" className="text-xs sm:text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || !termsAccepted}
                  aria-label={isLoading ? t("contact.submittingAria") : t("contact.submitAria")}
                  className="w-full bg-primary py-4 sm:py-6 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold hover:shadow-lg transition-all"
                >
                  {isLoading ? t("contact.sending") : t("contact.submitInquiry")}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
