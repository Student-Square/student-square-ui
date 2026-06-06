'use client';

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import blogData from "@/data/blog";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";

function estimateReadTime(paragraphs: string[]): number {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = blogData.find((b) => b.id === Number(id));
  if (!post) redirect("/blog");

  const related = blogData.filter((b) => b.id !== post.id).slice(0, 3);
  const readTime = estimateReadTime(post.body);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Spacer where the banner used to be */}
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        {/* Decorative top gradient (no image banner) */}
        <div className="absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-900/15 dark:via-background dark:to-background" />
          <div className="absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        {/* Header section */}
        <section className="pt-10 lg:pt-16 pb-10">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-6"
            >
              <Link href="/" className="hover:text-emerald-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-emerald-600 transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground line-clamp-1">{post.title}</span>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-1.5 flex-wrap mb-5"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-tight tracking-tight"
            >
              {post.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {post.paragraph}
            </motion.p>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="w-11 h-11 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.author.designation}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.publishDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime} min read
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover image (inline, not a banner) */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-8"
          >
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Body */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {post.body.map((para, i) => (
                <p
                  key={i}
                  className={`text-base text-foreground leading-[1.85] ${
                    i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-emerald-600 first-letter:leading-none" : ""
                  }`}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Share + back row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </span>
                <button
                  type="button"
                  aria-label="Share on Facebook"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share on Twitter"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share on LinkedIn"
                  className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </button>
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
            </motion.div>

            {/* Author card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-10 p-6 rounded-2xl bg-card border border-border flex items-start gap-4"
            >
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover border border-border shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  About the author
                </p>
                <p className="mt-1 text-base font-bold text-foreground">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{post.author.designation}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {post.author.name} contributes to Student Square&apos;s ongoing work in
                  education, counselling, and community development across Bangladesh.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="pb-20 border-t border-border pt-14 bg-gradient-to-b from-background to-emerald-50/30 dark:to-emerald-900/10">
            <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
              <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Keep Reading
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                    More from our blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:gap-2.5 transition-all"
                >
                  View all articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r, i) => (
                  <motion.article
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/blog/${r.id}`}
                      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={r.image}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                          {r.tags[0] && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              {r.tags[0]}
                            </span>
                          )}
                          <span className="ml-auto">{r.publishDate}</span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 flex-1">
                          {r.title}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                          Read more
                          <ArrowRight className="h-3.5 w-3.5" />
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
