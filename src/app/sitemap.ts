import type { MetadataRoute } from "next";
import { projectsData } from "@/data/projects";
import { serverGet } from "@/lib/serverApi";
import type { ApiBlogListItem } from "@/types/blogs";
import type { ApiStoryListItem } from "@/types/stories";
import type { ApiEvent } from "@/types/events";
import type { Paginated } from "@/types/api";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studentsquare.org";

async function blogRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<Paginated<ApiBlogListItem>>("/blogs?limit=500&sortBy=publishedAt&sortOrder=desc");
  if (!result) return [];
  return result.data.map((post) => ({
    url: `${baseUrl}/blog/${post.category.slug}/${post.id}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt),
  }));
}

async function storyRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<Paginated<ApiStoryListItem>>("/stories?limit=500");
  if (!result) return [];
  return result.data.map((story) => ({
    url: `${baseUrl}/blog/real-life-stories/${story.slug}`,
    lastModified: story.publishedAt ? new Date(story.publishedAt) : new Date(),
  }));
}

async function eventRoutes(): Promise<MetadataRoute.Sitemap> {
  const result = await serverGet<Paginated<ApiEvent>>("/events?when=all&limit=500");
  if (!result) return [];
  return result.data.map((event) => ({
    url: `${baseUrl}/blog/events/${event.slug}`,
    lastModified: new Date(),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/donate`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/blog/real-life-stories`, lastModified: new Date() },
    { url: `${baseUrl}/blog/magazine`, lastModified: new Date() },
    { url: `${baseUrl}/blog/events`, lastModified: new Date() },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const [blogs, stories, events] = await Promise.all([blogRoutes(), storyRoutes(), eventRoutes()]);

  return [...staticRoutes, ...projectRoutes, ...blogs, ...stories, ...events];
}
