"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminListStoriesQuery,
  useAdminPublishStoryMutation,
  useAdminArchiveStoryMutation,
  useAdminApproveStoryMutation,
} from "@/redux/features/stories/adminStoriesApi";
import type { StoryStatus } from "@/types/stories";
import {
  Archive,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

type StatusFilter = StoryStatus | "ALL";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "DRAFT", label: "Draft" },
  { value: "APPROVED", label: "Approved" },
  { value: "PUBLISHED", label: "Published" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_BADGE: Record<StoryStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PUBLISHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ARCHIVED: "bg-muted text-muted-foreground",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminStoriesListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useAdminListStoriesQuery({
    page, limit, status,
    ...(q.trim() ? { searchTerm: q.trim() } : {}),
  });

  const [approveStory] = useAdminApproveStoryMutation();
  const [publishStory] = useAdminPublishStoryMutation();
  const [archiveStory] = useAdminArchiveStoryMutation();

  const handleApproveAndPublish = async (id: string) => {
    if (!confirm("Approve and publish this story?")) return;
    try {
      await approveStory({ id, publishNow: true }).unwrap();
      toast.success("Story approved and published");
    } catch { /* baseApi toasts */ }
  };

  const handlePublish = async (id: string) => {
    if (!confirm("Publish this story?")) return;
    try {
      await publishStory(id).unwrap();
      toast.success("Story published");
    } catch { /* baseApi toasts */ }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this story?")) return;
    try {
      await archiveStory(id).unwrap();
      toast.success("Story archived");
    } catch { /* baseApi toasts */ }
  };

  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(data.meta.total / data.meta.limit) : 1;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Real Life Stories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review, manage and publish member stories.</p>
        </div>
        <Link
          href="/admin/blog/real-life-stories/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New story
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search name…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-52 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as StatusFilter); setPage(1); }}
          className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(q || status !== "ALL") && (
          <button
            type="button"
            onClick={() => { setQ(""); setStatus("ALL"); setPage(1); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading stories…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load stories.</p>}

      {data && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Department</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((story) => (
                  <tr key={story.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-semibold text-foreground truncate leading-snug">{story.name}</p>
                      {story.submitter && (
                        <p className="text-[11px] text-muted-foreground truncate">by {story.submitter.fullName}</p>
                      )}
                      <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full sm:hidden ${STATUS_BADGE[story.status]}`}>
                        {story.status.charAt(0) + story.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm text-muted-foreground">
                      {story.department ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[story.status]}`}>
                        {story.status.charAt(0) + story.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[11px] text-muted-foreground whitespace-nowrap">
                      {story.status === "PUBLISHED" ? formatDate(story.publishedAt) : formatDate(story.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {story.status === "PENDING" && (
                          <button type="button" onClick={() => handleApproveAndPublish(story.id)} title="Approve & Publish"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {story.status === "APPROVED" && (
                          <button type="button" onClick={() => handlePublish(story.id)} title="Publish"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors">
                            <Globe className="h-4 w-4" />
                          </button>
                        )}
                        {story.status !== "ARCHIVED" && (
                          <button type="button" onClick={() => handleArchive(story.id)} title="Archive"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors">
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <Link href={`/admin/blog/real-life-stories/${story.id}/edit`} title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No stories match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
            <span className="text-sm text-muted-foreground">
              {total === 0 ? "0 results" : `${from}–${to} of ${total}`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
