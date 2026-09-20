import type { UserRole } from "@/types/auth";

/**
 * Mirror of the API's ROLE_RANK (roles.constant.ts). The API enforces it — an
 * account above you is left out of lists and answers 404 by id — so this only
 * keeps the UI from offering what the server would refuse.
 */
const ROLE_RANK: Partial<Record<UserRole, number>> = {
  SYSTEM_ADMIN: 3,
  SUPER_ADMIN: 2,
  ADMIN: 1,
};

const rank = (role: UserRole | null | undefined) =>
  (role && ROLE_RANK[role]) ?? 0;

/** May `caller` see (and so assign) accounts holding `target`? */
export const canSeeRole = (
  caller: UserRole | null | undefined,
  target: UserRole
) => rank(target) <= rank(caller);
