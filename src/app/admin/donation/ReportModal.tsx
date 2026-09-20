"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { useGetDonationReportQuery } from "@/redux/features/donations/adminDonationsApi";
import { useGetAdminCampaignsQuery } from "@/redux/features/campaigns/adminCampaignsApi";
import { formatMoney } from "@/lib/money";
import type {
  DonationStatus,
  ReportGranularity,
  ReportSection,
} from "@/types/donations";

/**
 * Generate a donation report: choose, look, save.
 *
 * It lives here rather than on a page of its own because a report is something
 * you *do* from the donations screen, not somewhere you go — and the preview is
 * the report, so a separate on-screen rendering of the same figures would be a
 * second thing to keep true.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const FIELD =
  "text-sm rounded-lg border border-border bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30";

const STATUSES: DonationStatus[] = [
  "PAID",
  "PENDING",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_TONE: Record<DonationStatus, string> = {
  PAID: "bg-emerald-500",
  PENDING: "bg-amber-500",
  FAILED: "bg-red-500",
  CANCELLED: "bg-zinc-400",
  REFUNDED: "bg-zinc-400",
};

/** What the exported document can carry. */
const SECTIONS: { value: ReportSection; label: string }[] = [
  { value: "summary", label: "Summary totals" },
  { value: "period", label: "Period breakdown" },
  { value: "project", label: "Project breakdown" },
  { value: "status", label: "Status breakdown" },
];

/** Stripping "ly" turned "daily" into "dai"; the words are spelled out instead. */
const PERIOD_WORD: Record<ReportGranularity, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

/**
 * The local calendar date, not the UTC one — `toISOString()` on a Date built
 * from local parts shifts the day backwards east of UTC, so in Dhaka (+6) the
 * 1st of January came out as 31 December.
 */
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const PRESETS: {
  label: string;
  range: () => [string, string];
  granularity: ReportGranularity;
}[] = [
  {
    label: "This month",
    granularity: "daily",
    range: () => {
      const now = new Date();
      return [iso(new Date(now.getFullYear(), now.getMonth(), 1)), iso(now)];
    },
  },
  {
    label: "This year",
    granularity: "monthly",
    range: () => {
      const now = new Date();
      return [iso(new Date(now.getFullYear(), 0, 1)), iso(now)];
    },
  },
  {
    label: "Last 12 months",
    granularity: "monthly",
    range: () => {
      const now = new Date();
      const from = new Date(now);
      from.setMonth(from.getMonth() - 11);
      from.setDate(1);
      return [iso(from), iso(now)];
    },
  },
  {
    label: "All years",
    granularity: "yearly",
    range: () => {
      const now = new Date();
      return [iso(new Date(now.getFullYear() - 5, 0, 1)), iso(now)];
    },
  },
];

type Format = "csv" | "xlsx" | "pdf";

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const thisYear = PRESETS[1].range();
  const [from, setFrom] = useState(thisYear[0]);
  const [to, setTo] = useState(thisYear[1]);
  const [granularity, setGranularity] = useState<ReportGranularity>("monthly");
  const [campaignId, setCampaignId] = useState("");
  const [statuses, setStatuses] = useState<DonationStatus[]>(["PAID"]);
  const [sections, setSections] = useState<ReportSection[]>(
    SECTIONS.map((s) => s.value)
  );
  const [busy, setBusy] = useState<string | null>(null);
  /** Holding the blob means previewing then saving is one generation, not two. */
  const [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null);

  const { data: campaignsData } = useGetAdminCampaignsQuery({ status: "" });
  const campaigns = campaignsData?.data ?? [];

  const query = {
    from,
    to,
    granularity,
    ...(campaignId ? { campaignId } : {}),
    // Empty means "every status" to the API, which is what no ticks should mean.
    ...(statuses.length ? { status: statuses.join(",") } : {}),
  };

  // Drives the "what you are about to export" line, so the choices can be
  // sanity-checked before anything is generated.
  const { data: scope, isFetching: scoping } = useGetDonationReportQuery(query);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  // The held blob is the only thing that must be released by hand.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview]
  );

  const fileName = (format: Format) => `donation-report-${from}_${to}.${format}`;

  const fetchExport = async (format: Format) => {
    const params = new URLSearchParams({
      ...query,
      sections: sections.join(","),
    } as Record<string, string>);
    const res = await fetch(
      `${API_BASE}/admin/donations/report/export.${format}?${params}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  };

  const saveBlob = (blob: Blob, format: Format) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName(format);
    a.click();
    URL.revokeObjectURL(url);
  };

  const generate = async () => {
    setBusy("preview");
    try {
      const blob = await fetchExport("pdf");
      setPreview({ url: URL.createObjectURL(blob), blob });
    } catch {
      toast.error("Could not build the report");
    } finally {
      setBusy(null);
    }
  };

  const download = async (format: Format) => {
    setBusy(format);
    try {
      // The PDF is already in hand from the preview; the others are not.
      if (format === "pdf" && preview) saveBlob(preview.blob, "pdf");
      else saveBlob(await fetchExport(format), format);
    } catch {
      toast.error("Export failed");
    } finally {
      setBusy(null);
    }
  };

  const backToOptions = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const toggle = <T,>(list: T[], value: T, order: T[]) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : // Kept in catalogue order so the document reads the same every time.
        order.filter((v) => v === value || list.includes(v));

  const reset = () => {
    const [f, t] = PRESETS[1].range();
    setFrom(f);
    setTo(t);
    setGranularity("monthly");
    setCampaignId("");
    setStatuses(["PAID"]);
    setSections(SECTIONS.map((s) => s.value));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generate donation report"
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl ${
          preview ? "h-full max-h-[92vh] max-w-4xl" : "max-h-[92vh] max-w-2xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground">
              {preview ? "Report preview" : "Generate donation report"}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {preview
                ? `${from} to ${to} · ${PERIOD_WORD[granularity]}ly · ${
                    statuses.length ? statuses.join(", ") : "all statuses"
                  }`
                : "Choose what the report covers, then look at it before you save."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {preview ? (
          <iframe
            src={preview.url}
            title="Donation report preview"
            className="min-h-0 w-full flex-1 bg-muted"
          />
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const [f, t] = preset.range();
                    setFrom(f);
                    setTo(t);
                    setGranularity(preset.granularity);
                  }}
                  className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-emerald-500/60 hover:text-emerald-600"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                From
                <input
                  type="date"
                  value={from}
                  max={to}
                  onChange={(e) => setFrom(e.target.value)}
                  className={FIELD}
                />
              </label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                To
                <input
                  type="date"
                  value={to}
                  min={from}
                  onChange={(e) => setTo(e.target.value)}
                  className={FIELD}
                />
              </label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                Group by
                <select
                  value={granularity}
                  onChange={(e) =>
                    setGranularity(e.target.value as ReportGranularity)
                  }
                  className={FIELD}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>

            <label className="block text-xs text-muted-foreground">
              Project
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className={`${FIELD} mt-1 w-full`}
              >
                <option value="">All projects</option>
                <option value="OTHER">Other (Zakat / Sadakah / General)</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-1.5 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground">Status</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {STATUSES.map((status) => (
                  <label
                    key={status}
                    className="inline-flex cursor-pointer select-none items-center gap-1.5 text-xs font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={statuses.includes(status)}
                      onChange={() =>
                        setStatuses((list) => toggle(list, status, STATUSES))
                      }
                      className="h-4 w-4 cursor-pointer rounded border-border accent-emerald-600"
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${STATUS_TONE[status]}`}
                      aria-hidden
                    />
                    <span
                      className={
                        statuses.includes(status)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>
              {statuses.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nothing ticked — every status will be included.
                </p>
              )}
            </div>

            <div className="space-y-1.5 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Sections to include
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {SECTIONS.map((section) => (
                  <label
                    key={section.value}
                    className="inline-flex cursor-pointer select-none items-center gap-1.5 text-xs font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={sections.includes(section.value)}
                      onChange={() =>
                        setSections((list) =>
                          toggle(
                            list,
                            section.value,
                            SECTIONS.map((s) => s.value)
                          )
                        )
                      }
                      className="h-4 w-4 cursor-pointer rounded border-border accent-emerald-600"
                    />
                    <span
                      className={
                        sections.includes(section.value)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {section.label}
                    </span>
                  </label>
                ))}
              </div>
              {sections.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nothing ticked — the whole report will be included.
                </p>
              )}
            </div>

            {/* What these choices actually catch, before anything is generated. */}
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs">
              {scoping ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking what
                  this covers…
                </span>
              ) : scope ? (
                <span className="text-muted-foreground">
                  This report covers{" "}
                  <strong className="text-foreground">
                    {scope.totals.count.toLocaleString()} gift
                    {scope.totals.count === 1 ? "" : "s"}
                  </strong>{" "}
                  totalling{" "}
                  <strong className="text-emerald-600">
                    {formatMoney(scope.totals.total, scope.currency)}
                  </strong>{" "}
                  from {scope.totals.donors.toLocaleString()} donor
                  {scope.totals.donors === 1 ? "" : "s"}, across{" "}
                  {scope.byPeriod.length} {PERIOD_WORD[granularity]}
                  {scope.byPeriod.length === 1 ? "" : "s"}.
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Could not check the range.
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">
          {preview ? (
            <>
              <button
                type="button"
                onClick={backToOptions}
                className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Change options
              </button>
              {(
                [
                  ["csv", "CSV", FileText],
                  ["xlsx", "Excel", FileSpreadsheet],
                ] as const
              ).map(([format, label, Icon]) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => download(format)}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {busy === format ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  )}
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => download("pdf")}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={busy !== null}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy === "preview" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Generate &amp; preview
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
