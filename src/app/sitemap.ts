import type { MetadataRoute } from "next";
import { serverGet } from "@/lib/serverApi";
import type { ApiBlogListItem } from "@/types/blogs";
import type { ApiStoryListItem } from "@/types/stories";
import type { ApiEvent } from "@/types/events";
import type { ApiCampaign } from "@/types/campaigns";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/donate`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/blog/real-life-stories`, lastModified: new Date() },
    { url: `${baseUrl}/blog/magazine`, lastModified: new Date() },
    { url: `${baseUrl}/blog/events`, lastModified: new Date() },
  ];

  const [projects, blogs, stories, events] = await Promise.all([
    projectRoutes(),
    blogRoutes(),
    storyRoutes(),
    eventRoutes(),
  ]);

  return [...staticRoutes, ...projects, ...blogs, ...stories, ...events];
}
