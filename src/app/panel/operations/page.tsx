/**
 * The staff Daily Task Book.
 *
 * Deliberately the same component as the member's Daily Operation Book, not a
 * copy of it: `panelScope` is stamped server-side from the author's role, so a
 * counsellor hitting `/operations/mine` already gets their own book. There is
 * nothing role-specific left for this file to do — and a second copy would be
 * the file that stops matching the first.
 */
export { default } from "@/app/dashboard/operations/page";
