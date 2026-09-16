/** Types for the /reports API surface. */

export type ReportCategory =
  | "ANNUAL_REPORT"
  | "ANNUAL_HIGHLIGHTS"
  | "PROGRAM_REPORT"
  | "FINANCIAL_STATEMENT";

type ReportCover = { id: string; url: string; alt: string | null } | null;

export type ApiReportListItem = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  category: ReportCategory;
  year: number;
  language: string;
  country: string | null;
  region: string | null;
  publisher: string | null;
  publishedAt: string | null;
  coverImage: ReportCover;
};

export type ApiReportDetail = ApiReportListItem & {
  summary: string | null;
  summaryBn: string | null;
  authors: string[];
  topics: string[];
  keywords: string[];
  rights: string | null;
  fileSizeBytes: number;
};

export type ApiAdminReport = ApiReportDetail & {
  published: boolean;
  downloadCount: number;
  coverImageId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; fullName: string } | null;
};

export type ReportFilterOptions = {
  categories: ReportCategory[];
  years: number[];
  countries: string[];
  regions: string[];
  topics: string[];
};

export type ReportListFilters = {
  category?: ReportCategory;
  year?: string;
  country?: string;
  region?: string;
  topic?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
};

export type AdminReportWriteInput = {
  title: string;
  category: ReportCategory;
  year: number;
  language?: string;
  publisher?: string;
  country?: string;
  region?: string;
  summary?: string;
  rights?: string;
  authors?: string[];
  topics?: string[];
  keywords?: string[];
  coverImageId?: string;
  published?: boolean;
};

/** PATCH body — any field may be omitted, and optional text may be cleared with null. */
export type AdminReportPatch = {
  [K in keyof AdminReportWriteInput]?: AdminReportWriteInput[K] | null;
};
