"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Loader2,
  Plus,
  Save,
  Send,
  Tag,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useAdminCreateBlogMutation,
  useAdminPublishBlogMutation,
  useAdminCreateCategoryMutation,
} from "@/redux/features/blogs/adminBlogsApi";
import { useGetBlogCategoriesQuery } from "@/redux/features/blogs/blogsApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import RichTextEditor from "@/components/editor/RichTextEditor";
import BlogPreview from "@/components/editor/BlogPreview";
import CoverImageUpload from "@/components/editor/CoverImageUpload";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

// ─── Tag input ────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-red-500 transition-colors">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder="Type a tag and press Enter…"
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Category selector ────────────────────────────────────────────────────────
function CategorySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (slug: string, name: string) => void;
}) {
  const { data: catData, refetch } = useGetBlogCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useAdminCreateCategoryMutation();
  const [open, setOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [dupError, setDupError] = useState("");

  const allCategories = catData ?? [];
  const categories = allCategories.filter((c) => c.isActive);
  const selected = allCategories.find((c) => c.slug === value);

  const handleCreate = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const slug = slugify(name);
    const dup = categories.find((c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase());
    if (dup) { setDupError(`"${dup.name}" already exists.`); return; }
    setDupError("");
    try {
      const cat = await createCategory({ name }).unwrap();
      refetch();
      onChange(cat.slug, cat.name);
      setNewCatName(""); setShowCreate(false); setOpen(false);
    } catch { setDupError("Could not create — may already exist."); }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg bg-card border border-border hover:border-emerald-500/60 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>{selected ? selected.name : "Select a category…"}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-xl"
          >
            <div className="max-h-48 overflow-y-auto p-1">
              {categories.map((cat) => (
                <button key={cat.id} type="button" onClick={() => { onChange(cat.slug, cat.name); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${cat.slug === value ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "hover:bg-accent text-popover-foreground"}`}>
                  {cat.name}
                  {cat.slug === value && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              {!showCreate ? (
                <button type="button" onClick={() => setShowCreate(true)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-semibold">
                  <Plus className="h-3.5 w-3.5" /> Create new category
                </button>
              ) : (
                <div className="space-y-2 p-1">
                  <input autoFocus type="text" value={newCatName}
                    onChange={(e) => { setNewCatName(e.target.value); setDupError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreate(); } if (e.key === "Escape") setShowCreate(false); }}
                    placeholder="Category name…"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {dupError && <p className="text-xs text-red-500 px-1">{dupError}</p>}
                  {newCatName && !dupError && (
                    <p className="text-[10px] text-muted-foreground px-1">Slug: <span className="font-mono text-emerald-600">{slugify(newCatName)}</span></p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCreate} disabled={!newCatName.trim() || creating}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                      {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Create
                    </button>
                    <button type="button" onClick={() => { setShowCreate(false); setDupError(""); }} className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent transition-colors">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NewBlogPage() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [createBlog, { isLoading: saving }] = useAdminCreateBlogMutation();
  const [publishBlog, { isLoading: publishing }] = useAdminPublishBlogMutation();

  const wordCount = useMemo(() => {
    const text = body.replace(/<[^>]+>/g, " ");
    return text.split(/\s+/).filter(Boolean).length;
  }, [body]);
  const readTime = Math.max(1, Math.round(wordCount / 220));

  const isValid = title.trim().length > 0 && excerpt.trim().length > 0 && body.replace(/<[^>]+>/g, "").trim().length > 0 && categorySlug.length > 0;

  const buildPayload = () => ({
    title,
    excerpt,
    body,
    categorySlug,
    tagSlugs: tags,
    isFeatured,
    ...(coverImageId ? { coverImageId } : {}),
  });

  const handleSaveDraft = async () => {
    if (!isValid) return;
    await createBlog(buildPayload()).unwrap();
    router.push("/admin/blog/education-career");
  };

  const handlePublish = async () => {
    if (!isValid) return;
    const post = await createBlog(buildPayload()).unwrap();
    await publishBlog(post.id).unwrap();
    router.push("/admin/blog/education-career");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/education-career" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Admin / Blog</p>
            <h1 className="text-sm font-bold text-foreground">New Blog Post</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Author pill */}
          {user && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              By <span className="font-semibold text-foreground">{user.fullName}</span>
            </span>
          )}

          {/* Tab switcher */}
          <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
            <button type="button" onClick={() => setTab("write")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${tab === "write" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <FileText className="h-3.5 w-3.5" /> Write
            </button>
            <button type="button" onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${tab === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>

          <button type="button" onClick={handleSaveDraft} disabled={!isValid || saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 transition-colors">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Draft
          </button>
          <button type="button" onClick={handlePublish} disabled={!isValid || saving || publishing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors">
            {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Publish
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {tab === "write" ? (
            <motion.div key="write" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_300px] 2xl:grid-cols-[1fr_360px] gap-8">

              {/* Left: editor */}
              <div className="space-y-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title…"
                  className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground"
                />
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Excerpt</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    placeholder="A short summary shown in listings…"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-card border border-border focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none leading-relaxed"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body</label>
                    <span className="text-[11px] text-muted-foreground">{wordCount} words · {readTime} min read</span>
                  </div>
                  <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Write your post content here…"
                  />
                </div>
              </div>

              {/* Right: settings sidebar */}
              <div className="space-y-6">
                <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Draft</p>
                    <p className="text-[11px] text-muted-foreground">Not published yet</p>
                  </div>
                </div>

                {/* Author (read-only) */}
                {user && (
                  <div className="rounded-xl border border-border bg-card/40 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Author</p>
                    <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{user.email}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <CategorySelector value={categorySlug} onChange={(slug, name) => { setCategorySlug(slug); setCategoryName(name); }} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Tag className="h-3 w-3" /> Tags
                  </label>
                  <TagInput tags={tags} onChange={setTags} />
                </div>

                <CoverImageUpload
                  imageUrl={coverImageUrl || null}
                  onUpload={(id, url) => { setCoverImageId(id); setCoverImageUrl(url); }}
                  onRemove={() => { setCoverImageId(""); setCoverImageUrl(""); }}
                />

                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Featured post</p>
                    <p className="text-xs text-muted-foreground">Show in featured slot</p>
                  </div>
                  <button type="button" onClick={() => setIsFeatured((f) => !f)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${isFeatured ? "bg-emerald-600" : "bg-muted"}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isFeatured ? "translate-x-4" : ""}`} />
                  </button>
                </div>

                {!isValid && (title || excerpt || body || categorySlug) && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 space-y-1">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Required fields missing:</p>
                    {!title.trim() && <p className="text-[11px] text-amber-600">· Title</p>}
                    {!excerpt.trim() && <p className="text-[11px] text-amber-600">· Excerpt</p>}
                    {!body.replace(/<[^>]+>/g, "").trim() && <p className="text-[11px] text-amber-600">· Body</p>}
                    {!categorySlug && <p className="text-[11px] text-amber-600">· Category</p>}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="border border-border rounded-2xl bg-card min-h-[600px] overflow-hidden">
              <div className="bg-muted/50 border-b border-border px-6 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">blog preview</span>
              </div>
              <BlogPreview
                title={title}
                excerpt={excerpt}
                bodyHtml={body}
                categoryName={categoryName}
                authorName={user?.fullName ?? ""}
                tags={tags}
                coverImageUrl={coverImageUrl || undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
