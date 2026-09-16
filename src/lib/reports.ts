import type { ReportCategory } from "@/types/reports";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

/** The sections of /about/reports, in the order the page shows them. */
export const REPORT_SECTIONS: Array<{ category: ReportCategory; label: string }> = [
  { category: "ANNUAL_REPORT", label: "Annual Reports" },
  { category: "ANNUAL_HIGHLIGHTS", label: "Annual Highlights" },
  { category: "PROGRAM_REPORT", label: "SS Program Reports" },
  { category: "FINANCIAL_STATEMENT", label: "Financial Statements" },
];

export const reportCategoryLabel = (category: ReportCategory) =>
  REPORT_SECTIONS.find((s) => s.category === category)?.label ?? category;

/** Largest PDF the API accepts for a report (report routes in fileUploader.ts). */
export const REPORT_MAX_FILE_BYTES = 50 * 1024 * 1024;

export function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Link to a report's PDF. The API counts the open and redirects to a
 * short-lived signed S3 link, so this is safe to render as a plain <a href>:
 * the browser follows it as an ordinary navigation, which no popup blocker
 * interferes with. "attachment" saves the file; "inline" opens it.
 */
export const reportFileUrl = (id: string, disposition: "inline" | "attachment") =>
  `${API_BASE_URL}/reports/${encodeURIComponent(id)}/file?disposition=${disposition}`;
