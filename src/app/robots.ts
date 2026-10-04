import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

// Private areas. This keeps them out of search results; it is not access
// control — the API's auth() is.
const PRIVATE = ["/admin", "/dashboard", "/panel", "/api"];

// Search engines and AI assistants named explicitly, so a crawler that only
// reads its own group still finds an allow rule.
const NAMED_CRAWLERS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...NAMED_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
