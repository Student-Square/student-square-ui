"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminCreateCardMutation,
  useAdminUpdateCardMutation,
  useAdminUploadCardImageMutation,
} from "@/redux/features/content/contentApi";
import { useGetBlogsQuery } from "@/redux/features/blogs/blogsApi";
import { useGetStoriesQuery } from "@/redux/features/stories/storiesApi";
import type {
  AdminFeatureCard,
  CardStatus,
  ContentRefType,
  HeroSlot,
} from "@/types/content";
import type { ApiBlogListItem } from "@/types/blogs";
import type { ApiStoryListItem } from "@/types/stories";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ImageOff,
  Loader2,
  Pencil,
  Search,
  Upload,
  X,
} from "lucide-react";

type Mode = { kind: "create" } | { kind: "edit"; card: AdminFeatureCard };

const SLOTS: HeroSlot[] = ["main_carousel", "secondary", "third", "blog_1", "blog_2"];
const STATUSES: CardStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const CONTENT_TYPES: ContentRefType[] = ["BLOG", "STORY", "PROJECT", "SERVICE", "EXTERNAL"];

type FormState = {
  slot: HeroSlot;
  contentType: ContentRefType;
  contentRef: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  imageId: string | null;
  status: CardStatus;
  order: number;
};

const emptyState: FormState = {
  slot: "main_carousel",
  contentType: "BLOG",
  contentRef: "",
  title: "",
  summary: "",
  category: "",
  image: "",
  imageId: null,
  status: "DRAFT",
  order: 1,
};

// ── Shared picker dropdown ────────────────────────────────────────────────────

type PickerItem = {
  id: string;
  ref: string;
  title: string;
  category: string;
  imageUrl: string;
  imageId: string;
  excerpt?: string;
  meta?: string;
};

function PickerDropdown({
  items,
  isFetching,
  value,
  query,
  onQueryChange,
  onSelect,
  onClose,
  placeholder,
}: {
  items: PickerItem[];
  isFetching: boolean;
  value: string;
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-1">
          {isFetching && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />}
          <button type="button" onClick={onClose} className="p-0.5 rounded hover:bg-muted text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-border">
        {!isFetching && items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-5">No results found.</p>
        )}
        {items.map((item) => {
          const isSelected = item.ref === value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => { onSelect(item); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted ${
                isSelected ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.meta ?? item.category}</p>
              </div>
              {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type PickerSelectData = {
  ref: string;
  title: string;
  category: string;
  imageUrl: string;
  imageId: string;
  excerpt: string;
};

// ── Blog post picker ──────────────────────────────────────────────────────────

function BlogPicker({
  value,
  selectedTitle,
  selectedImage,
  selectedCategory,
  onSelect,
}: {
  value: string;
  selectedTitle: string;
  selectedImage: string;
  selectedCategory: string;
  onSelect: (data: PickerSelectData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetBlogsQuery(
    { searchTerm: debouncedQuery || undefined, limit: 15, sortBy: "publishedAt", sortOrder: "desc" },
    { skip: !isOpen }
  );

  const items: PickerItem[] = (data?.data ?? []).map((p: ApiBlogListItem) => ({
    id: p.id,
    ref: p.id,
    title: p.title,
    category: p.category.name,
    imageUrl: p.coverImage?.url ?? "",
    imageId: p.coverImage?.id ?? "",
    excerpt: p.excerpt,
    meta: p.category.name,
  }));

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-900/10">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedImage} alt={selectedTitle} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{selectedTitle || value}</p>
            <p className="text-[11px] text-muted-foreground">{selectedCategory}</p>
            <p className="text-[11px] text-muted-foreground/60 truncate">/blog/{value}</p>
          </div>
          <button
            type="button"
            onClick={() => { setIsOpen(true); setQuery(""); }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:border-emerald-500/60 hover:text-emerald-600 transition-colors shrink-0"
          >
            <Pencil className="h-3 w-3" /> Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors text-muted-foreground text-sm"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search and select a published blog post…
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>
      )}

      {isOpen && (
        <PickerDropdown
          items={items}
          isFetching={isFetching}
          value={value}
          query={query}
          onQueryChange={setQuery}
          onSelect={(item) => {
            onSelect({ ref: item.ref, title: item.title, category: item.category, imageUrl: item.imageUrl, imageId: item.imageId, excerpt: item.excerpt ?? "" });
            setQuery("");
          }}
          onClose={() => { setIsOpen(false); setQuery(""); }}
          placeholder="Search by title…"
        />
      )}
    </div>
  );
}

// ── Real-life story picker ────────────────────────────────────────────────────

function StoryPicker({
  value,
  selectedTitle,
  selectedImage,
  onSelect,
}: {
  value: string;
  selectedTitle: string;
  selectedImage: string;
  onSelect: (data: PickerSelectData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetStoriesQuery(
    { searchTerm: debouncedQuery || undefined, limit: 15, sortBy: "publishedAt", sortOrder: "desc" },
    { skip: !isOpen }
  );

  const items: PickerItem[] = (data?.data ?? []).map((s: ApiStoryListItem) => ({
    id: s.id,
    ref: s.slug,
    title: s.name,
    category: "Real Life Stories",
    imageUrl: s.coverImage?.url ?? "",
    imageId: s.coverImage?.id ?? "",
    excerpt: s.summary ?? "",
    meta: s.achievement ?? s.university ?? s.department ?? "Real Life Story",
  }));

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-900/10">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedImage} alt={selectedTitle} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{selectedTitle || value}</p>
            <p className="text-[11px] text-muted-foreground">Real Life Stories</p>
            <p className="text-[11px] text-muted-foreground/60 truncate">/blog/real-life-stories/{value}</p>
          </div>
          <button
            type="button"
            onClick={() => { setIsOpen(true); setQuery(""); }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:border-emerald-500/60 hover:text-emerald-600 transition-colors shrink-0"
          >
            <Pencil className="h-3 w-3" /> Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors text-muted-foreground text-sm"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search and select a published story…
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>
      )}

      {isOpen && (
        <PickerDropdown
          items={items}
          isFetching={isFetching}
          value={value}
          query={query}
          onQueryChange={setQuery}
          onSelect={(item) => {
            onSelect({ ref: item.ref, title: item.title, category: item.category, imageUrl: item.imageUrl, imageId: item.imageId, excerpt: item.excerpt ?? "" });
            setQuery("");
          }}
          onClose={() => { setIsOpen(false); setQuery(""); }}
          placeholder="Search by name…"
        />
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function CardForm({ mode, initialSlot }: { mode: Mode; initialSlot?: HeroSlot }) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(
    mode.kind === "edit"
      ? {
          slot: mode.card.slot,
          contentType: mode.card.contentType,
          contentRef: mode.card.contentRef,
          title: mode.card.title,
          summary: mode.card.summary ?? "",
          category: mode.card.category,
          image: mode.card.image ?? "",
          imageId: mode.card.imageId ?? null,
          status: mode.card.status,
          order: mode.card.order,
        }
      : { ...emptyState, ...(initialSlot ? { slot: initialSlot } : {}) }
  );

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [createCard, { isLoading: isCreating }] = useAdminCreateCardMutation();
  const [updateCard, { isLoading: isUpdating }] = useAdminUpdateCardMutation();
  const [uploadImage, { isLoading: isUploading }] = useAdminUploadCardImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSaving = isCreating || isUpdating;
  const usesPicker = form.contentType === "BLOG" || form.contentType === "STORY";

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (mode.kind === "create") setField("contentRef", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.contentType]);

  function handlePickerSelect(data: PickerSelectData) {
    setForm((prev) => ({
      ...prev,
      contentRef: data.ref,
      title: data.title,
      category: data.category,
      image: prev.image || data.imageUrl,
      imageId: prev.imageId || data.imageId || null,
      summary: prev.summary || data.excerpt,
    }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await uploadImage(formData).unwrap();
      setForm((prev) => ({ ...prev, image: result.url, imageId: result.id }));
      toast.success("Image uploaded");
    } catch { /* toasted by baseApi */ }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.contentRef.trim()) {
      toast.error(usesPicker ? "Please select a post or story." : "Content reference is required.");
      return;
    }
    if (!form.title.trim() || !form.category.trim()) {
      toast.error("Title and category are required. Select a post to auto-fill them.");
      return;
    }

    const payload = {
      slot: form.slot,
      contentType: form.contentType,
      contentRef: form.contentRef.trim(),
      title: form.title.trim(),
      summary: form.summary.trim() || null,
      category: form.category.trim(),
      imageId: form.imageId ?? null,
      status: form.status,
      order: form.order,
    };

    try {
      if (mode.kind === "edit") {
        await updateCard({ id: mode.card.id, data: payload }).unwrap();
        toast.success("Card updated");
      } else {
        await createCard(payload).unwrap();
        toast.success("Card created");
      }
      router.push("/admin/hero");
    } catch { /* toasted by baseApi */ }
  }

  return (
    <>
      <Link
        href="/admin/hero"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-emerald-600 transition-colors mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        {mode.kind === "edit" ? "Edit card" : "New hero card"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground mb-8">
        {mode.kind === "edit"
          ? "Change the linked post or update slot, status, and order. Title, summary, and image are filled automatically."
          : "Pick a published post or story to feature. Title, summary, and image are filled automatically."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl 2xl:max-w-3xl">

        {/* Content type */}
        <Field label="Content type" required>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setField("contentType", t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  form.contentType === t
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-card border-border text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        {/* Picker (BLOG / STORY) or manual ref (others) */}
        {usesPicker ? (
          <Field
            label={form.contentType === "BLOG" ? "Blog post" : "Real-life story"}
            required
          >
            {form.contentType === "BLOG" ? (
              <BlogPicker
                value={form.contentRef}
                selectedTitle={form.title}
                selectedImage={form.image}
                selectedCategory={form.category}
                onSelect={handlePickerSelect}
              />
            ) : (
              <StoryPicker
                value={form.contentRef}
                selectedTitle={form.title}
                selectedImage={form.image}
                onSelect={handlePickerSelect}
              />
            )}
          </Field>
        ) : (
          <Field
            label="Content reference"
            required
            hint={
              form.contentType === "PROJECT" ? "Project slug, e.g. counter-climate-change" :
              form.contentType === "SERVICE" ? "Service slug, e.g. student-counselling" :
              "Absolute URL, e.g. https://example.com/page"
            }
          >
            <input
              type="text"
              value={form.contentRef}
              onChange={(e) => setField("contentRef", e.target.value)}
              className="form-input"
            />
          </Field>
        )}

        {/* Slot + Status + Order */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Slot" required>
            <select
              value={form.slot}
              onChange={(e) => setField("slot", e.target.value as HeroSlot)}
              className="form-input"
            >
              {SLOTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Status" required>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value as CardStatus)}
              className="form-input"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Order" hint="Unique within slot">
            <input
              type="number"
              value={form.order}
              onChange={(e) => setField("order", Number(e.target.value) || 0)}
              min={0}
              className="form-input"
            />
          </Field>
        </div>

        {/* Non-picker types: manual title / category / summary / image */}
        {!usesPicker && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Card title" required className="sm:col-span-2">
                <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} className="form-input" />
              </Field>
              <Field label="Category" required>
                <input type="text" value={form.category} onChange={(e) => setField("category", e.target.value)} className="form-input" />
              </Field>
            </div>
            <Field label="Summary" hint="Optional — short text shown on the carousel card">
              <textarea
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                rows={3}
                className="form-input"
                placeholder="Short description shown on the carousel…"
              />
            </Field>
            <Field label="Image">
              <ImageField
                image={form.image}
                isUploading={isUploading}
                fileInputRef={fileInputRef}
                onFile={handleFile}
                onClear={() => setForm((p) => ({ ...p, image: "", imageId: null }))}
              />
            </Field>
          </>
        )}

        {/* Customize section (for BLOG/STORY — optional overrides) */}
        {usesPicker && (
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setCustomizeOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customize card display
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                {customizeOpen ? "Hide" : "Override title, summary, or image"}
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${customizeOpen ? "rotate-90" : ""}`} />
              </span>
            </button>

            {customizeOpen && (
              <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Card title override" className="sm:col-span-2"
                    hint="Auto-filled from post — edit only if you want a different headline">
                    <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} className="form-input" />
                  </Field>
                  <Field label="Category override">
                    <input type="text" value={form.category} onChange={(e) => setField("category", e.target.value)} className="form-input" />
                  </Field>
                </div>

                <Field label="Summary" hint="Auto-filled from the post excerpt — shown on the main carousel card">
                  <textarea
                    value={form.summary}
                    onChange={(e) => setField("summary", e.target.value)}
                    rows={3}
                    className="form-input"
                    placeholder="Short description shown on the carousel…"
                  />
                </Field>

                <Field label="Image override" hint="Auto-filled from post cover — upload only if you want a different image">
                  <ImageField
                    image={form.image}
                    isUploading={isUploading}
                    fileInputRef={fileInputRef}
                    onFile={handleFile}
                    onClear={() => setForm((p) => ({ ...p, image: "", imageId: null }))}
                  />
                </Field>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode.kind === "edit" ? "Save changes" : "Create card"}
          </button>
          <Link
            href="/admin/hero"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <style jsx>{`
        :global(.form-input) {
          display: block;
          width: 100%;
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
        }
        :global(.form-input:focus) {
          outline: none;
          border-color: rgb(16 185 129 / 0.6);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.15);
        }
      `}</style>
    </>
  );
}

// ── Reusable image upload field ───────────────────────────────────────────────

function ImageField({
  image,
  isUploading,
  fileInputRef,
  onFile,
  onClear,
}: {
  image: string;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-start gap-4 flex-wrap">
      <div className="w-28 h-20 rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-[180px] space-y-2">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-semibold hover:border-emerald-500/60 hover:text-emerald-600 transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {isUploading ? "Uploading…" : "Upload file"}
          </button>
          {image && (
            <button type="button" onClick={onClear}
              className="text-xs text-muted-foreground hover:text-red-600 transition-colors">
              Clear
            </button>
          )}
        </div>
        {image && (
          <p className="text-[11px] text-muted-foreground truncate max-w-xs">{image}</p>
        )}
      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1 text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
