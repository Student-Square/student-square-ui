"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetBlogByIdQuery, useGetBlogsQuery } from "@/redux/features/blogs/blogsApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ApiBlogPost, ApiBlogListItem } from "@/types/blogs";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  GraduationCap,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Loader2,
  Users,
} from "lucide-react";

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function ShareButtons() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5 mr-1">
        <Share2 className="h-3.5 w-3.5" />
        {t("common.share")}
      </span>
      <button type="button" aria-label={t("common.shareFacebook")} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors">
        <Facebook className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label={t("common.shareTwitter")} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors">
        <Twitter className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label={t("common.shareLinkedIn")} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/60 transition-colors">
        <Linkedin className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label={t("common.copyLink")}
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

function SidebarCard({ post }: { post: ApiBlogListItem }) {
  const { t, pick, date } = useLanguage();
  return (
    <Link
      href={`/blog/${post.category.slug}/${post.id}`}
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted shrink-0">
        {post.coverImage ? (
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? pick(post.title, post.titleBn)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40">
            <GraduationCap className="h-8 w-8 text-emerald-300 dark:text-emerald-700" />
          </div>
        )}
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-emerald-600">{pick(post.category.name, post.category.nameBn)}</span>
          <span className="ml-auto flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            {date(post.publishedAt)}
          </span>
        </div>
        <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
          {pick(post.title, post.titleBn)}
        </h4>
        <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border">
          {post.displayAuthorImage ? (
            <img
              src={post.displayAuthorImage}
              alt={post.displayAuthorName ?? t("common.author")}
              className="w-5 h-5 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border shrink-0">
              <Users className="h-2.5 w-2.5 text-emerald-600" />
            </div>
          )}
          <span className="text-[11px] text-muted-foreground truncate">
            {post.displayAuthorName ?? t("common.studentSquare")}
          </span>
          <ArrowRight className="h-3 w-3 shrink-0 ml-auto text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function PostView({ post }: { post: ApiBlogPost }) {
  const { t, pick, tr, num, date } = useLanguage();
  const title = pick(post.title, post.titleBn);
  const categoryName = pick(post.category.name, post.category.nameBn);
  const authorName = post.displayAuthorName ?? post.author?.fullName ?? t("common.studentSquare");
  const excerpt = pick(post.excerpt, post.excerptBn);
  const body = pick(post.body, post.bodyBn);
  const isHtml = body.trimStart().startsWith("<");
  const paragraphs = isHtml ? [] : body.split("\n\n").filter(Boolean);
  const readTime = estimateReadTime(body);
  const tags = post.tags.map((t) => t.tag);

  // Posts tagged "education-career" live under /blog/education-career/[sub-category]
  const isEdCareer = post.tags.some((t) => t.tag.slug === "education-career");
  const categoryHref = isEdCareer
    ? `/blog/education-career/${post.category.slug}`
    : `/blog/${post.category.slug}`;

  const { data: relatedData } = useGetBlogsQuery({
    categorySlug: post.category.slug,
    limit: 5,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });
  const relatedPosts = (relatedData?.data ?? []).filter((p) => p.id !== post.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <article className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-background to-background dark:from-emerald-900/15 dark:via-background dark:to-background" />
          <div className="absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        {/* Single outer grid — sidebar starts at the same level as title */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-10 lg:pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">

            {/* ── Left: full article ── */}
            <div>
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-6"
              >
                <Link href="/" className="hover:text-emerald-600 transition-colors">{t("common.home")}</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/blog" className="hover:text-emerald-600 transition-colors">{t("common.blog")}</Link>
                <ChevronRight className="h-3 w-3" />
                {isEdCareer && (
                  <>
                    <Link href="/blog/education-career" className="hover:text-emerald-600 transition-colors">
                      {t("edu.badge")}
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
                <Link href={categoryHref} className="hover:text-emerald-600 transition-colors">
                  {categoryName}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground line-clamp-1">{title}</span>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-1.5 flex-wrap mb-5"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                  {categoryName}
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                  >
                    {tr(tag.name)}
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
                {title}
              </motion.h1>

              {/* Excerpt */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                {excerpt}
              </motion.p>

              {/* Author + date */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-8 flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-border"
              >
                <div className="flex items-center gap-3">
                  {post.displayAuthorImage ? (
                    <img
                      src={post.displayAuthorImage}
                      alt={post.displayAuthorName ?? t("common.author")}
                      className="w-11 h-11 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">{post.displayAuthorTitle ?? ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {date(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t("article.minRead", { count: readTime })}
                  </span>
                </div>
              </motion.div>

              {/* Cover image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8"
              >
                {post.coverImage ? (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
                    <img
                      src={post.coverImage.url}
                      alt={post.coverImage.alt ?? title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 border border-border flex items-center justify-center">
                    <GraduationCap className="h-24 w-24 text-emerald-300 dark:text-emerald-700" />
                  </div>
                )}
              </motion.div>

              {/* Body */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-10"
              >
                {isHtml ? (
                  <div
                    className="rich-text"
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                ) : (
                  <div className="space-y-6">
                    {paragraphs.map((para, i) => (
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
                  </div>
                )}
              </motion.div>

              {/* Back + Share */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-4 flex-wrap"
              >
                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-emerald-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("article.backTo", { category: categoryName })}
                </Link>
                <ShareButtons />
              </motion.div>

              {/* Author bio */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-10 p-6 rounded-2xl bg-card border border-border flex items-start gap-4"
              >
                {post.displayAuthorImage ? (
                  <img
                    src={post.displayAuthorImage}
                    alt={post.displayAuthorName ?? t("common.author")}
                    className="w-14 h-14 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border shrink-0">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{t("article.aboutAuthor")}</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {authorName}
                  </p>
                  <p className="text-xs text-muted-foreground">{post.displayAuthorTitle ?? ""}</p>
                  {post.displayAuthorBio ? (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{post.displayAuthorBio}</p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t("article.authorFallback", { name: post.displayAuthorName ?? t("article.thisAuthor") })}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ── Right: sticky sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    {t("article.moreFrom", { category: categoryName })}
                  </p>
                  <Link
                    href={categoryHref}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                  >
                    {t("common.viewAll")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {relatedPosts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center">
                    <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{t("article.noOthers")}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relatedPosts.map((related, i) => (
                      <motion.div
                        key={related.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                      >
                        <SidebarCard post={related} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

function LoadingView() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mt-12 sm:mt-14 lg:mt-16" />
      <div className="flex items-center justify-center gap-2 py-40 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        {t("article.loading")}
      </div>
      <Footer />
    </main>
  );
}

export default function ArticleView({ id }: { id: string }) {
  const { data: post, isLoading } = useGetBlogByIdQuery(id);

  if (isLoading) return <LoadingView />;
  if (!post) redirect("/blog");

  return <PostView post={post} />;
}
