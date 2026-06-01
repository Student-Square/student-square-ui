/** Types for the /stories API surface (real-life stories from the backend). */

export type StoryStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "ARCHIVED";

export type StoryImageItem = {
  id: string;
  order: number;
  caption: string | null;
  image: { id: string; url: string; alt: string | null };
};

export type ApiStoryListItem = {
  id: string;
  slug: string;
  name: string;
  department: string | null;
  university: string | null;
  joinedYear: number | null;
  achievement: string | null;
  quote: string | null;
  quoteBn: string | null;
  summary: string | null;
  summaryBn: string | null;
  highlights: string[];
  publishedAt: string | null;
  coverImage: { id: string; url: string; alt: string | null } | null;
  images: StoryImageItem[];
};

export type ApiStory = ApiStoryListItem & {
  body: string;
  bodyBn: string | null;
};

export type ApiAdminStory = ApiStory & {
  status: StoryStatus;
  department: string | null;
  university: string | null;
  rejectionNote: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: { id: string; email: string; fullName: string } | null;
  reviewedBy: { id: string; email: string; fullName: string } | null;
};

export type ApiAdminStoryListItem = {
  id: string;
  slug: string;
  name: string;
  department: string | null;
  university: string | null;
  status: StoryStatus;
  publishedAt: string | null;
  createdAt: string;
  coverImage: { url: string; alt: string | null } | null;
  submitter: { id: string; email: string; fullName: string } | null;
};

export type ApiMyStory = {
  id: string;
  slug: string;
  name: string;
  status: StoryStatus;
  publishedAt: string | null;
  reviewedAt: string | null;
  rejectionNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StorySubmissionInput = {
  name: string;
  department?: string;
  university?: string;
  joinedYear?: number;
  achievement?: string;
  quote?: string;
  quoteBn?: string;
  summary?: string;
  summaryBn?: string;
  body: string;
  bodyBn?: string;
  highlights?: string[];
  coverImageId?: string;
  imageIds?: string[];
};

export type AdminStoryWriteInput = {
  name: string;
  department?: string | null;
  university?: string | null;
  joinedYear?: number | null;
  achievement?: string | null;
  quote?: string | null;
  quoteBn?: string | null;
  body: string;
  bodyBn?: string | null;
  highlights?: string[];
  coverImageId?: string | null;
  images?: { id: string; caption?: string }[];
  status?: StoryStatus;
};

export type StoryListOptions = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
