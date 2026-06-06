"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
} from "@/redux/features/blogs/adminBlogsApi";
import { useGetBlogCategoriesQuery } from "@/redux/features/blogs/blogsApi";
import type { ApiBlogCategoryWithCount } from "@/types/blogs";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

function CategoryRow({
  cat,
  index,
  editingId,
  editName,
  editOrder,
  savingId,
  togglingId,
  deletingId,
  totalCount,
  onStartEdit,
  onEditName,
  onEditOrder,
  onSave,
  onCancelEdit,
  onToggleActive,
  onDelete,
}: {
  cat: ApiBlogCategoryWithCount;
  index: number;
  editingId: string | null;
  editName: string;
  editOrder: string;
  savingId: string | null;
  togglingId: string | null;
  deletingId: string | null;
  totalCount: number;
  onStartEdit: (cat: ApiBlogCategoryWithCount) => void;
  onEditName: (v: string) => void;
  onEditOrder: (v: string) => void;
  onSave: (id: string) => void;
  onCancelEdit: () => void;
  onToggleActive: (cat: ApiBlogCategoryWithCount) => void;
  onDelete: (cat: ApiBlogCategoryWithCount) => void;
}) {
  const isEditing = editingId === cat.id;

  return (
    <tr
      className={`border-b border-border transition-colors ${
        isEditing
          ? "bg-emerald-50/40 dark:bg-emerald-900/10"
          : !cat.isActive
            ? "opacity-60 hover:bg-muted/20"
            : "hover:bg-muted/20"
      }`}
    >
      {/* Order number */}
      <td className="px-3 py-3 w-16">
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <input
              type="number"
              value={editOrder}
              onChange={(e) => onEditOrder(e.target.value)}
              min={1}
              max={totalCount}
              className="px-1.5 py-0.5 text-sm rounded border border-border bg-background w-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-center"
            />
          ) : (
            <span className="text-sm font-mono font-semibold text-muted-foreground w-6 text-center">
              {cat.order ?? index + 1}
            </span>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditName(e.target.value)}
            autoFocus
            className="px-2.5 py-1 text-sm rounded-lg border border-emerald-400 bg-background w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        ) : (
          <span className="font-medium text-foreground">{cat.name}</span>
        )}
      </td>

      {/* Slug */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-[11px] font-mono text-muted-foreground">{cat.slug}</span>
      </td>

      {/* Posts */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            cat._count.posts > 0
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {!isEditing && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              cat.isActive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {cat.isActive ? "Active" : "Inactive"}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => onSave(cat.id)}
                disabled={savingId === cat.id || !editName.trim()}
                title="Save"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 transition-colors disabled:opacity-30"
              >
                {savingId === cat.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                title="Cancel"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onStartEdit(cat)}
                title="Edit"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(cat)}
                disabled={togglingId === cat.id}
                title={cat.isActive ? "Deactivate" : "Activate"}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors disabled:opacity-30 ${
                  cat.isActive
                    ? "hover:bg-amber-100 dark:hover:bg-amber-900/30 text-muted-foreground hover:text-amber-600"
                    : "hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600"
                }`}
              >
                {togglingId === cat.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : cat.isActive ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onDelete(cat)}
                disabled={deletingId === cat.id}
                title={
                  cat._count.posts > 0
                    ? `${cat._count.posts} post(s) — cannot delete`
                    : "Delete"
                }
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-30"
              >
                {deletingId === cat.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBlogCategoriesPage() {
  const { data: categories = [], isLoading, isError } = useGetBlogCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useAdminCreateCategoryMutation();
  const [updateCategory] = useAdminUpdateCategoryMutation();
  const [deleteCategory] = useAdminDeleteCategoryMutation();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("");
  const [postSort, setPostSort] = useState<"none" | "desc" | "asc">("none");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = (() => {
    const list = [...(categories as ApiBlogCategoryWithCount[])];

    if (postSort !== "none") {
      return list.sort((a, b) => {
        const diff =
          postSort === "desc"
            ? b._count.posts - a._count.posts
            : a._count.posts - b._count.posts;

        if (diff !== 0) return diff;
        return (a.order ?? 0) - (b.order ?? 0);
      });
    }

    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  })();

  const nextOrder = sorted.length > 0
    ? Math.max(...(categories as ApiBlogCategoryWithCount[]).map((c) => c.order ?? 0)) + 1
    : 1;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      await createCategory({ name, order: nextOrder }).unwrap();
      toast.success(`Category "${name}" created`);
      setNewName("");
    } catch { /* baseApi toasts */ }
  };

  const startEdit = (cat: ApiBlogCategoryWithCount) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditOrder(String(cat.order ?? 0));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditOrder("");
  };

  const handleSave = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const rawOrder = editOrder !== "" ? Number(editOrder) : undefined;
    const clampedOrder =
      rawOrder !== undefined ? Math.max(1, Math.min(sorted.length, rawOrder)) : undefined;
    setSavingId(id);
    try {
      await updateCategory({ id, data: { name, order: clampedOrder } }).unwrap();
      toast.success("Category updated");
      cancelEdit();
    } catch { /* baseApi toasts */ }
    setSavingId(null);
  };

  const handleToggleActive = async (cat: ApiBlogCategoryWithCount) => {
    setTogglingId(cat.id);
    try {
      await updateCategory({ id: cat.id, data: { isActive: !cat.isActive } }).unwrap();
      toast.success(cat.isActive ? `"${cat.name}" deactivated` : `"${cat.name}" activated`);
    } catch { /* baseApi toasts */ }
    setTogglingId(null);
  };

  const handleDelete = async (cat: ApiBlogCategoryWithCount) => {
    if (cat._count.posts > 0) {
      toast.error(`Cannot delete — ${cat._count.posts} post(s) use this category`);
      return;
    }
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    setDeletingId(cat.id);
    try {
      await deleteCategory(cat.id).unwrap();
      toast.success(`Category "${cat.name}" deleted`);
    } catch { /* baseApi toasts */ }
    setDeletingId(null);
  };

  const togglePostSort = () => {
    setPostSort((current) =>
      current === "none" ? "desc" : current === "desc" ? "asc" : "none"
    );
  };

  const PostSortIcon =
    postSort === "desc" ? ArrowDown : postSort === "asc" ? ArrowUp : ArrowUpDown;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Blog Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the order number to rearrange categories. Deactivated categories cannot be assigned to new posts.
        </p>
      </div>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-2 mb-6 p-4 rounded-xl border border-border bg-card/60"
      >
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Category name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Education & Career"
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Order (auto)
            </label>
            <div className="px-3 py-1.5 text-sm rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground w-20 text-center select-none">
              {nextOrder}
            </div>
          </div>
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add category
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load categories.</p>}

      {!isLoading && !isError && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left font-semibold w-16"># Order</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell w-24">
                  <button
                    type="button"
                    onClick={togglePostSort}
                    className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                    title={
                      postSort === "none"
                        ? "Sort by posts"
                        : postSort === "desc"
                          ? "Showing most posts first"
                          : "Showing fewest posts first"
                    }
                  >
                    <span>Posts</span>
                    <PostSortIcon className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold w-24">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((cat, i) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  index={i}
                  editingId={editingId}
                  editName={editName}
                  editOrder={editOrder}
                  savingId={savingId}
                  togglingId={togglingId}
                  deletingId={deletingId}
                  totalCount={sorted.length}
                  onStartEdit={startEdit}
                  onEditName={setEditName}
                  onEditOrder={setEditOrder}
                  onSave={handleSave}
                  onCancelEdit={cancelEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                />
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No categories yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
