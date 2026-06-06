'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { storiesData } from "@/data/stories";
import { useGetStoryBySlugQuery } from "@/redux/features/stories/storiesApi";
import type { ApiStory } from "@/types/stories";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  GraduationCap,
  Loader2,
  MapPin,
  Quote,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi";
import StoryCard from "@/components/sections/Stories/StoryCard";

function ShareButtons() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
        <Share2 className="h-3.5 w-3.5" />
        Share
      </span>
      {[
        { label: "Share on Facebook", Icon: Facebook },
        { label: "Share on Twitter", Icon: Twitter },
        { label: "Share on LinkedIn", Icon: Linkedin },
      ].map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        onClick={() => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
        className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Legacy static story view (numeric IDs)
// ──────────────────────────────────────────────
function StaticStoryView({ id }: { id: number }) {
  const story = storiesData.find((s) => s.id === id);
  if (!story) redirect("/blog/real-life-stories");

  const related = storiesData.filter((s) => s.id !== story.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl" />
        </div>

        <section className="pt-8 sm:pt-10 lg:pt-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-5"
            >
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog/real-life-stories" className="hover:text-emerald-600 transition-colors">
                Real Life Stories
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground line-clamp-1">{story.name}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between gap-3 flex-wrap mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                Real Life Story · #{String(story.id).padStart(3, "0")}
              </span>
              <a
                href="#full-story"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 hover:gap-3 transition-all"
              >
                Read the full story <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-50/70 via-card to-card dark:from-emerald-950/30 dark:via-card dark:to-card shadow-xl shadow-emerald-500/5"
            >
              <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
              <Quote className="absolute top-6 sm:top-8 left-6 sm:left-10 h-16 w-16 sm:h-20 sm:w-20 text-emerald-200/70 dark:text-emerald-900/60 pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-12">
                <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col justify-center">
                  <motion.blockquote
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-xl sm:text-2xl lg:text-3xl text-foreground font-semibold italic leading-snug tracking-tight pl-2 sm:pl-4"
                  >
                    &ldquo;{story.quote}&rdquo;
                  </motion.blockquote>

                  <div className="mt-6 sm:mt-8 h-px bg-gradient-to-r from-emerald-500/40 via-border to-transparent" />

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className="mt-5 sm:mt-6"
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                      {story.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                        {story.role}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        {story.university}
                      </span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Award className="h-3.5 w-3.5" />
                      {story.achievement}
                    </span>
                  </motion.div>
                  <a href="#full-story" className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    Read the full story <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-4 order-1 lg:order-2 flex items-center justify-center"
                >
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 rounded-2xl bg-emerald-500/20 dark:bg-emerald-400/15" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-lg shadow-emerald-500/10">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="full-story" className="py-10 sm:py-12 lg:py-16 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">The full story</p>
              <p className="text-[11px] text-muted-foreground">Joined Student Square in {story.joinedYear}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              {story.body.map((para, i) => (
                <p
                  key={i}
                  className={`text-base text-foreground leading-[1.85] ${
                    i === 0
                      ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-emerald-600 first-letter:leading-none"
                      : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {story.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-10 p-6 sm:p-7 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20"
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                  <Award className="h-3.5 w-3.5" />
                  Highlights from {story.name.split(" ")[0]}&apos;s journey
                </p>
                <ul className="space-y-3">
                  {story.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{h}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap"
            >
              <Link href="/blog/real-life-stories" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors">
                <ArrowLeft className="h-4 w-4" /> All stories
              </Link>
              <ShareButtons />
            </motion.div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pb-16 sm:pb-20 lg:pb-24 border-t border-border pt-12 sm:pt-14 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-900/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Keep reading</p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">More stories</h2>
                </div>
                <Link href="/blog/real-life-stories" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:gap-2.5 transition-all">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {related.map((r, i) => (
                  <motion.article
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/blog/real-life-stories/${r.id}`}
                      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                        <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white text-sm font-bold drop-shadow leading-snug">{r.name}</h3>
                          <p className="text-white/85 text-[11px]">{r.role}</p>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-[11px] text-muted-foreground mb-2">{r.university}</p>
                        <p className="text-xs italic text-foreground leading-relaxed line-clamp-2 flex-1">&ldquo;{r.quote}&rdquo;</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                          Read more <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
      <Footer />
    </main>
  );
}

// ──────────────────────────────────────────────
// API story view (slug-based)
// ──────────────────────────────────────────────
function ApiStoryView({ story }: { story: ApiStory }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(story.body);
  const paragraphs = isHtml ? [] : story.body.split("\n\n").filter(Boolean);

  const { data: otherStoriesData } = useGetStoriesQuery({ limit: 4 });
  const otherStories = (otherStoriesData?.data ?? []).filter((s) => s.slug !== story.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Hero */}
        <section className="pt-8 sm:pt-10 lg:pt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-5"
            >
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog/real-life-stories" className="hover:text-emerald-600 transition-colors">Real Life Stories</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground line-clamp-1">{story.name}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between gap-3 flex-wrap mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                Real Life Story
              </span>
              <a href="#full-story" className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-emerald-600 hover:gap-3 transition-all">
                Read the full story <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-50/70 via-card to-card dark:from-emerald-950/30 dark:via-card dark:to-card shadow-xl shadow-emerald-500/5"
            >
              <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
              <Quote className="absolute top-6 sm:top-8 left-6 sm:left-10 h-16 w-16 sm:h-20 sm:w-20 text-emerald-200/70 dark:text-emerald-900/60 pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-12">
                <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col justify-center">
                  {story.quote && (
                    <motion.blockquote
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-xl sm:text-2xl lg:text-3xl text-foreground font-semibold italic leading-snug tracking-tight pl-2 sm:pl-4"
                    >
                      &ldquo;{story.quote}&rdquo;
                    </motion.blockquote>
                  )}
                  <div className="mt-6 sm:mt-8 h-px bg-gradient-to-r from-emerald-500/40 via-border to-transparent" />
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className="mt-5 sm:mt-6"
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                      {story.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      {story.department && (
                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap className="h-4 w-4 text-emerald-600" />
                          {story.department}
                        </span>
                      )}
                      {story.university && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          {story.university}
                        </span>
                      )}
                    </div>
                    {story.achievement && (
                      <div className="mt-4 inline-flex items-start gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl max-w-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Award className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>{story.achievement}</span>
                      </div>
                    )}
                  </motion.div>
                  <a href="#full-story" className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    Read the full story <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-4 order-1 lg:order-2 flex items-center justify-center"
                >
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 rounded-2xl bg-emerald-500/20 dark:bg-emerald-400/15" />
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-lg shadow-emerald-500/10">
                      {story.coverImage ? (
                        <img src={story.coverImage.url} alt={story.coverImage.alt ?? story.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
                          <Users className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Body + sidebar */}
        <section id="full-story" className="py-10 sm:py-12 lg:py-16 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">

              {/* Left: body */}
              <div>
                <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">The full story</p>
                  {story.joinedYear && (
                    <p className="text-[11px] text-muted-foreground">Joined Student Square in {story.joinedYear}</p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {isHtml ? (
                    <div
                      className="prose prose-sm sm:prose dark:prose-invert max-w-none [&>p:first-child]:first-letter:text-5xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:mt-1 [&>p:first-child]:first-letter:text-emerald-600 [&>p:first-child]:first-letter:leading-none"
                      dangerouslySetInnerHTML={{ __html: story.body }}
                    />
                  ) : (
                    <div className="space-y-5">
                      {paragraphs.map((para, i) => (
                        <p key={i} className={`text-base text-foreground leading-[1.85] ${i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-emerald-600 first-letter:leading-none" : ""}`}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>

                {story.highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-10 p-6 sm:p-7 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                      <Award className="h-3.5 w-3.5" />
                      Highlights from {story.name.split(" ")[0]}&apos;s journey
                    </p>
                    <ul className="space-y-3">
                      {story.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                          <p className="text-sm text-foreground leading-relaxed">{h}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Gallery */}
                {story.images && story.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-10"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-4">Gallery</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {story.images.map((img) => (
                        <figure key={img.id} className="space-y-1">
                          <img
                            src={img.image.url}
                            alt={img.caption ?? img.image.alt ?? ""}
                            className="w-full aspect-video object-cover rounded-xl"
                          />
                          {img.caption && (
                            <figcaption className="text-[11px] text-muted-foreground text-center">{img.caption}</figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap"
                >
                  <Link href="/blog/real-life-stories" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> All stories
                  </Link>
                  <ShareButtons />
                </motion.div>
              </div>

              {/* Right: other stories sidebar */}
              {otherStories.length > 0 && (
                <aside className="lg:sticky lg:top-24 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-3">More Stories</p>
                  {otherStories.map((s) => (
                    <StoryCard key={s.id} story={s} />
                  ))}
                </aside>
              )}
            </div>
          </div>
        </section>
      </article>
      <Footer />
    </main>
  );
}

// ──────────────────────────────────────────────
// Loading skeleton
// ──────────────────────────────────────────────
function LoadingView() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />
      <div className="flex items-center justify-center gap-2 py-40 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        Loading story…
      </div>
      <Footer />
    </main>
  );
}

// ──────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────
export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isNumeric = /^\d+$/.test(id);

  const { data: apiStory, isLoading } = useGetStoryBySlugQuery(id, {
    skip: isNumeric,
  });

  if (isNumeric) {
    return <StaticStoryView id={Number(id)} />;
  }

  if (isLoading) return <LoadingView />;
  if (!apiStory) {
    redirect("/blog/real-life-stories");
  }

  return <ApiStoryView story={apiStory} />;
}
