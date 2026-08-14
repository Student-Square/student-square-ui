"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetEventBySlugQuery } from "@/redux/features/events/eventsApi";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
} from "lucide-react";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventView({ slug }: { slug: string }) {
  const { data: event, isLoading } = useGetEventBySlugQuery(slug);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mt-12 sm:mt-14 lg:mt-16" />
        <div className="flex items-center justify-center gap-2 py-40 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Loading event…
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) redirect("/blog/events");

  const isPast = new Date(event.startsAt) < new Date();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-6"
          >
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog/events" className="hover:text-emerald-600 transition-colors">Events</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{event.title}</span>
          </motion.div>

          {isPast && (
            <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              Past event
            </span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight"
          >
            {event.title}
          </motion.h1>

          <div className="mt-6 space-y-2.5 text-sm text-foreground">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600 shrink-0" /> {formatDateTime(event.startsAt)}
            </p>
            {event.location && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" /> {event.location}
              </p>
            )}
            {event.onlineUrl && (
              <p className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
                <a href={event.onlineUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  Join online
                </a>
              </p>
            )}
          </div>

          {event.coverImage && (
            <div className="mt-8 aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.coverImage.url} alt={event.coverImage.alt ?? event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mt-8 space-y-5 text-base text-foreground leading-[1.85]">
            {event.description.split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {event.registrationUrl && !isPast && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
            >
              Register now <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <div className="mt-10 pt-6 border-t border-border">
            <Link href="/blog/events" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
