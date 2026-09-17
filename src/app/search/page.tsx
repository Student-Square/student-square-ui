"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search as SearchIcon } from "lucide-react";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import { useSearchQuery } from "@/redux/features/search/searchApi";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { SearchResults } from "@/types/search";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <div className={`${NAVBAR_PAD_TOP} flex justify-center py-24`}>
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        }
      >
        <SearchResultsView />
      </Suspense>
      <Footer />
    </main>
  );
}

function SearchResultsView() {
  const params = useSearchParams();
  const router = useRouter();
  const { t, pick, tr } = useLanguage();
  const q = (params.get("q") ?? "").trim();
  const [input, setInput] = useState(q);

  const { data, isFetching, isError } = useSearchQuery({ q }, { skip: q.length < 2 });

  return (
    <div className={NAVBAR_PAD_TOP}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const next = input.trim();
            if (next.length >= 2) router.push(`/search?q=${encodeURIComponent(next)}`);
          }}
          className="flex"
        >
          <input
            type="search"
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("search")}
            className="h-12 w-full min-w-0 rounded-l-xl border border-r-0 border-border bg-background px-4 text-base focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t("search")}
            className="flex h-12 w-14 shrink-0 items-center justify-center rounded-r-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>

        {q.length < 2 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">{t("searchPrompt")}</p>
        ) : isFetching ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> {t("search")}…
          </div>
        ) : isError ? (
          <p className="mt-10 text-center text-sm text-destructive">
            {t("common.somethingWrong")}
          </p>
        ) : (
          <Results data={data} q={q} t={t} pick={pick} tr={tr} />
        )}
      </div>
    </div>
  );
}

function Results({
  data,
  q,
  t,
  pick,
  tr,
}: {
  data?: SearchResults;
  q: string;
  t: (k: string) => string;
  pick: (en: string | null | undefined, bn: string | null | undefined) => string;
  tr: (en: string | null | undefined) => string;
}) {
  if (!data || data.total === 0) {
    return (
      <div className="py-16 text-center">
        <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">
          {t("searchNoResults")} — <span className="font-medium text-foreground">“{q}”</span>
        </p>
      </div>
    );
  }

  const { results } = data;

  return (
    <div className="mt-8 space-y-10">
      <p className="text-sm text-muted-foreground">
        {t("resultsFor")}: <span className="font-semibold text-foreground">“{q}”</span> ({data.total})
      </p>

      <Group title={t("articles")} count={data.counts.blogs}>
        {results.blogs.map((b) => (
          <ResultRow
            key={b.id}
            href={`/blog/${b.category.slug}/${b.id}`}
            title={pick(b.title, b.titleBn)}
            snippet={pick(b.excerpt, b.excerptBn)}
            image={b.coverImage}
          />
        ))}
      </Group>

      <Group title={t("stories")} count={data.counts.stories}>
        {results.stories.map((s) => (
          <ResultRow
            key={s.slug}
            href={`/blog/real-life-stories/${s.slug}`}
            title={tr(s.name)}
            snippet={pick(s.summary, s.summaryBn)}
            image={s.coverImage}
          />
        ))}
      </Group>

      <Group title={t("projects")} count={data.counts.projects}>
        {results.projects.map((p) => (
          <ResultRow
            key={p.slug}
            href={`/projects/${p.slug}`}
            title={pick(p.title, p.titleBn)}
            snippet={pick(p.summary, p.summaryBn)}
            image={p.coverImage}
          />
        ))}
      </Group>

      <Group title={t("events")} count={data.counts.events}>
        {results.events.map((ev) => (
          <ResultRow
            key={ev.slug}
            href={`/blog/events/${ev.slug}`}
            title={pick(ev.title, ev.titleBn)}
            snippet={pick(ev.description, ev.descriptionBn)}
            image={ev.coverImage}
          />
        ))}
      </Group>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">
        {title} <span className="text-sm font-normal text-muted-foreground">({count})</span>
      </h2>
      <ul className="divide-y divide-border rounded-xl border border-border">{children}</ul>
    </section>
  );
}

function ResultRow({
  href,
  title,
  snippet,
  image,
}: {
  href: string;
  title: string;
  snippet: string;
  image: { url: string; alt: string | null } | null;
}) {
  return (
    <li>
      <Link href={href} className="flex gap-4 p-4 transition-colors hover:bg-muted/40">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.alt ?? title} className="h-full w-full object-cover" loading="lazy" />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 font-semibold text-foreground">{title}</p>
          {snippet ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{snippet}</p> : null}
        </div>
      </Link>
    </li>
  );
}
