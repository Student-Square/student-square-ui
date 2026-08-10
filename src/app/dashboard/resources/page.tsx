"use client";

import { useState } from "react";
import {
  useGetResourceCategoriesQuery,
  useGetResourceFileUrlMutation,
  useGetResourcesQuery,
  useToggleBookmarkMutation,
} from "@/redux/features/comms/commsApi";
import type { Resource } from "@/types/comms";
import {
  BookMarked,
  Bookmark,
  ExternalLink,
  FileText,
  GraduationCap,
  Library,
  Link2,
  Loader2,
  PlayCircle,
} from "lucide-react";

const TYPE_ICON: Record<Resource["type"], React.ReactNode> = {
  DOCUMENT: <FileText className="h-5 w-5 text-sky-600" />,
  VIDEO: <PlayCircle className="h-5 w-5 text-rose-600" />,
  LINK: <Link2 className="h-5 w-5 text-emerald-600" />,
  TRAINING_MODULE: <GraduationCap className="h-5 w-5 text-violet-600" />,
};

export default function ResourcesPage() {
  const [category, setCategory] = useState<string | null>(null);
  const { data: resources, isLoading } = useGetResourcesQuery(
    category ? { category } : undefined
  );
  const { data: categories } = useGetResourceCategoriesQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [getFileUrl] = useGetResourceFileUrlMutation();

  const open = async (resource: Resource) => {
    if (resource.hasFile) {
      const signed = await getFileUrl(resource.id).unwrap().catch(() => null);
      if (signed?.url) window.open(signed.url, "_blank", "noreferrer");
      return;
    }
    if (resource.url) window.open(resource.url, "_blank", "noreferrer");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Guides, videos and material shared with you.
        </p>
      </div>

      {(categories ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              category === null
                ? "bg-emerald-600 text-white"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {(categories ?? []).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "bg-emerald-600 text-white"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !resources?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Library className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing here yet. Resources appear as they are published or shared
            with you.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3"
            >
              <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {TYPE_ICON[resource.type]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{resource.title}</p>
                  {resource.assignedToMe && (
                    <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Shared with you
                    </span>
                  )}
                </div>
                {resource.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void open(resource)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Open <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  toggleBookmark({ refType: "RESOURCE", refId: resource.id })
                }
                className="shrink-0 text-muted-foreground hover:text-amber-500 transition-colors"
                aria-label={resource.bookmarked ? "Remove from saved" : "Save"}
              >
                {resource.bookmarked ? (
                  <BookMarked className="h-4 w-4 text-amber-500" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
