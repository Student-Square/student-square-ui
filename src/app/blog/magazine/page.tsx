import Link from "next/link";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { BookOpen, Clock, Sparkles } from "lucide-react";

export default function MagazinePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mt-12 sm:mt-14 lg:mt-16" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/40 dark:via-background dark:to-background" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-emerald-600/10 dark:bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="h-3 w-3" />
            Student Square Magazine
          </div>

          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <BookOpen className="h-9 w-9 text-emerald-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Magazine
          </h1>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Coming Soon
          </div>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            We are preparing something worth reading. The Student Square Magazine — in-depth
            features, long-form stories, and perspectives on education, career, and community
            across Bangladesh — is on its way.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30"
            >
              Browse our Blog
            </Link>
            <Link
              href="/blog/real-life-stories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:border-emerald-500/60 hover:text-emerald-600 transition-colors"
            >
              Read Real Life Stories
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
