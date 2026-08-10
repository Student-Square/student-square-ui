"use client";

import Link from "next/link";
import {
  useGetSavedItemsQuery,
  useToggleBookmarkMutation,
} from "@/redux/features/comms/commsApi";
import { Bookmark, ExternalLink, Loader2, X } from "lucide-react";

/**
 * "Saved Blogs" — FR-11.
 *
 * Three types share one list because that is how a member thinks about it:
 * things they saved. The API returns them already hydrated per type, so a
 * bookmark whose target was later unpublished simply does not appear.
 */
export default function SavedArticlesPage() {
  const { data, isLoading } = useGetSavedItemsQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const total =
    (data?.blogs.length ?? 0) +
    (data?.stories.length ?? 0) +
    (data?.resources.length ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Saved
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Articles, stories and resources you have bookmarked.
        </p>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : total === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 flex flex-col items-center justify-center text-center px-6">
          <div className="h-16 w-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-4">
            <Bookmark className="h-8 w-8 text-violet-500" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Nothing saved yet
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
            When you bookmark an article or resource it appears here.
          </p>
          <Link
            href="/blog/magazine"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-emerald-500/50 hover:text-emerald-600 transition-colors"
          >
            Explore articles <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {data!.blogs.length > 0 && (
            <Section title="Articles">
              {data!.blogs.map((blog) => (
                <SavedRow
                  key={blog.id}
                  href={`/blog/${blog.category?.slug ?? "education-career"}/${blog.id}`}
                  title={blog.title}
                  subtitle={blog.excerpt}
                  image={blog.coverImage?.url ?? null}
                  onRemove={() =>
                    toggleBookmark({ refType: "BLOG", refId: blog.id })
                  }
                />
              ))}
            </Section>
          )}

          {data!.stories.length > 0 && (
            <Section title="Real life stories">
              {data!.stories.map((story) => (
                <SavedRow
                  key={story.id}
                  href={`/blog/real-life-stories/${story.id}`}
                  title={story.name}
                  subtitle={story.summary}
                  image={story.coverImage?.url ?? null}
                  onRemove={() =>
                    toggleBookmark({ refType: "STORY", refId: story.id })
                  }
                />
              ))}
            </Section>
          )}

          {data!.resources.length > 0 && (
            <Section title="Resources">
              {data!.resources.map((resource) => (
                <SavedRow
                  key={resource.id}
                  href="/dashboard/resources"
                  title={resource.title}
                  subtitle={resource.category ?? resource.type.toLowerCase()}
                  image={null}
                  onRemove={() =>
                    toggleBookmark({ refType: "RESOURCE", refId: resource.id })
                  }
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
        {title}
      </h2>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function SavedRow({
  href,
  title,
  subtitle,
  image,
  onRemove,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: string | null;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-12 w-16 rounded-lg object-cover shrink-0"
        />
      )}
      <Link href={href} className="flex-1 min-w-0 group">
        <p className="text-sm font-semibold group-hover:text-emerald-600 transition-colors truncate">
          {title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-rose-600 transition-colors"
        aria-label="Remove from saved"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}
