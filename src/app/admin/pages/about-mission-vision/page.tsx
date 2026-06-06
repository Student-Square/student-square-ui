"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  useAdminGetEditablePageQuery,
  useAdminUpdateEditablePageMutation,
  useAdminUploadPageImageMutation,
} from "@/redux/features/content/contentApi";
import type { AdminPageBodySectionInput } from "@/types/content";
import {
  Check,
  FilePen,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const SLUG = "about-mission-vision" as const;

export default function MissionVisionEditorPage() {
  const { data: page, isLoading } = useAdminGetEditablePageQuery(SLUG);
  const [updatePage, { isLoading: isSaving }] = useAdminUpdateEditablePageMutation();
  const [uploadImage, { isLoading: isUploading }] = useAdminUploadPageImageMutation();

  const [heroTitle, setHeroTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");
  const [sections, setSections] = useState<AdminPageBodySectionInput[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!page) return;
    setHeroTitle(page.heroTitle ?? "");
    setBannerUrl(page.bannerUrl ?? "");
    setBannerAlt(page.bannerAlt ?? "");
    setSections(
      page.sections.map((s) => ({ id: s.id, heading: s.heading, body: s.body }))
    );
  }, [page]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const result = await uploadImage(form).unwrap();
      setBannerUrl(result.url);
      toast.success("Banner image uploaded");
    } catch { /* baseApi toasts */ }
    e.target.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = (v: string) => v.trim() || undefined;
    try {
      await updatePage({
        slug: SLUG,
        data: {
          heroTitle: f(heroTitle),
          bannerUrl: f(bannerUrl) ?? null,
          bannerAlt: f(bannerAlt) ?? null,
          sections: sections.map((s) => ({
            id: s.id,
            heading: s.heading,
            body: s.body,
          })),
        },
      }).unwrap();
      setSaved(true);
      toast.success("Page saved");
      setTimeout(() => setSaved(false), 2000);
    } catch { /* baseApi toasts */ }
  };

  const addSection = () =>
    setSections((prev) => [...prev, { heading: "", body: "" }]);

  const updateSection = (
    i: number,
    field: keyof AdminPageBodySectionInput,
    value: string
  ) =>
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );

  const removeSection = (i: number) =>
    setSections((prev) => prev.filter((_, idx) => idx !== i));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-20">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="max-w-3xl 2xl:max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Our Mission &amp; Vision</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the hero title, banner image, and body sections for this page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <FilePen className="h-3.5 w-3.5 text-emerald-600" />
            </span>
            <h2 className="text-sm font-bold text-foreground">Hero Section</h2>
          </div>

          <Field label="Page title">
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Our Mission & Vision"
              className="field-input"
            />
          </Field>

          <Field label="Banner image URL">
            <div className="flex gap-2">
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://… or upload below"
                className="field-input"
              />
              <label className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-emerald-500 cursor-pointer transition-colors">
                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
              </label>
            </div>
          </Field>

          {bannerUrl && (
            <div className="aspect-[3/1] overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerUrl} alt="Banner preview" className="h-full w-full object-cover" />
            </div>
          )}

          <Field label="Banner alt text">
            <input
              type="text"
              value={bannerAlt}
              onChange={(e) => setBannerAlt(e.target.value)}
              placeholder="Describe the banner image"
              className="field-input"
            />
          </Field>
        </motion.div>

        {/* Body sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <GripVertical className="h-3.5 w-3.5 text-blue-600" />
              </span>
              <h2 className="text-sm font-bold text-foreground">Body Sections</h2>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add section
            </button>
          </div>

          {sections.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No sections yet. Click &ldquo;Add section&rdquo; to get started.
            </p>
          )}

          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Section {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSection(i)}
                    className="p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label="Remove section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Field label="Heading">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => updateSection(i, "heading", e.target.value)}
                    placeholder="Section heading"
                    className="field-input"
                  />
                </Field>
                <Field label="Body">
                  <textarea
                    value={section.body}
                    onChange={(e) => updateSection(i, "body", e.target.value)}
                    rows={5}
                    placeholder="Section body text…"
                    className="field-input resize-none"
                  />
                </Field>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 shadow-sm"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save page"}
          </button>
        </div>
      </form>

      <style jsx>{`
        :global(.field-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.625rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground); transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.field-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.7);
          box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
