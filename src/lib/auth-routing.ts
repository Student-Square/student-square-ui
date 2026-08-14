/**
 * Role-aware routing helpers.
 *
 * Single source of truth for:
 *   - where each role's "home" lives after login
 *   - whether a given role is allowed to visit a given path
 *
 * Keep both functions side-by-side: the access check should never let
 * someone reach a path that isn't their role's home OR a path they're
 * explicitly permitted to visit.
 */

import type { UserRole } from "@/types/auth";

/**
 * Roles that can reach the /admin area.
 *
 * It's one shell for every staff role that isn't counsellor/mentor — each
 * role just sees a different slice of the nav (see admin/layout.tsx NAV).
 * AUTHOR: own blog posts only. MODERATOR: moderation queue. HR_MANAGER:
 * recruitment (placeholder until Phase 7 builds it out).
 */
export const ADMIN_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  "SYSTEM_ADMIN",
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "MODERATOR",
  "AUTHOR",
  "HR_MANAGER",
]);

/**
 * Roles that can reach /panel — the shared care panel (SRS §2.5.2 CARE_ROLES).
 *
 * Counsellor and mentor are nav variants of one shell, not two route trees.
 * Admins are here so a System Admin can oversee a caseload without a second
 * codepath; the server still applies the relationship check per student.
 */
export const PANEL_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  "SYSTEM_ADMIN",
  "SUPER_ADMIN",
  "ADMIN",
  "COUNSELLOR",
  "MENTOR",
]);

/** Where each role lands when they have no `?next=` to honour. */
export function roleHome(role: UserRole): string {
  if (ADMIN_ROLES.has(role)) return "/admin";
  // Counsellor and mentor have no /admin console; the panel is their home.
  if (PANEL_ROLES.has(role)) return "/panel";
  return "/dashboard";
}

/**
 * Returns true if `role` is permitted to land on `path`.
 * - /admin/* is gated to ADMIN_ROLES
 * - /panel/* is gated to PANEL_ROLES
 * - Anything else is open to any authenticated user
 *
 * Note: this is a UX-time check to avoid bouncing users through extra
 * redirects. The real authority is still the server (and middleware +
 * /admin/layout.tsx + /panel/layout.tsx).
 */
export function canAccessPath(role: UserRole, path: string): boolean {
  if (!path || !path.startsWith("/")) return false;
  if (path.startsWith("/admin")) return ADMIN_ROLES.has(role);
  if (path.startsWith("/panel")) return PANEL_ROLES.has(role);
  return true;
}

/**
 * Which shell the current URL belongs to, so shared components (the bell,
 * the settings link) can build links without every caller passing a base.
 */
export function shellBase(pathname: string): "/admin" | "/panel" | "/dashboard" {
  if (pathname.startsWith("/admin")) return "/admin";
  if (pathname.startsWith("/panel")) return "/panel";
  return "/dashboard";
}

/**
 * Resolve the destination to send a freshly-logged-in user to.
 * Honours `requestedNext` only when the role is allowed there;
 * otherwise falls back to the role's home.
 */
export function pickPostLoginDestination(
  role: UserRole,
  requestedNext: string | null | undefined
): string {
  if (requestedNext && canAccessPath(role, requestedNext)) {
    return requestedNext;
  }
  return roleHome(role);
}
