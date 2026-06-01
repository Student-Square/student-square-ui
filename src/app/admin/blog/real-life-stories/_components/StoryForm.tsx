"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useAdminCreateStoryMutation,
  useAdminUpdateStoryMutation,
  useAdminPublishStoryMutation,
} from "@/redux/features/stories/adminStoriesApi";

import type { ApiAdminStory, AdminStoryWriteInput, StoryImageItem } from "@/types/stories";
import StoryImagesUpload, { type UploadedImage } from "@/components/editor/StoryImagesUpload";
import CoverImageUpload from "@/components/editor/CoverImageUpload";
import {
  Award,
  BookOpen,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  Plus,
  Quote,
  Save,
  Users,
  X,
} from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), { ssr: false });

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  PUBLISHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ARCHIVED: "bg-muted text-muted-foreground",
};

interface Props {
  story?: ApiAdminStory;
}

export default function StoryForm({ story }: Props) {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const isEdit = !!story;

  const [createStory, { isLoading: creating }] = useAdminCreateStoryMutation();
  const [updateStory, { isLoading: updating }] = useAdminUpdateStoryMutation();
  const [publishStory, { isLoading: publishing }] = useAdminPublishStoryMutation();

  // Fields
  const [name, setName] = useState(story?.name ?? "");
  const [department, setDepartment] = useState(story?.department ?? "");
  const [university, setUniversity] = useState(story?.university ?? "");
  const [joinedYear, setJoinedYear] = useState(story?.joinedYear?.toString() ?? "");
  const [achievement, setAchievement] = useState(story?.achievement ?? "");
  const [quote, setQuote] = useState(story?.quote ?? "");
  const [body, setBody] = useState(story?.body ?? "");
  const [highlights, setHighlights] = useState<string[]>(story?.highlights ?? []);
  const [newHighlight, setNewHighlight] = useState("");

  // Cover image
  const [coverImageId, setCoverImageId] = useState<string | null>(story?.coverImage?.id ?? null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(story?.coverImage?.url ?? null);

  // Gallery images
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>(
    (story?.images ?? []).map((img: StoryImageItem) => ({ id: img.image.id, url: img.image.url, caption: img.caption ?? "" }))
  );

  const [initialized, setInitialized] = useState(!isEdit);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isEdit && story) setInitialized(true);
  }, [isEdit, story]);

  const handleCoverUpload = (id: string, url: string) => {
    setCoverImageId(id);
    setCoverImageUrl(url);
  };

  const handleCoverRemove = () => { setCoverImageId(null); setCoverImageUrl(null); };

  const addHighlight = () => {
    const h = newHighlight.trim();
    if (!h || highlights.includes(h)) return;
    setHighlights((prev) => [...prev, h]);
    setNewHighlight("");
  };

  const removeHighlight = (i: number) => setHighlights((prev) => prev.filter((_, idx) => idx !== i));

  const buildPayload = (): AdminStoryWriteInput => ({
    name: name.trim(),
    department: department.trim() || null,
    university: university.trim() || null,
    joinedYear: joinedYear ? parseInt(joinedYear) : null,
    achievement: achievement.trim() || null,
    quote: quote.trim() || null,
    body,
    highlights,
    coverImageId: coverImageId ?? null,
    images: galleryImages.map((img) => ({ id: img.id, caption: img.caption || undefined })),
  });

  const isValid = name.trim().length > 0 && body.replace(/<[^>]+>/g, "").trim().length > 0;

  const handleSaveDraft = async () => {
    if (!isValid) { toast.error("Name and body are required"); return; }
    const payload = { ...buildPayload(), status: "DRAFT" as const };
    try {
      if (isEdit) {
        await updateStory({ id: story!.id, data: payload }).unwrap();
        toast.success("Story saved");
      } else {
        await createStory(payload).unwrap();
        toast.success("Draft saved");
        router.push("/admin/blog/real-life-stories");
      }
    } catch { /* baseApi toasts */ }
  };

  const handlePublish = async () => {
    if (!isValid) { toast.error("Name and body are required"); return; }
    try {
      if (isEdit) {
        await updateStory({ id: story!.id, data: buildPayload() }).unwrap();
        await publishStory(story!.id).unwrap();
        toast.success("Story published");
        router.push("/admin/blog/real-life-stories");
      } else {
        const created = await createStory({ ...buildPayload(), status: "DRAFT" as const }).unwrap();
        await publishStory(created.id).unwrap();
        toast.success("Story created and published");
        router.push("/admin/blog/real-life-stories");
      }
    } catch { /* baseApi toasts */ }
  };

  const saving = creating || updating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? "Edit Story" : "New Story"}
          </h1>
          {isEdit && story.status && (
            <span className={`mt-1 inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[story.status]}`}>
              {story.status.charAt(0) + story.status.slice(1).toLowerCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Preview ── */
        <StoryPreview
          name={name}
          department={department}
          university={university}
          achievement={achievement}
          quote={quote}
          bodyHtml={body}
          highlights={highlights}
          coverImageUrl={coverImageUrl}
          galleryImages={galleryImages}
          joinedYear={joinedYear}
        />
      ) : (
        /* ── Edit form ── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main content */}
          <div className="space-y-5">
            {/* Person info */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Person Info</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Rahman"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Department</label>
                  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">University</label>
                  <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. Dhaka University"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Joined year</label>
                  <input type="number" value={joinedYear} onChange={(e) => setJoinedYear(e.target.value)} placeholder="e.g. 2020" min={1990} max={2100}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Achievement</label>
                  <textarea value={achievement} onChange={(e) => setAchievement(e.target.value)} rows={2} placeholder="e.g. Got admitted to Oxford University on a full scholarship"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60 resize-none" />
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="rounded-xl border border-border bg-card p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Quote</label>
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={2} placeholder="An inspiring quote from this person…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60 resize-none" />
            </div>

            {/* Body */}
            <div className="rounded-xl border border-border bg-card p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                Full story <span className="text-red-500">*</span>
              </label>
              {initialized && (
                <RichTextEditor
                  initialContent={body}
                  onChange={setBody}
                  placeholder="Write the full story here…"
                />
              )}
            </div>

            {/* Highlights */}
            <div className="rounded-xl border border-border bg-card p-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Highlights</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {h}
                    <button type="button" onClick={() => removeHighlight(i)} className="hover:text-red-600 transition-colors"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                  placeholder="Add a highlight…"
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60" />
                <button type="button" onClick={addHighlight} disabled={!newHighlight.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Author read-only */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Author</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground font-medium truncate">
                  {story?.submitter?.fullName ?? user?.fullName ?? "—"}
                </span>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cover Image</p>
              <CoverImageUpload
                imageUrl={coverImageUrl}
                onUpload={handleCoverUpload}
                onRemove={handleCoverRemove}
              />
            </div>

            {/* Gallery */}
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Gallery Images <span className="font-normal text-muted-foreground/60">({galleryImages.length}/10)</span>
              </p>
              <StoryImagesUpload images={galleryImages} onChange={setGalleryImages} maxImages={10} />
            </div>

            {/* Validation hint */}
            {!isValid && (name || body) && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Required fields missing:</p>
                {!name.trim() && <p className="text-[11px] text-amber-600">· Name</p>}

                {!body.replace(/<[^>]+>/g, "").trim() && <p className="text-[11px] text-amber-600">· Full story</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Preview — matches the public ApiStoryView layout ─────────────────────────
function StoryPreview({
  name, department, university, achievement, quote, bodyHtml, highlights, coverImageUrl, galleryImages, joinedYear
}: {
  name: string; department: string; university: string; achievement: string;
  quote: string; bodyHtml: string; highlights: string[];
  coverImageUrl: string | null; galleryImages: UploadedImage[]; joinedYear: string;
}) {
  return (
    <article className="relative -mx-6 sm:-mx-0">
      {/* ── Hero card ── */}
      <section className="pt-4 sm:pt-6">
        <div className="mx-auto max-w-5xl">
          {/* "Real Life Story" badge */}
          <div className="mb-5 sm:mb-7">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              Real Life Story · Preview
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-50/70 via-card to-card dark:from-emerald-950/30 dark:via-card dark:to-card shadow-xl shadow-emerald-500/5">
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
            <Quote className="absolute top-6 sm:top-8 left-6 sm:left-10 h-16 w-16 sm:h-20 sm:w-20 text-emerald-200/70 dark:text-emerald-900/60 pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-12">
              {/* Left: quote + info */}
              <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col justify-center">
                {quote && (
                  <blockquote className="text-xl sm:text-2xl lg:text-3xl text-foreground font-semibold italic leading-snug tracking-tight pl-2 sm:pl-4">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                )}
                <div className="mt-6 sm:mt-8 h-px bg-gradient-to-r from-emerald-500/40 via-border to-transparent" />
                <div className="mt-5 sm:mt-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                    {name || <span className="text-muted-foreground italic">Untitled story</span>}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {department && (
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                        {department}
                      </span>
                    )}
                    {university && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        {university}
                      </span>
                    )}
                  </div>
                  {achievement && (
                    <div className="mt-4 inline-flex items-start gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl max-w-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Award className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{achievement}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: cover image */}
              <div className="lg:col-span-4 order-1 lg:order-2 flex items-center justify-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
                  <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 rounded-2xl bg-emerald-500/20 dark:bg-emerald-400/15" />
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-lg shadow-emerald-500/10">
                    {coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverImageUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 flex items-center justify-center">
                        <Users className="h-16 w-16 text-emerald-300 dark:text-emerald-700" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full story ── */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">The full story</p>
            {joinedYear && (
              <p className="text-[11px] text-muted-foreground">Joined Student Square in {joinedYear}</p>
            )}
          </div>

          {bodyHtml ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:first-letter:text-5xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:mt-1 [&>p:first-child]:first-letter:text-emerald-600 [&>p:first-child]:first-letter:leading-none [&>p]:text-base [&>p]:leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p className="text-muted-foreground italic text-sm">No body content yet…</p>
          )}

          {highlights.length > 0 && (
            <div className="mt-10 p-6 sm:p-7 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-900/20">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <Award className="h-3.5 w-3.5" />
                Highlights from {name.split(" ")[0] || "their"}&apos;s journey
              </p>
              <ul className="space-y-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">{h}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-4">Gallery</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img) => (
                  <figure key={img.id} className="space-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption ?? ""} className="w-full aspect-video object-cover rounded-xl" />
                    {img.caption && (
                      <figcaption className="text-[11px] text-muted-foreground text-center">{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
