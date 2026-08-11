/** Relative-time helpers for notification surfaces. Pure — see relative-time.test.ts. */

/** Compact age for a list row: "Just now", "5m", "3h", "2d", then a date. */
export function timeAgo(iso: string, now: number = Date.now()) {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h`;
  if (mins < 10080) return `${Math.floor(mins / 1440)}d`;
  return new Date(iso).toLocaleDateString();
}

/**
 * Bucket for the date headers on the notifications list.
 *
 * Calendar days, not rolling 24h windows: something sent at 23:50 reads as
 * "Yesterday" the next morning, which is what the header is claiming.
 */
export function dayGroup(iso: string, now: Date = new Date()) {
  const d = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 86400000;
  if (d.getTime() >= startOfToday.getTime()) return "Today";
  if (d.getTime() >= startOfToday.getTime() - day) return "Yesterday";
  if (d.getTime() >= startOfToday.getTime() - 7 * day) return "This week";
  return "Earlier";
}
