import type { GoalStatus, RankTier, SessionStatus, SwotKind } from "@/types/care";

/**
 * FR-08-011 — everything is stored UTC and rendered in Asia/Dhaka. These
 * formatters are the only place the timezone is named, so "which clock is this
 * screen showing" has one answer for the whole care surface.
 */
const TZ = "Asia/Dhaka";

export const formatDateTime = (iso: string | Date) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatTime = (iso: string | Date) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatTimeRange = (start: string | Date, end: string | Date) =>
  `${formatTime(start)} – ${formatTime(end)}`;

/** `YYYY-MM-DD` for the day a timestamp falls on in Dhaka — a grouping key. */
export const dhakaDayKey = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });

/** Colour-coding required by FR-08-006. */
export const SESSION_STATUS_STYLE: Record<SessionStatus, string> = {
  SCHEDULED:
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  COMPLETED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  CANCELLED:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  POSTPONED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  NO_SHOW:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
};

export const GOAL_STATUS_STYLE: Record<GoalStatus, string> = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  MISSED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export const TIER_STYLE: Record<RankTier, string> = {
  BRONZE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  SILVER: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200",
  GOLD: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  PLATINUM: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  DIAMOND: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

export const SWOT_META: Record<
  SwotKind,
  { label: string; accent: string; dot: string }
> = {
  STRENGTH: {
    label: "Strengths",
    accent: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20",
    dot: "bg-emerald-500",
  },
  WEAKNESS: {
    label: "Weaknesses",
    accent: "border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20",
    dot: "bg-rose-500",
  },
  OPPORTUNITY: {
    label: "Opportunities",
    accent: "border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20",
    dot: "bg-sky-500",
  },
  THREAT: {
    label: "Threats",
    accent: "border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20",
    dot: "bg-amber-500",
  },
};

export const SWOT_ORDER: SwotKind[] = [
  "STRENGTH",
  "WEAKNESS",
  "OPPORTUNITY",
  "THREAT",
];

/** `datetime-local` gives a wall-clock string; the API wants an ISO instant. */
export const localInputToIso = (value: string) =>
  value ? new Date(value).toISOString() : "";
