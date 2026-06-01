'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { useGetPublicUserBySlugQuery, useGetBoardGroupsQuery } from "@/redux/features/content/contentApi";
import type { ApiBoardAssignment } from "@/types/content";
import { ArrowLeft, Check, ChevronRight, Loader2, Mail, Users } from "lucide-react";
import blogData from "@/data/blog";

const PLACEHOLDER_AVATAR = "/images/student-square-school-session.jpg";

const CATEGORY_LABELS: Record<string, string> = {
  BOARD: "Board of Trustees",
  ADVISORY: "Advisory Board",
  LEADERSHIP: "Leadership Team",
  MANAGEMENT: "Management Team",
};

const CATEGORY_DOT: Record<string, string> = {
  BOARD: "bg-emerald-500",
  ADVISORY: "bg-blue-500",
  LEADERSHIP: "bg-violet-500",
  MANAGEMENT: "bg-orange-500",
};

const CATEGORY_TEXT: Record<string, string> = {
  BOARD: "text-emerald-600 dark:text-emerald-400",
  ADVISORY: "text-blue-600 dark:text-blue-400",
  LEADERSHIP: "text-violet-600 dark:text-violet-400",
  MANAGEMENT: "text-orange-600 dark:text-orange-400",
};

function RelatedCard({ member }: { member: ApiBoardAssignment }) {
  const href = `/about/who-we-are/${member.slug ?? member.userId}`;
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl border border-border bg-card px-4 py-3 hover:border-emerald-500/40 hover:shadow-sm transition-all duration-200"
    >
      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0 ring-1 ring-border group-hover:ring-emerald-500/40 transition-all">
        <img
          src={member.avatarUrl ?? PLACEHOLDER_AVATAR}
          alt={member.fullName}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors truncate">
          {member.fullName}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{member.roleLabel}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-500 group-hover:translate-x-0.5 shrink-0 transition-all" />
    </Link>
  );
}

export default function MemberProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: user, isLoading, isError } = useGetPublicUserBySlugQuery(slug);
  const { data: groups } = useGetBoardGroupsQuery();
  const [copied, setCopied] = useState(false);

  const news = blogData.slice(0, 3);

  const activeAssignments = user?.boardAssignments
    .slice()
    .sort((a, b) => a.order - b.order) ?? [];

  const primaryAssignment = activeAssignments[0];
  const categoryKey = primaryAssignment?.category ?? "";

  const categoryList = groups
    ? (groups[categoryKey.toLowerCase() as keyof typeof groups] ?? [])
    : [];
  const related = (categoryList as ApiBoardAssignment[])
    .filter((m) => m.slug !== slug && m.userId !== slug)
    .slice(0, 6);

  const memberEmail = (categoryList as ApiBoardAssignment[])
    .find((m) => m.slug === slug || m.userId === slug)?.email ?? null;

  const handleCopyEmail = async () => {
    if (!memberEmail) return;
    try {
      await navigator.clipboard.writeText(memberEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const firstName = user?.fullName?.split(" ")[0] ?? "";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Loading */}
      {isLoading && (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-5">
            <Users className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Member not found</p>
            <p className="text-sm text-muted-foreground mt-1">We couldn&apos;t find this team member.</p>
          </div>
          <Link
            href="/about/who-we-are"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Our Team
          </Link>
        </div>
      )}

      {user && (
        <div className="mt-14 sm:mt-16 lg:mt-20">

          {/* ══════════════════════════════════════════════════
              BREADCRUMB
          ══════════════════════════════════════════════════ */}
          <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8 pt-8 pb-6">
            <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Link href="/about/who-we-are" className="hover:text-emerald-600 transition-colors">
                Our People
              </Link>
              {categoryKey && (
                <>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <span>{CATEGORY_LABELS[categoryKey]}</span>
                </>
              )}
            </nav>
          </div>

          {/* ══════════════════════════════════════════════════
              PROFILE — photo left, bio right
          ══════════════════════════════════════════════════ */}
          <section className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8 pb-14">
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">

              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="shrink-0 self-start"
              >
                <div className="w-44 sm:w-52 lg:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 ring-1 ring-border">
                  <img
                    src={user.profile?.avatarUrl ?? PLACEHOLDER_AVATAR}
                    alt={user.fullName}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </motion.div>

              {/* Info + Bio */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="flex-1 min-w-0"
              >
                {/* Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
                  {user.fullName}
                </h1>
                {user.profile?.fullNameBn && (
                  <p className="text-base text-muted-foreground mt-1 font-medium" dir="auto">
                    {user.profile.fullNameBn}
                  </p>
                )}

                {/* Role badges */}
                {activeAssignments.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    {activeAssignments.map((a) => (
                      <div key={a.id} className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full shrink-0 ${CATEGORY_DOT[a.category] ?? "bg-gray-400"}`} />
                        <span className={`text-xs font-semibold uppercase tracking-wide ${CATEGORY_TEXT[a.category] ?? "text-muted-foreground"}`}>
                          {a.roleLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Email */}
                {memberEmail && (
                  <button
                    onClick={handleCopyEmail}
                    title={copied ? "Copied!" : memberEmail}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-600 transition-colors group/email"
                  >
                    {copied
                      ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      : <Mail className="h-3.5 w-3.5 shrink-0 group-hover/email:text-emerald-600 transition-colors" />
                    }
                    <span className={copied ? "text-emerald-600 font-semibold" : "opacity-0 group-hover/email:opacity-100 transition-opacity font-mono"}>
                      {copied ? "Copied!" : memberEmail}
                    </span>
                  </button>
                )}

                {/* Divider */}
                <div className="my-5 h-px bg-border" />

                {/* Bio */}
                {user.profile?.bio ? (
                  <div className="space-y-4">
                    {user.profile.bio.split(/\n\n+/).map((para, i) => (
                      <p
                        key={i}
                        className="text-sm sm:text-[14.5px] leading-[1.85] text-foreground/75"
                      >
                        {para}
                      </p>
                    ))}
                    {user.profile.bioBn && (
                      <div className="mt-6 pt-6 border-t border-border" dir="auto">
                        {user.profile.bioBn.split(/\n\n+/).map((para, i) => (
                          <p key={i} className="text-sm text-foreground/75 leading-relaxed mb-3">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No biography available yet.</p>
                )}
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              RELATED MEMBERS
          ══════════════════════════════════════════════════ */}
          {related.length > 0 && (
            <section className="border-t border-border bg-muted/20 py-12">
              <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">
                      More from {CATEGORY_LABELS[categoryKey] ?? "Our Team"}
                    </h2>
                    <Link
                      href="/about/who-we-are"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {related.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <RelatedCard member={m} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════
              NEWS
          ══════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12">
            <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
              >
                {/* Section header — matches reference exactly */}
                <div className="flex items-center justify-between mb-7">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {firstName}&apos;s News
                  </h2>
                  <Link
                    href="/blog/magazine"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    All {firstName}&apos;s News
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* News cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {news.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                      viewport={{ once: true }}
                      className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video overflow-hidden bg-muted relative">
                        {post.tags[0] && (
                          <span className="absolute top-2 left-2 z-10 text-[9px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded-sm">
                            {post.tags[0]}
                          </span>
                        )}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Card body */}
                      <div className="p-3.5">
                        <h3 className="font-semibold text-[13px] text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                          {post.publishDate}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

        </div>
      )}

      <Footer />
    </main>
  );
}
