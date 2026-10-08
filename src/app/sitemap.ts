import type { MetadataRoute } from "next";
import { serverGet } from "@/lib/serverApi";
import type { ApiBlogListItem } from "@/types/blogs";
import type { ApiStoryListItem } from "@/types/stories";
import type { ApiEvent } from "@/types/events";
import type { ApiCampaign } from "@/types/campaigns";
import type { ApiReportListItem } from "@/types/reports";
import type { ApiBoardGroups } from "@/types/content";
import { services } from "@/data/services";
import { locations } from "@/data/locations";
import { partners } from "@/data/partners";
import { CATEGORY_SEO } from "./blog/education-career/_seo";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

// List endpoints return the rows in `data` with pagination alongside in `meta`,
// and serverGet already unwraps the envelope — so these come back as plain arrays.

async function blogRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<ApiBlogListItem[]>("/blogs?limit=500&sortBy=publishedAt&sortOrder=desc");
  if (!result) return [];
  return result.map((post) => ({
    url: `${baseUrl}/blog/${post.category.slug}/${post.id}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt),
  }));
}

async function storyRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<ApiStoryListItem[]>("/stories?limit=500");
  if (!result) return [];
  return result.map((story) => ({
    url: `${baseUrl}/blog/real-life-stories/${story.slug}`,
    lastModified: story.publishedAt ? new Date(story.publishedAt) : new Date(),
  }));
}

async function projectRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<ApiCampaign[]>("/campaigns?status=ACTIVE");
  if (!result) return [];
  return result.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));
}

async function eventRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<ApiEvent[]>("/events?when=all&limit=500");
  if (!result) return [];
  return result.map((event) => ({
    url: `${baseUrl}/blog/events/${event.slug}`,
    lastModified: new Date(),
  }));
}

async function reportRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<ApiReportListItem[]>("/reports?limit=100");
  if (!result) return [];
  return result.map((report) => ({
    url: `${baseUrl}/about/reports/${report.slug}`,
    lastModified: report.publishedAt ? new Date(report.publishedAt) : new Date(),
  }));
}

async function teamRoutes(): Promise<MetadataRoute.Sitemap> {
  const groups = await serverGet<ApiBoardGroups>("/content/board/groups");
  if (!groups) return [];
  const slugs = new Set(
    [...groups.board, ...groups.advisory, ...groups.leadership, ...groups.management].map((m) => m.slug)
  );
  return [...slugs].map((slug) => ({
    url: `${baseUrl}/about/who-we-are/${slug}`,
    lastModified: new Date(),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/about/who-we-are`, lastModified: new Date() },
    { url: `${baseUrl}/about/mission-vision`, lastModified: new Date() },
    { url: `${baseUrl}/about/archive`, lastModified: new Date() },
    { url: `${baseUrl}/what-we-do`, lastModified: new Date() },
    { url: `${baseUrl}/donate`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/refund`, lastModified: new Date() },
    { url: `${baseUrl}/delivery`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/blog/real-life-stories`, lastModified: new Date() },
    { url: `${baseUrl}/blog/magazine`, lastModified: new Date() },
    { url: `${baseUrl}/blog/events`, lastModified: new Date() },
    { url: `${baseUrl}/about/reports`, lastModified: new Date() },
    { url: `${baseUrl}/about/where-we-work`, lastModified: new Date() },
    { url: `${baseUrl}/get-involved/partner`, lastModified: new Date() },
    { url: `${baseUrl}/blog/education-career`, lastModified: new Date() },
  ];

  // Pages built from data files in the repo. The service pages are the ones a
  // search like "student counselling in Bangladesh" should land on. Cities are
  // left out: they share one placeholder bio, so they would be near-duplicates.
  const dataRoutes: MetadataRoute.Sitemap = [
    ...services.map((s) => `/what-we-do/${s.slug}`),
    ...locations.map((c) => `/about/where-we-work/${c.slug}`),
    ...partners.map((p) => `/get-involved/partner/${p.slug}`),
    ...Object.keys(CATEGORY_SEO).map((slug) => `/blog/education-career/${slug}`),
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));

  const [projects, blogs, stories, events, reports, team] = await Promise.all([
    projectRoutes(),
    blogRoutes(),
    storyRoutes(),
    eventRoutes(),
    reportRoutes(),
    teamRoutes(),
  ]);

  return [...staticRoutes, ...dataRoutes, ...projects, ...blogs, ...stories, ...events, ...reports, ...team];
}
