'use client';

import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import { getMemberBySlug, getMembersByCategory } from "@/data/team";
import { Mail, ChevronRight } from "lucide-react";
import blogData from "@/data/blog";

const categoryLabel: Record<string, string> = {
  board: "Board of Trustees",
  advisory: "Advisory Board",
  leadership: "Leadership Team",
  management: "Management Team",
};

export default function MemberProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const member = getMemberBySlug(slug);
  if (!member) redirect("/about/who-we-are");

  const related = getMembersByCategory(member.category)
    .filter((m) => m.id !== member.id)
    .slice(0, 4);

  const news = blogData.slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="mt-12 sm:mt-14 lg:mt-16 bg-muted/40 border-b border-border">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8 py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/about/who-we-are" className="hover:text-emerald-600 transition-colors uppercase tracking-wider font-medium">
            Our People
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="uppercase tracking-wider">{categoryLabel[member.category]}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{member.name}</span>
        </div>
      </div>

      {/* Profile */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="rounded-xl overflow-hidden aspect-square bg-muted">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {categoryLabel[member.category]}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {member.name}
              </h1>
              <p className="text-base text-emerald-600 font-medium mb-4">{member.role}</p>

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors mb-8"
                >
                  <Mail className="h-4 w-4" />
                  {member.email}
                </a>
              )}

              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                {member.bio.split(". ").reduce<string[][]>((acc, sentence, i) => {
                  const chunkIndex = Math.floor(i / 3);
                  if (!acc[chunkIndex]) acc[chunkIndex] = [];
                  acc[chunkIndex].push(sentence);
                  return acc;
                }, []).map((chunk, i) => (
                  <p key={i}>{chunk.join(". ")}{chunk[chunk.length - 1].endsWith(".") ? "" : "."}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related members */}
      {related.length > 0 && (
        <section className="bg-muted/30 py-14">
          <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-foreground mb-8"
            >
              More from {categoryLabel[member.category]}
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/about/who-we-are/${m.slug}`} className="group block text-center">
                    <div className="overflow-hidden rounded-lg aspect-square bg-muted mb-3">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors leading-snug">
                      {m.name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
                      {m.role}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News section */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-xl font-bold text-foreground">
              {member.name.split(" ")[0]}&apos;s News
            </h2>
            <Link
              href="/blog/magazine"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
            >
              All News <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {news.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-xl overflow-hidden border border-border hover:border-emerald-500/50 transition-colors"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-emerald-600 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{post.publishDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
