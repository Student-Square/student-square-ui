/** Types for the /comments API surface. */

export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | "DELETED";

export type ApiCommentAuthor = {
  id: string;
  fullName: string;
  profile: { avatarUrl: string | null } | null;
};

export type ApiComment = {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  author: ApiCommentAuthor;
};

export type ApiMyComment = {
  id: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
  blogPostId: string | null;
  storyId: string | null;
  blogPost: { slug: string; title: string } | null;
  story: { slug: string; name: string } | null;
};

export type CommentCreateInput = {
  body: string;
  blogPostId?: string;
  storyId?: string;
  parentId?: string;
};
