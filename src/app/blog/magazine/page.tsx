"use client";

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { useGetMagazinesQuery, useGetMagazineDownloadUrlMutation } from "@/redux/features/magazine/magazineApi";
import { toast } from "sonner";
import { BookOpen, Download, FileText, Loader2, Sparkles } from "lucide-react";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MagazinePage() {
  const { data, isLoading } = useGetMagazinesQuery({ limit: 50 });
  const [getDownloadUrl, { isLoading: resolving }] = useGetMagazineDownloadUrlMutation();

  const handleDownload = async (id: string) => {
    try {
      const { url } = await getDownloadUrl(id).unwrap();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Couldn't get that download link — please try again.");
    }
  };

  const issues = data?.data ?? [];

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

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 text-center">
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
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            In-depth features, long-form stories, and perspectives on education, career, and
            community across Bangladesh.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading issues…
            </div>
          ) : issues.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center max-w-md mx-auto">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                We&apos;re preparing our first issue — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="aspect-[3/4] bg-muted overflow-hidden">
                    {issue.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={issue.coverImage.url} alt={issue.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40">
                        <BookOpen className="h-12 w-12 text-emerald-300 dark:text-emerald-700" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {issue.issueNumber && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
                        Issue {issue.issueNumber}
                      </p>
                    )}
                    <h3 className="text-base font-bold text-foreground leading-snug">{issue.title}</h3>
                    {issue.description && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {issue.description}
                      </p>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground">{formatDate(issue.publishedAt)}</span>
                      <button
                        type="button"
                        onClick={() => handleDownload(issue.id)}
                        disabled={resolving}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
