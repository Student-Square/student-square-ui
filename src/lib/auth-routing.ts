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

/** Roles that can reach the /admin area. */
export const ADMIN_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "MODERATOR",
]);

/** Where each role lands when they have no `?next=` to honour. */
export function roleHome(role: UserRole): string {
  if (ADMIN_ROLES.has(role)) return "/admin";
  return "/dashboard";
}

/**
 * Returns true if `role` is permitted to land on `path`.
 * - /admin/* is gated to ADMIN_ROLES
 * - Anything else is open to any authenticated user
 *
 * Note: this is a UX-time check to avoid bouncing users through extra
 * redirects. The real authority is still the server (and middleware +
 * /admin/layout.tsx).
 */
export function canAccessPath(role: UserRole, path: string): boolean {
  if (!path || !path.startsWith("/")) return false;
  if (path.startsWith("/admin")) return ADMIN_ROLES.has(role);
  return true;
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
