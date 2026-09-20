import { redirect } from "next/navigation";

/**
 * Moderation Queue UI is hidden for now (member story submit isn't live yet).
 * Backend endpoints remain; re-enable by restoring this page and the nav item.
 */
export default function ModerationQueuePage() {
  redirect("/admin");
}
