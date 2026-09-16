"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Loader2,
  Mail,
} from "lucide-react";
import { useGetReportQuery } from "@/redux/features/report/reportApi";
import { NAVBAR_PAD_TOP } from "@/components/common/Header/navbarHeight";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { formatBytes, reportFileUrl } from "@/lib/reports";
import type { ApiReportDetail } from "@/types/reports";

/** Abstracts longer than this start collapsed behind "Read full abstract". */
const ABSTRACT_PREVIEW_CHARS = 600;

export default function ReportDetail({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const { data: report, isLoading, isError, error } = useGetReportQuery(slug);
  const notFound = (error as { status?: unknown } | undefined)?.status === 404;

  return (
    <div className={NAVBAR_PAD_TOP}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/about/reports"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("reports.all")}
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> {t("reports.loadingOne")}
          </div>
        ) : isError || !report ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              {notFound ? t("reports.unavailable") : t("reports.loadOneFailed")}
            </p>
          </div>
        ) : (
          <ReportBody report={report} />
        )}
      </div>
    </div>
  );
}

function ReportBody({ report }: { report: ApiReportDetail }) {
  const { t, pick, tr, num } = useLanguage();
  const sectionLabel = t(`reports.cat.${report.category}`);
  const title = pick(report.title, report.titleBn);
  const year = num(report.year, false);
  const language = tr(report.language);

  return (
    <article className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-14">
      {/* Cover + share */}
      <aside className="mx-auto w-full max-w-[15rem] md:mx-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-muted shadow-md">
          {report.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={report.coverImage.url}
              alt={report.coverImage.alt ?? title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center dark:from-emerald-950/60 dark:to-emerald-900/40">
              <FileText className="h-10 w-10 text-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {sectionLabel} · {year}
              </span>
            </div>
          )}
        </div>
        <ShareLinks title={title} />
      </aside>

      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{sectionLabel}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {title}
        </h1>

        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Meta icon={<CalendarDays className="h-4 w-4" />} label={t("reports.publicationYear")} value={year} />
          <Meta icon={<Globe className="h-4 w-4" />} label={t("reports.language")} value={language} />
          <Meta icon={<FileText className="h-4 w-4" />} label={t("reports.format")} value={`PDF (${formatBytes(report.fileSizeBytes)})`} />
          {report.publisher && (
            <Meta icon={<Building2 className="h-4 w-4" />} label={t("reports.publisher")} value={tr(report.publisher)} />
          )}
        </dl>

        <a
          href={reportFileUrl(report.id, "attachment")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" /> {t("reports.viewDownload")}
        </a>

        {report.summary && <Abstract text={pick(report.summary, report.summaryBn)} />}

        <div className="mt-8 divide-y divide-border border-y border-border">
          {report.authors.length > 0 && (
            <Disclosure title={t("reports.authors")}>
              <ul className="space-y-1 text-sm text-foreground">
                {report.authors.map((author) => (
                  <li key={author}>{tr(author)}</li>
                ))}
              </ul>
            </Disclosure>
          )}

          <Disclosure title={t("reports.viewDownload")} defaultOpen>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <FileText className="h-5 w-5 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">
                  {language} · PDF · {formatBytes(report.fileSizeBytes)}
                </p>
              </div>
              <a
                href={reportFileUrl(report.id, "inline")}
                target="_blank"
                rel="noopener noreferrer"
                title={t("reports.openNewTab")}
                aria-label={t("reports.openNamedNewTab", { title })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={reportFileUrl(report.id, "attachment")}
                title={t("reports.download")}
                aria-label={t("reports.downloadNamed", { title })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </Disclosure>
        </div>

        <DocumentInformation report={report} sectionLabel={sectionLabel} />
      </div>
    </article>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className="mt-0.5 shrink-0 text-emerald-600">{icon}</span>
      <div className="min-w-0">
        <dt className="inline text-muted-foreground">{label}: </dt>
        <dd className="inline break-words text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function Abstract({ text }: { text: string }) {
  const { t } = useLanguage();
  const long = text.length > ABSTRACT_PREVIEW_CHARS;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-8">
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
        {long && !expanded ? `${text.slice(0, ABSTRACT_PREVIEW_CHARS).trimEnd()}…` : text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          {expanded ? t("reports.showLess") : t("reports.readAbstract")}
        </button>
      )}
    </div>
  );
}

function Disclosure({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group py-2" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 text-emerald-600 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-3 pt-1">{children}</div>
    </details>
  );
}

function DocumentInformation({ report, sectionLabel }: { report: ApiReportDetail; sectionLabel: string }) {
  const { t, tr, digits } = useLanguage();
  // Keyed by dictionary key, so the row keys stay stable across languages.
  const rows: Array<[string, React.ReactNode]> = [
    ["reports.publisher", report.publisher ? tr(report.publisher) : null],
    ["reports.authors", report.authors.length > 0 ? report.authors.map((author) => tr(author)).join("; ") : null],
    ["reports.format", "PDF"],
    ["reports.contentType", sectionLabel],
    ["reports.country", report.country ? tr(report.country) : null],
    ["reports.region", report.region ? tr(report.region) : null],
    ["reports.topics", report.topics.length > 0 ? report.topics.map((topic) => tr(topic)).join(", ") : null],
    ["reports.rights", report.rights ? tr(report.rights) : null],
    [
      "reports.keywords",
      report.keywords.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {report.keywords.map((keyword) => (
            <span key={keyword} className="rounded border border-border bg-muted px-2 py-0.5 text-xs">
              {digits(tr(keyword))}
            </span>
          ))}
        </span>
      ) : null,
    ],
  ];

  return (
    <section className="mt-10" aria-labelledby="document-information">
      <h2 id="document-information" className="mb-4 text-lg font-semibold text-foreground">
        {t("reports.docInfo")}
      </h2>
      <dl className="divide-y divide-border rounded-lg border border-border text-sm">
        {rows
          .filter(([, value]) => value)
          .map(([key, value]) => (
            <div key={key} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted-foreground">{t(key)}</dt>
              <dd className="break-words text-foreground">{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}

function ShareLinks({ title }: { title: string }) {
  const { t } = useLanguage();
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("common.linkCopied"));
    } catch {
      toast.error(t("common.copyFailed"));
    }
  };

  const mailto = () =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 md:justify-start">
      <button
        type="button"
        onClick={copyLink}
        title={t("common.copyLink")}
        aria-label={t("reports.copyLinkReport")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
      >
        <Link2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          window.location.href = mailto();
        }}
        title={t("reports.shareEmail")}
        aria-label={t("reports.shareEmailReport")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
      >
        <Mail className="h-4 w-4" />
      </button>
    </div>
  );
}
