/** Types for the Phase 4 surface: messaging, feedback, resources, comms. */

import type { UserRole } from "./auth";

// --- messaging ---

export type Participant = {
  id: string;
  fullName: string;
  role: UserRole;
  profile: { avatarUrl: string | null } | null;
};

export type ThreadSummary = {
  id: string;
  subject: string | null;
  lastMessageAt: string;
  closedAt: string | null;
  counterpart: Participant;
  preview: string | null;
  unread: boolean;
};

export type MessageAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export type ThreadMessage = {
  id: string;
  senderId: string;
  body: string;
  internal: boolean;
  createdAt: string;
  sender?: { id: string; fullName: string; role: UserRole } | null;
  attachments?: MessageAttachment[];
};

export type Thread = {
  id: string;
  subject: string | null;
  closedAt: string | null;
  member: Participant;
  staff: Participant;
  viewerIsMember: boolean;
  /** True when a Super Admin is reading someone else's thread. Read-only. */
  oversight: boolean;
  messages: ThreadMessage[];
};

export type PersonalNote = { body: string; updatedAt: string | null };

export type SignedFile = {
  url: string;
  fileName: string;
  expiresInSeconds: number;
};

// --- feedback ---

export type FeedbackKind =
  | "PLATFORM"
  | "COUNSELLING"
  | "MENTORING"
  | "CONTENT"
  | "OTHER";

export type FeedbackStatus = "NEW" | "REVIEWED" | "ACTIONED" | "DISMISSED";

export type Feedback = {
  id: string;
  kind: FeedbackKind;
  rating: number | null;
  subject: string;
  body: string;
  status: FeedbackStatus;
  response: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user?: { id: string; fullName: string; email: string; role: UserRole };
  reviewedBy?: { id: string; fullName: string } | null;
};

// --- resources ---

export type ResourceType = "DOCUMENT" | "VIDEO" | "LINK" | "TRAINING_MODULE";

export type Resource = {
  id: string;
  title: string;
  titleBn: string | null;
  description: string | null;
  type: ResourceType;
  url: string | null;
  category: string | null;
  published: boolean;
  createdAt: string;
  hasFile: boolean;
  assignedToMe: boolean;
  bookmarked: boolean;
};

export type AdminResource = Omit<
  Resource,
  "hasFile" | "assignedToMe" | "bookmarked"
> & {
  assignments: {
    id: string;
    role: UserRole | null;
    user: { id: string; fullName: string } | null;
  }[];
  createdBy: { id: string; fullName: string } | null;
};

export type BookmarkRefType = "BLOG" | "STORY" | "RESOURCE";

export type SavedItems = {
  blogs: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string | null;
    category: { slug: string; name: string } | null;
    coverImage: { url: string } | null;
  }[];
  stories: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    coverImage: { url: string } | null;
  }[];
  resources: {
    id: string;
    title: string;
    type: ResourceType;
    url: string | null;
    category: string | null;
  }[];
  savedAt: Record<string, string>;
};

// --- notification preferences ---

export type NotificationChannel = "IN_APP" | "EMAIL";

export type NotificationPreference = {
  type: string;
  /** Account-record notifications cannot be switched off — FR-18-009. */
  locked: boolean;
  inApp: boolean;
  email: boolean;
};

// --- templates and campaigns ---

export type CommsVariable = { name: string; description: string };

export type NotificationTemplate = {
  id: string;
  key: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  variables: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CampaignState =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "SENDING"
  | "SENT"
  | "CANCELLED"
  | "REJECTED";

export type CampaignChannel = "EMAIL" | "SMS";

export type Audience = {
  roles?: UserRole[];
  onlyVerified?: boolean;
  /** Preview-only — narrows the count to members with a phone on file. */
  channel?: CampaignChannel;
};

export type AudiencePreview = {
  count: number;
  needsApproval: boolean;
  threshold: number;
  sample: string[];
};

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  channel: CampaignChannel;
  templateId: string | null;
  audience: Audience | null;
  recipientCount: number;
  state: CampaignState;
  rejectReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  createdBy: { id: string; fullName: string } | null;
  approvedBy: { id: string; fullName: string } | null;
  approvedAt: string | null;
  progress?: Partial<
    Record<"PENDING" | "SENT" | "FAILED" | "BOUNCED" | "SKIPPED", number>
  >;
};

export type Suppression = {
  id: string;
  email: string;
  reason: string;
  createdAt: string;
};
