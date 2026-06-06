"use client";

import { BookOpen, GraduationCap, Users } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  title: string;
  excerpt: string;
  bodyHtml: string;
  categoryName: string;
  authorName: string;
  tags: string[];
  coverImageUrl?: string;
};

export default function BlogPreview({ title, excerpt, bodyHtml, categoryName, authorName, tags, coverImageUrl }: Props) {
  const plainText = bodyHtml.replace(/<[^>]+>/g, " ");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 220));
  const isEmpty = !title && !plainText.trim();

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-sm font-semibold">Start writing to see a preview</p>
        <p className="text-xs mt-1 opacity-70">Your blog post will appear here.</p>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Category + tags */}
      <div className="flex gap-1.5 flex-wrap">
        {categoryName && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
            {categoryName}
          </span>
        )}
        {tags.map((t) => (
          <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70">
            {t}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground leading-tight">
        {title || <span className="text-muted-foreground italic">Untitled post</span>}
      </h1>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-base text-muted-foreground leading-relaxed border-l-4 border-emerald-500 pl-4 italic">
          {excerpt}
        </p>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-border">
          <Users className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">{authorName || "Student Square"}</p>
          <p className="text-xs text-muted-foreground flex gap-3">
            <span>· {readTime} min read</span>
            <span>· {formatDate(new Date().toISOString())}</span>
          </p>
        </div>
      </div>

      {/* Cover image */}
      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border">
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
          </div>
        )}
      </div>

      {/* Body */}
      {bodyHtml ? (
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <p className="text-muted-foreground italic text-sm">Body content will appear here…</p>
      )}
    </article>
  );
}
