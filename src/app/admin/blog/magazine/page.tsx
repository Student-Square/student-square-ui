"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminListMagazinesQuery,
  useAdminCreateMagazineMutation,
  useAdminUpdateMagazineMutation,
  useAdminDeleteMagazineMutation,
} from "@/redux/features/magazine/adminMagazineApi";
import CoverImageUpload from "@/components/editor/CoverImageUpload";
import {
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function AdminMagazinePage() {
  const { data: issues, isLoading } = useAdminListMagazinesQuery();
  const [createMagazine, { isLoading: creating }] = useAdminCreateMagazineMutation();
  const [updateMagazine] = useAdminUpdateMagazineMutation();
  const [deleteMagazine] = useAdminDeleteMagazineMutation();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setIssueNumber("");
    setDescription("");
    setCoverImageId("");
    setCoverImageUrl("");
    setFile(null);
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!title.trim() || !file) {
      toast.error("Title and a PDF file are required.");
      return;
    }
    try {
      await createMagazine({
        title: title.trim(),
        description: description.trim() || undefined,
        issueNumber: issueNumber ? Number(issueNumber) : undefined,
        coverImageId: coverImageId || undefined,
        file,
      }).unwrap();
      toast.success("Magazine issue created");
      resetForm();
    } catch { /* baseApi toasts */ }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      await updateMagazine({ id, data: { published: !published } }).unwrap();
      toast.success(!published ? "Published" : "Unpublished");
    } catch { /* baseApi toasts */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this magazine issue? This cannot be undone.")) return;
    try {
      await deleteMagazine(id).unwrap();
      toast.success("Deleted");
    } catch { /* baseApi toasts */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Magazine</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload and publish PDF issues.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New issue
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title *">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Student Square Magazine — Issue 3"
                className="form-input"
              />
            </Field>
            <Field label="Issue number">
              <input
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="3"
                className="form-input"
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-input"
            />
          </Field>
          <CoverImageUpload
            imageUrl={coverImageUrl || null}
            onUpload={(id, url) => { setCoverImageId(id); setCoverImageUrl(url); }}
            onRemove={() => { setCoverImageId(""); setCoverImageUrl(""); }}
          />
          <Field label="PDF file *">
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-emerald-500/60 transition-colors text-sm">
              <Upload className="h-4 w-4 text-muted-foreground" />
              {file ? file.name : "Choose a PDF file"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled={creating}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Upload & save as draft
            </button>
            <button type="button" onClick={resetForm} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !issues?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No magazine issues yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
                {issue.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={issue.coverImage.url} alt={issue.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-foreground truncate flex-1">{issue.title}</p>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                      issue.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {issue.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {issue.issueNumber ? `Issue ${issue.issueNumber} · ` : ""}
                  {formatBytes(issue.fileSizeBytes)} · {issue.downloadCount} download{issue.downloadCount === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(issue.id, issue.published)}
                    title={issue.published ? "Unpublish" : "Publish"}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    {issue.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(issue.id)}
                    title="Delete"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Download className="h-3 w-3" /> {issue.downloadCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
