/** Types for the /search API surface. */

type Cover = { url: string; alt: string | null } | null;

export type SearchBlog = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  excerpt: string;
  excerptBn: string | null;
  publishedAt: string | null;
  coverImage: Cover;
  category: { slug: string; name: string; nameBn: string | null };
};

export type SearchStory = {
  slug: string;
  name: string;
  summary: string;
  summaryBn: string | null;
  university: string | null;
  coverImage: Cover;
};

export type SearchProject = {
  slug: string;
  title: string;
  titleBn: string | null;
  summary: string;
  summaryBn: string | null;
  coverImage: Cover;
};

export type SearchEvent = {
  slug: string;
  title: string;
  titleBn: string | null;
  description: string;
  descriptionBn: string | null;
  startsAt: string;
  coverImage: Cover;
};

export type SearchResults = {
  query: string;
  total: number;
  counts: { blogs: number; stories: number; projects: number; events: number };
  results: {
    blogs: SearchBlog[];
    stories: SearchStory[];
    projects: SearchProject[];
    events: SearchEvent[];
  };
};
