import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private areas. This keeps them out of search results; it is not access
      // control — the API's auth() is.
      disallow: ["/admin", "/dashboard", "/panel", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
