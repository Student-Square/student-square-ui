"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminListBlogsQuery,
  useAdminPublishBlogMutation,
  useAdminArchiveBlogMutation,
} from "@/redux/features/blogs/adminBlogsApi";
import { useGetBlogCategoriesQuery } from "@/redux/features/blogs/blogsApi";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
} from "lucide-react";

type StatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_BADGE: Record<"DRAFT" | "PUBLISHED" | "ARCHIVED", string> = {
  DRAFT: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  PUBLISHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ARCHIVED: "bg-muted text-muted-foreground",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBlogListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [categorySlug, setCategorySlug] = useState("");
  const [updatedFrom, setUpdatedFrom] = useState("");
  const [updatedTo, setUpdatedTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 20;

  const hasDateFilter = updatedFrom || updatedTo;

  const resetFilters = () => {
    setQ(""); setStatus("ALL"); setCategorySlug("");
    setUpdatedFrom(""); setUpdatedTo(""); setSortOrder("desc"); setPage(1);
  };

  const toggleDateSort = () => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));

  const { data, isLoading, isError } = useAdminListBlogsQuery({
    page,
    limit,
    sortBy: "updatedAt",
    sortOrder,
    ...(q.trim() ? { searchTerm: q.trim() } : {}),
    ...(status !== "ALL" ? { status } : {}),
    ...(categorySlug ? { categorySlug } : {}),
    ...(updatedFrom ? { updatedFrom } : {}),
    ...(updatedTo ? { updatedTo } : {}),
  });

  const { data: catData } = useGetBlogCategoriesQuery();
  const [publishBlog, { isLoading: publishing }] = useAdminPublishBlogMutation();
  const [archiveBlog] = useAdminArchiveBlogMutation();

  const handlePublish = async (id: string) => {
    if (!confirm("Publish this post?")) return;
    try {
      await publishBlog(id).unwrap();
      toast.success("Post published");
    } catch { /* baseApi toasts */ }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this post? It will be hidden from the public.")) return;
    try {
      await archiveBlog(id).unwrap();
      toast.success("Post archived");
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and publish blog content.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New post
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
            placeholder="Search title…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-56 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as StatusFilter); setPage(1); }}
          className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={categorySlug}
          onChange={(e) => { setCategorySlug(e.target.value); setPage(1); }}
          className="text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">All categories</option>
          {(catData ?? []).map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        {/* Date range — last modified */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Modified</span>
          <input
            type="date"
            value={updatedFrom}
            onChange={(e) => { setUpdatedFrom(e.target.value); setPage(1); }}
            className="text-sm rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="date"
            value={updatedTo}
            min={updatedFrom || undefined}
            onChange={(e) => { setUpdatedTo(e.target.value); setPage(1); }}
            className="text-sm rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>

        {/* Reset — only shown when any filter is active */}
        {(q || status !== "ALL" || categorySlug || hasDateFilter) && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading posts…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load posts.</p>}

      {data && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">
                    <button
                      type="button"
                      onClick={toggleDateSort}
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Last Updated
                      {sortOrder === "desc" ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUp className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-start gap-2">
                        {post.isFeatured && (
                          <Star className="h-3 w-3 mt-0.5 shrink-0 text-amber-400 fill-amber-400" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate leading-snug">{post.title}</p>
                          {post.author && (
                            <p className="text-[11px] text-muted-foreground truncate">{post.author.fullName}</p>
                          )}
                          {/* xs-only status badge (hidden once Status column appears) */}
                          <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full sm:hidden ${STATUS_BADGE[post.status]}`}>
                            {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase tracking-wide">
                        {post.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[post.status]}`}>
                        {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDate(post.updatedAt)}
                      </div>
                      {post.status === "PUBLISHED" && post.publishedAt && (
                        <div className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
                          Published {formatDate(post.publishedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {post.status === "DRAFT" && (
                          <button
                            type="button"
                            onClick={() => handlePublish(post.id)}
                            disabled={publishing}
                            title="Publish"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-30"
                          >
                            <Globe className="h-4 w-4" />
                          </button>
                        )}
                        {post.status !== "ARCHIVED" && (
                          <button
                            type="button"
                            onClick={() => handleArchive(post.id)}
                            title="Archive"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No posts match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
            <span className="text-sm text-muted-foreground">
              {total === 0 ? "0 results" : `${from}–${to} of ${total}`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {getPageRange(page, totalPages).map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="w-8 text-center text-muted-foreground select-none">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
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

function getPageRange(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "..."> = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
