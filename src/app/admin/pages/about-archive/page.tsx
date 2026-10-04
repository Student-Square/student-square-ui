"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminListPageSectionsQuery,
  useAdminUpsertPageSectionMutation,
} from "@/redux/features/content/contentApi";
import {
  ARCHIVE_PAGE_SLUG,
  ARCHIVE_SECTION_KEY,
  parseArchiveItems,
  type ArchiveItem,
} from "@/lib/archive";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

const blank = (): ArchiveItem => ({
  id: crypto.randomUUID(),
  year: String(new Date().getFullYear()),
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
});

export default function ArchiveEditorPage() {
  const { data, isLoading } = useAdminListPageSectionsQuery(ARCHIVE_PAGE_SLUG);
  const [saveSection, { isLoading: isSaving }] = useAdminUpsertPageSectionMutation();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!data || ready) return;
    const section = data.find((row) => row.sectionKey === ARCHIVE_SECTION_KEY);
    setItems(parseArchiveItems(section?.content));
    setReady(true);
  }, [data, ready]);

  const update = (id: string, patch: Partial<ArchiveItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleSave = async () => {
    const cleaned = items
      .map((item) => ({
        ...item,
        year: item.year.trim(),
        title: item.title.trim(),
        titleBn: item.titleBn.trim(),
        description: item.description.trim(),
        descriptionBn: item.descriptionBn.trim(),
      }))
      .filter((item) => item.title);
    if (cleaned.length !== items.length) {
      toast.error("Every archive entry needs an English title");
      return;
    }
    try {
      await saveSection({
        pageSlug: ARCHIVE_PAGE_SLUG,
        sectionKey: ARCHIVE_SECTION_KEY,
        content: { items: cleaned },
      }).unwrap();
      setItems(cleaned);
      toast.success("Archive saved");
    } catch {
      /* baseApi toasts */
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Archive</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          These entries appear on{" "}
          <Link href="/about/archive" className="text-emerald-600 hover:underline" target="_blank">
            /about/archive
          </Link>
          . Fill the Bangla fields so the Bangla site does not fall back to English.
        </p>
      </div>

      {isLoading && !ready ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading archive
        </div>
      ) : (
        <div className="space-y-4">
          {items.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Nothing is archived yet. Add the first entry.
            </p>
          )}

          {items.map((item, index) => (
            <div key={item.id} className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Entry {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Year
                </span>
                <input
                  value={item.year}
                  onChange={(e) => update(item.id, { year: e.target.value })}
                  maxLength={20}
                  className="form-input w-32"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Title *
                </span>
                <input
                  value={item.title}
                  onChange={(e) => update(item.id, { title: e.target.value })}
                  maxLength={200}
                  className="form-input w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Title in Bangla
                </span>
                <input
                  value={item.titleBn}
                  onChange={(e) => update(item.id, { titleBn: e.target.value })}
                  maxLength={200}
                  className="form-input w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Description
                </span>
                <textarea
                  value={item.description}
                  onChange={(e) => update(item.id, { description: e.target.value })}
                  rows={3}
                  maxLength={2000}
                  className="form-input w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Description in Bangla
                </span>
                <textarea
                  value={item.descriptionBn}
                  onChange={(e) => update(item.id, { descriptionBn: e.target.value })}
                  rows={3}
                  maxLength={2000}
                  className="form-input w-full"
                />
              </label>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setItems((current) => [...current, blank()])}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> Add entry
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save archive
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.form-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.5rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground);
        }
        :global(.form-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.6);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.15);
        }
      `}</style>
    </div>
  );
}
