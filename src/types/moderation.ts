/** Types for the /moderation and /admin/comments API surface. */

import type { CommentStatus } from "./comments";

export type ModerationQueueStory = {
  id: string;
  slug: string;
  name: string;
  department: string | null;
  university: string | null;
  summary: string | null;
  createdAt: string;
  submitter: { id: string; fullName: string; email: string } | null;
};

export type ModerationQueueComment = {
  id: string;
  body: string;
  createdAt: string;
  blogPostId: string | null;
  storyId: string | null;
  author: { id: string; fullName: string; email: string };
  blogPost: { slug: string; title: string } | null;
  story: { slug: string; name: string } | null;
};

export type ModerationQueue = {
  stories: ModerationQueueStory[];
  comments: ModerationQueueComment[];
};

export type ModerationStats = {
  pendingStories: number;
  pendingComments: number;
  spamComments: number;
  total: number;
};

export type AdminComment = {
  id: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
  blogPostId: string | null;
  storyId: string | null;
  author: { id: string; fullName: string; email: string };
  blogPost: { id: string; slug: string; title: string } | null;
  story: { id: string; slug: string; name: string } | null;
  parent: { id: string; body: string; authorId: string } | null;
};

export type AdminCommentListQuery = {
  status?: CommentStatus | "ALL";
  blogPostId?: string;
  storyId?: string;
  page?: number;
  limit?: number;
};
