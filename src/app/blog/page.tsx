'use client';

import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { motion } from "motion/react";
import blogData from "@/data/blog";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative mt-12 sm:mt-14 lg:mt-16 h-[36vh] min-h-[220px] w-full overflow-hidden">
        <img
          src="/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg"
          alt="Blog"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 px-6 pb-8 sm:px-10 lg:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Blog & Stories
          </motion.h1>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground mb-8"
          >
            Insights, updates, and stories from the Student Square community.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {post.tags[0] && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                          {post.tags[0]}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{post.publishDate}</span>
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <h2 className="text-sm font-semibold text-foreground leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
