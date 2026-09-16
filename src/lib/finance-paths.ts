/**
 * Where the Financial Work Book lives in each shell.
 *
 * One component serves three routes (`/dashboard/finance`, `/panel/finance`,
 * `/admin/my-finance` — each of the latter two a re-export). A hardcoded
 * `/dashboard/finance` link inside it would throw staff out of their own
 * layout: `dashboard/layout.tsx` redirects any role whose home is not
 * /dashboard. So links are resolved against the path actually being viewed.
 */
export const financeBasePath = (pathname: string): string => {
  if (pathname.startsWith("/panel")) return "/panel/finance";
  if (pathname.startsWith("/admin")) return "/admin/my-finance";
  return "/dashboard/finance";
};
