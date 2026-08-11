import {
  Award,
  BadgeCheck,
  Bell,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  FileText,
  HandCoins,
  HeartHandshake,
  Library,
  Megaphone,
  MessageSquare,
  MessageSquarePlus,
  Newspaper,
  Receipt,
  Target,
  TriangleAlert,
  UserMinus,
  type LucideIcon,
} from "lucide-react";

/**
 * One table for every notification type: the label shown in settings, and the
 * icon + tone shown in the bell and the list. The bell, the notifications page
 * and the preference grid all read from here so a new type is one line.
 *
 * Types are the server's `NOTIFICATION_TYPES` (comms.service.ts). A type that
 * is missing here still renders — see `metaFor` — it just gets the generic bell.
 */
type Meta = { label: string; icon: LucideIcon; tone: string };

export const TYPE_META: Record<string, Meta> = {
  STORY_APPROVED: { label: "Your story was approved", icon: Newspaper, tone: "emerald" },
  STORY_REJECTED: { label: "Your story was not accepted", icon: Newspaper, tone: "rose" },
  COMMENT_APPROVED: { label: "Your comment was published", icon: MessageSquare, tone: "emerald" },
  COMMENT_REJECTED: { label: "Your comment was removed", icon: MessageSquare, tone: "rose" },
  COMMENT_REPLY: { label: "Someone replied to your comment", icon: MessageSquare, tone: "sky" },
  DONATION_RECEIVED: { label: "Donation received", icon: HandCoins, tone: "emerald" },
  RECEIPT_AVAILABLE: { label: "A receipt is ready", icon: Receipt, tone: "sky" },
  STATEMENT_AVAILABLE: { label: "A statement is ready", icon: FileText, tone: "sky" },
  CARE_ASSIGNED: { label: "A counsellor or mentor was assigned", icon: HeartHandshake, tone: "emerald" },
  CARE_ASSIGNMENT_ENDED: { label: "An assignment ended", icon: UserMinus, tone: "amber" },
  REPORT_SHARED: { label: "A report was shared with you", icon: FileText, tone: "sky" },
  GOAL_ASSIGNED: { label: "A new goal was added", icon: Target, tone: "emerald" },
  GOAL_MISSED: { label: "A goal passed its due date", icon: TriangleAlert, tone: "amber" },
  SESSION_BOOKED: { label: "A session was booked", icon: CalendarPlus, tone: "emerald" },
  SESSION_REMINDER: { label: "Session reminders", icon: CalendarClock, tone: "sky" },
  SESSION_CANCELLED: { label: "A session was cancelled", icon: CalendarX, tone: "rose" },
  BADGE_EARNED: { label: "You earned a badge", icon: Award, tone: "amber" },
  RANK_CHANGED: { label: "Your rank changed", icon: BadgeCheck, tone: "amber" },
  NEW_MESSAGE: { label: "New message", icon: MessageSquare, tone: "sky" },
  RESOURCE_ASSIGNED: { label: "A resource was shared with you", icon: Library, tone: "sky" },
  FEEDBACK_ANSWERED: { label: "We replied to your feedback", icon: MessageSquarePlus, tone: "emerald" },
  ANNOUNCEMENT: { label: "Announcements from Student Square", icon: Megaphone, tone: "sky" },

  ADMIN_NEW_STORY: { label: "A story was submitted for review", icon: Newspaper, tone: "amber" },
  ADMIN_NEW_COMMENT: { label: "A comment is awaiting moderation", icon: MessageSquare, tone: "amber" },
  ADMIN_NEW_DONATION: { label: "A donation came in", icon: HandCoins, tone: "emerald" },
  ADMIN_NEW_FEEDBACK: { label: "New feedback was submitted", icon: MessageSquarePlus, tone: "amber" },
  ADMIN_CAMPAIGN_APPROVAL: { label: "A bulk message needs approval", icon: Megaphone, tone: "amber" },
};

/**
 * A type the server knows about but this table doesn't still renders — with a
 * readable label off the enum name — so adding one server-side degrades to
 * "plain row" instead of "row silently missing from settings".
 */
export function metaFor(type: string): Meta {
  return (
    TYPE_META[type] ?? {
      label: type.replace(/^ADMIN_/, "").replace(/_/g, " ").toLowerCase()
        .replace(/^./, (c) => c.toUpperCase()),
      icon: Bell,
      tone: "sky",
    }
  );
}

/** ADMIN_* is the server's naming convention for staff-only alerts. */
export const isStaffType = (type: string) => type.startsWith("ADMIN_");

/** Tailwind can't build class names at runtime, so the tones are spelled out. */
export const TONE_CLASS: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export { dayGroup, timeAgo } from "@/lib/relative-time";
