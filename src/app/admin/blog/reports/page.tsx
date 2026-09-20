"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useAdminCreateReportMutation,
  useAdminDeleteReportMutation,
  useAdminListReportsQuery,
  useAdminReplaceReportFileMutation,
  useAdminUpdateReportMutation,
  useLazyAdminReportFileLinkQuery,
} from "@/redux/features/report/adminReportApi";
import { usePdfPreview } from "@/components/common/PdfPreview";
import CoverImageUpload from "@/components/editor/CoverImageUpload";
import Pagination from "@/components/common/Pagination";
import { CARD_PAGE_SIZE } from "@/lib/pagination";
import {
  REPORT_MAX_FILE_BYTES,
  REPORT_SECTIONS,
  formatBytes,
  reportCategoryLabel,
} from "@/lib/reports";
import type { ApiAdminReport, ReportCategory } from "@/types/reports";
import {
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

const PAGE_SIZE = CARD_PAGE_SIZE;

type FormState = {
  title: string;
  category: ReportCategory;
  year: string;
  language: string;
  publisher: string;
  country: string;
  region: string;
  summary: string;
  authors: string;
  topics: string;
  keywords: string;
  rights: string;
  coverImageId: string;
  coverImageUrl: string;
};

const emptyForm = (): FormState => ({
  title: "",
  category: "ANNUAL_REPORT",
  year: String(new Date().getFullYear()),
  language: "English",
  publisher: "",
  country: "",
  region: "",
  summary: "",
  authors: "",
  topics: "",
  keywords: "",
  rights: "",
  coverImageId: "",
  coverImageUrl: "",
});

const formFrom = (r: ApiAdminReport): FormState => ({
  title: r.title,
  category: r.category,
  year: String(r.year),
  language: r.language,
  publisher: r.publisher ?? "",
  country: r.country ?? "",
  region: r.region ?? "",
  summary: r.summary ?? "",
  authors: r.authors.join("\n"),
  topics: r.topics.join("\n"),
  keywords: r.keywords.join("\n"),
  rights: r.rights ?? "",
  coverImageId: r.coverImageId ?? "",
  coverImageUrl: r.coverImage?.url ?? "",
});

const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export default function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<ReportCategory | "">("");
  const { data, isLoading } = useAdminListReportsQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    category: category || undefined,
  });
  const reports = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE));

  const [createReport, { isLoading: creating }] = useAdminCreateReportMutation();
  const [updateReport, { isLoading: updating }] = useAdminUpdateReportMutation();
  const [replaceFile, { isLoading: replacing }] = useAdminReplaceReportFileMutation();
  const [deleteReport] = useAdminDeleteReportMutation();
  const [fetchFileLink] = useLazyAdminReportFileLinkQuery();
  const { openPdfPreview, pdfPreview } = usePdfPreview();

  /**
   * The uploaded PDF, in a frame.
   *
   * The signed link goes to the frame directly rather than being fetched into
   * a blob: it is already authorised, and fetching it would need the bucket to
   * allow this origin in CORS, which framing does not.
   */
  const previewReport = async (report: ApiAdminReport) => {
    try {
      const { url } = await fetchFileLink(report.id).unwrap();
      openPdfPreview({
        url,
        fileName: `${report.slug}.pdf`,
        title: report.title,
        subtitle: `${reportCategoryLabel(report.category)} · ${report.year}${
          report.published ? "" : " · draft"
        }`,
      });
    } catch {
      toast.error("Could not open the report");
    }
  };
  const saving = creating || updating || replacing;

  // null = form closed, "new" = creating, a report = editing that report.
  const [editing, setEditing] = useState<ApiAdminReport | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  const openNew = () => {
    setForm(emptyForm());
    setFile(null);
    setEditing("new");
  };

  const openEdit = (report: ApiAdminReport) => {
    setForm(formFrom(report));
    setFile(null);
    setEditing(report);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setEditing(null);
    setFile(null);
  };

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: e.target.value }));

  const pickFile = (picked: File | null) => {
    if (picked && picked.size > REPORT_MAX_FILE_BYTES) {
      toast.error(`That PDF is ${formatBytes(picked.size)} — the limit is ${formatBytes(REPORT_MAX_FILE_BYTES)}.`);
      return;
    }
    setFile(picked);
  };

  const handleSave = async () => {
    const year = Number(form.year);
    if (form.title.trim().length < 2 || !Number.isInteger(year)) {
      toast.error("Title and year are required.");
      return;
    }
    if (editing === "new" && !file) {
      toast.error("Choose the report's PDF file.");
      return;
    }

    const fields = {
      title: form.title.trim(),
      category: form.category,
      year,
      language: form.language.trim() || "English",
      publisher: form.publisher.trim(),
      country: form.country.trim(),
      region: form.region.trim(),
      summary: form.summary.trim(),
      rights: form.rights.trim(),
      authors: lines(form.authors),
      topics: lines(form.topics),
      keywords: lines(form.keywords),
    };

    try {
      if (editing === "new" && file) {
        await createReport({ ...fields, coverImageId: form.coverImageId || undefined, file }).unwrap();
        toast.success("Report saved as a draft");
      } else if (editing && editing !== "new") {
        await updateReport({
          id: editing.id,
          data: { ...fields, coverImageId: form.coverImageId || null },
        }).unwrap();
        if (file) await replaceFile({ id: editing.id, file }).unwrap();
        toast.success("Report updated");
      }
      closeForm();
    } catch {
      /* baseApi toasts */
    }
  };

  const handleTogglePublish = async (report: ApiAdminReport) => {
    try {
      await updateReport({ id: report.id, data: { published: !report.published } }).unwrap();
      toast.success(report.published ? "Unpublished" : "Published");
    } catch {
      /* baseApi toasts */
    }
  };

  const handleDelete = async (report: ApiAdminReport) => {
    if (!confirm(`Delete "${report.title}" and its PDF? This cannot be undone.`)) return;
    try {
      await deleteReport(report.id).unwrap();
      if (editing !== "new" && editing?.id === report.id) closeForm();
      toast.success("Deleted");
    } catch {
      /* baseApi toasts */
    }
  };

  return (
    <div className="space-y-6">
      {pdfPreview}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Reports &amp; Financials
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and publish the PDFs shown on{" "}
            <Link href="/about/reports" className="text-emerald-600 hover:underline" target="_blank">
              /about/reports
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> New report
        </button>
      </div>

      {editing && (
        <div className="max-w-3xl space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">
            {editing === "new" ? "New report" : `Edit “${editing.title}”`}
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title *" className="sm:col-span-2">
              <input value={form.title} onChange={set("title")} maxLength={200} placeholder="Annual Report 2024" className="form-input" />
            </Field>
            <Field label="Section *">
              <select value={form.category} onChange={set("category")} className="form-input">
                {REPORT_SECTIONS.map((s) => (
                  <option key={s.category} value={s.category}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Publication year *">
              <input type="number" min={1990} max={new Date().getFullYear() + 1} value={form.year} onChange={set("year")} className="form-input" />
            </Field>
            <Field label="Language">
              <input value={form.language} onChange={set("language")} maxLength={40} className="form-input" />
            </Field>
            <Field label="Publisher">
              <input value={form.publisher} onChange={set("publisher")} maxLength={200} placeholder="Student Square" className="form-input" />
            </Field>
            <Field label="Country">
              <input value={form.country} onChange={set("country")} maxLength={80} placeholder="Bangladesh" className="form-input" />
            </Field>
            <Field label="Region">
              <input value={form.region} onChange={set("region")} maxLength={80} placeholder="Southern Asia" className="form-input" />
            </Field>
          </div>

          <Field label="Abstract / summary">
            <textarea value={form.summary} onChange={set("summary")} rows={5} maxLength={10000} className="form-input" />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Authors — one per line">
              <textarea value={form.authors} onChange={set("authors")} rows={4} placeholder={"Surname, Given\nSurname, Given"} className="form-input" />
            </Field>
            <Field label="Focus areas — one per line">
              <textarea value={form.topics} onChange={set("topics")} rows={4} placeholder={"Child Protection\nBasic Education"} className="form-input" />
            </Field>
            <Field label="Keywords — one per line">
              <textarea value={form.keywords} onChange={set("keywords")} rows={4} className="form-input" />
            </Field>
          </div>

          <Field label="Rights">
            <input value={form.rights} onChange={set("rights")} maxLength={200} placeholder="© Author/Publisher" className="form-input" />
          </Field>

          <CoverImageUpload
            imageUrl={form.coverImageUrl || null}
            onUpload={(id, url) => setForm((f) => ({ ...f, coverImageId: id, coverImageUrl: url }))}
            onRemove={() => setForm((f) => ({ ...f, coverImageId: "", coverImageUrl: "" }))}
          />

          <Field label={editing === "new" ? "PDF file *" : "Replace PDF (optional)"}>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm transition-colors hover:border-emerald-500/60">
              <Upload className="h-4 w-4 text-muted-foreground" />
              {file
                ? `${file.name} · ${formatBytes(file.size)}`
                : editing === "new"
                  ? `Choose a PDF (up to ${formatBytes(REPORT_MAX_FILE_BYTES)})`
                  : `Current file: ${formatBytes(editing.fileSizeBytes)} — choose a PDF to replace it`}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing === "new" ? "Upload & save as draft" : "Save changes"}
            </button>
            <button type="button" onClick={closeForm} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearchTerm(searchInput.trim());
        }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search title or publisher"
            className="form-input !pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value as ReportCategory | "");
          }}
          className="form-input !w-auto"
          aria-label="Filter by section"
        >
          <option value="">All sections</option>
          {REPORT_SECTIONS.map((s) => (
            <option key={s.category} value={s.category}>
              {s.label}
            </option>
          ))}
        </select>
      </form>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            {searchTerm || category ? "No reports match." : "No reports yet — upload the first one."}
          </p>
        </div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[3/4] w-full bg-muted">
                {report.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={report.coverImage.url} alt={report.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-start gap-2">
                  <p className="line-clamp-2 flex-1 text-sm font-semibold text-foreground">{report.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                      report.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {report.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {reportCategoryLabel(report.category)} · {report.year} · {formatBytes(report.fileSizeBytes)}
                </p>
                <div className="mt-auto flex items-center gap-1.5 pt-3">
                  <IconButton title="Preview PDF" onClick={() => void previewReport(report)}>
                    <FileText className="h-4 w-4" />
                  </IconButton>
                  <IconButton title="Edit" onClick={() => openEdit(report)}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton title={report.published ? "Unpublish" : "Publish"} onClick={() => handleTogglePublish(report)}>
                    {report.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </IconButton>
                  {report.published && (
                    <Link
                      href={`/about/reports/${report.slug}`}
                      target="_blank"
                      title="View on site"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-emerald-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <IconButton title="Delete" danger onClick={() => handleDelete(report)}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground" title="Opens and downloads">
                    <Download className="h-3 w-3" /> {report.downloadCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />

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

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  title,
  danger,
  onClick,
  children,
}: {
  title: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors ${
        danger ? "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" : "hover:bg-muted hover:text-emerald-600"
      }`}
    >
      {children}
    </button>
  );
}
