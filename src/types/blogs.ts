/**
 * Types for the /blogs API surface (live posts from the backend).
 *
 * NOTE: This is the API-shape `ApiBlogPost` etc. used by RTK Query.
 * The legacy static-content `Blog` type lives in `./blog.ts` (singular).
 */

export type ApiBlogAuthor = {
  id: string;
  fullName: string;
} | null;

export type ApiBlogCategory = {
  id: string;
  slug: string;
  name: string;
  nameBn: string | null;
  order: number;
  isActive: boolean;
};

export type ApiBlogTagRef = { tag: { id: string; slug: string; name: string } };

export type ApiBlogListItem = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  excerpt: string;
  excerptBn: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  displayAuthorName: string | null;
  displayAuthorTitle: string | null;
  displayAuthorImage: string | null;
  coverImage: { id: string; url: string; alt: string | null } | null;
  category: ApiBlogCategory;
  tags: ApiBlogTagRef[];
};

export type ApiBlogPost = ApiBlogListItem & {
  body: string;
  bodyBn: string | null;
  displayAuthorBio: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  author: ApiBlogAuthor;
};

export type ApiBlogCategoryWithCount = ApiBlogCategory & {
  _count: { posts: number };
};

export type ApiBlogTagWithCount = {
  id: string;
  slug: string;
  name: string;
  _count: { posts: number };
};

export type BlogListOptions = {
  searchTerm?: string;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
