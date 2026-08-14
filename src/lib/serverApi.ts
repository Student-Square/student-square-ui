/**
 * Minimal server-side fetch for RSC contexts (generateMetadata, sitemap.ts)
 * where the RTK Query client can't run. Talks to the same `{ success, data }`
 * envelope as baseApi, but never throws into the render — callers get `null`
 * on any failure so a slow/down backend degrades to default metadata instead
 * of a 500 page.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      // SEO metadata can lag a build behind — cheaper than SSR-ing every request.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as { success?: boolean; data?: T };
    if (!payload?.success) return null;
    return payload.data ?? null;
  } catch {
    return null;
  }
}
