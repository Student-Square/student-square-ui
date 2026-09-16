"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, FileText, Loader2, Search } from "lucide-react";
import { useGetReportFiltersQuery, useGetReportsQuery } from "@/redux/features/report/reportApi";
import { REPORT_SECTIONS } from "@/lib/reports";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ApiReportListItem, ReportListFilters } from "@/types/reports";

/** Every published report fits in one page; the sections are grouped client-side. */
const LIST_LIMIT = 100;

type Option = { value: string; label: string };

export default function ReportsLibrary() {
  const { t, tr, num } = useLanguage();
  const [filters, setFilters] = useState<ReportListFilters>({});
  const [search, setSearch] = useState("");
  const { data: options } = useGetReportFiltersQuery();
  const { data, isLoading, isFetching, isError, refetch } = useGetReportsQuery({
    ...filters,
    limit: LIST_LIMIT,
  });

  const reports = useMemo(() => data?.data ?? [], [data]);
  const filtering = Object.values(filters).some(Boolean);

  const sections = useMemo(
    () =>
      REPORT_SECTIONS.map((section) => ({
        ...section,
        reports: reports.filter((r) => r.category === section.category),
      })).filter((section) => section.reports.length > 0),
    [reports]
  );

  const setFilter = (key: keyof ReportListFilters, value: string) =>
    setFilters((current) => ({ ...current, [key]: value || undefined }));

  const resetFilters = () => {
    setFilters({});
    setSearch("");
  };

  const toOptions = (values: Array<string | number> | undefined): Option[] =>
    (values ?? []).map((v) => ({
      value: String(v),
      label: typeof v === "number" ? num(v, false) : tr(v),
    }));

  return (
    <div className="space-y-12">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setFilter("searchTerm", search.trim());
        }}
        className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetFilters}
            disabled={!filtering}
            className="text-sm font-medium text-emerald-700 hover:underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline dark:text-emerald-400"
          >
            {t("reports.viewAll")}
          </button>
          <div className="flex w-full sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("reports.search")}
              aria-label={t("reports.search")}
              maxLength={200}
              className="h-10 w-full min-w-0 rounded-l-lg border border-r-0 border-border bg-background px-3 text-sm focus:border-emerald-500 focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              aria-label={t("search")}
              className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[auto_repeat(5,minmax(0,1fr))] lg:items-center">
          <span className="text-sm font-semibold text-foreground">{t("reports.filterBy")}</span>
          <FilterSelect
            label={t("reports.focusAreas")}
            value={filters.topic}
            options={toOptions(options?.topics)}
            onChange={(v) => setFilter("topic", v)}
          />
          <FilterSelect
            label={t("reports.documentTypes")}
            value={filters.category}
            options={(options?.categories ?? []).map((c) => ({ value: c, label: t(`reports.cat.${c}`) }))}
            onChange={(v) => setFilter("category", v)}
          />
          <FilterSelect
            label={t("reports.regions")}
            value={filters.region}
            options={toOptions(options?.regions)}
            onChange={(v) => setFilter("region", v)}
          />
          <FilterSelect
            label={t("reports.countries")}
            value={filters.country}
            options={toOptions(options?.countries)}
            onChange={(v) => setFilter("country", v)}
          />
          <FilterSelect
            label={t("reports.years")}
            value={filters.year}
            options={toOptions(options?.years)}
            onChange={(v) => setFilter("year", v)}
          />
        </div>
      </form>

      <div aria-live="polite" aria-busy={isFetching}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> {t("reports.loading")}
          </div>
        ) : isError ? (
          <EmptyState message={t("reports.loadFailed")}>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {t("common.tryAgain")}
            </button>
          </EmptyState>
        ) : reports.length === 0 ? (
          filtering ? (
            <EmptyState message={t("reports.noMatch")}>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                {t("reports.viewAll")}
              </button>
            </EmptyState>
          ) : (
            <EmptyState message={t("reports.comingSoon")} />
          )
        ) : filtering ? (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
              {t(reports.length === 1 ? "reports.foundOne" : "reports.foundMany", { count: reports.length })}
            </h2>
            <ReportGrid reports={reports} />
          </section>
        ) : (
          <div className="space-y-14">
            {sections.map((section) => (
              <section key={section.category} aria-labelledby={`section-${section.category}`}>
                <h2
                  id={`section-${section.category}`}
                  className="mb-6 text-2xl font-bold text-foreground sm:text-3xl"
                >
                  {t(`reports.cat.${section.category}`)}
                </h2>
                <ReportGrid reports={section.reports} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReportGrid({ reports }: { reports: ApiReportListItem[] }) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}

function ReportCard({ report }: { report: ApiReportListItem }) {
  const { t, pick, tr, num } = useLanguage();
  const title = pick(report.title, report.titleBn);
  return (
    <Link href={`/about/reports/${report.slug}`} className="group flex h-full flex-col">
      {/* Fixed-ratio box: the cover never decides how tall the card is. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition-shadow group-hover:shadow-md">
        {report.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.coverImage.url}
            alt={report.coverImage.alt ?? title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center dark:from-emerald-950/60 dark:to-emerald-900/40">
            <FileText className="h-10 w-10 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {t(`reports.cat.${report.category}`)} · {num(report.year, false)}
            </span>
          </div>
        )}
      </div>
      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {num(report.year, false)}
        {report.country ? ` · ${tr(report.country)}` : ""}
      </p>
      <span className="mt-auto inline-flex items-center gap-0.5 pt-2 text-sm font-semibold uppercase text-emerald-700 group-hover:underline dark:text-emerald-400">
        {t("reports.read")} <ChevronRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

function EmptyState({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <FileText className="mx-auto h-8 w-8 text-muted-foreground/40" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
