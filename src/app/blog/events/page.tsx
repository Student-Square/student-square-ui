"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetEventsQuery } from "@/redux/features/events/eventsApi";
import {
  ArrowUpRight,
  Calendar,
  CalendarDays,
  Globe,
  Loader2,
  MapPin,
} from "lucide-react";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsPage() {
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming");
  const { data, isLoading } = useGetEventsQuery({ when, limit: 30 });
  const events = data?.data ?? [];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-10 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <CalendarDays className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Events
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Workshops, seminars and community programs run by Student Square across Bangladesh.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              {(["upcoming", "past"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWhen(w)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                    when === w ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading events…
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center max-w-md mx-auto">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                {when === "upcoming" ? "No upcoming events right now — check back soon." : "No past events on record yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    href={`/blog/events/${event.slug}`}
                    className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300"
                  >
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      <span className="text-[10px] font-bold uppercase">
                        {new Date(event.startsAt).toLocaleDateString("en-GB", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold leading-none">
                        {new Date(event.startsAt).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground group-hover:text-emerald-600 transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDateTime(event.startsAt)}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {event.location}
                          </span>
                        )}
                        {event.onlineUrl && (
                          <span className="inline-flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Online
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
