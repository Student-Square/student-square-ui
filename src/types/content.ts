/**
 * Types for the /content API surface — public hero cards, board members,
 * page sections, site settings, plus the admin-only views with lifecycle fields.
 *
 * Schema only. No fetch functions live here; all calls go through RTK Query.
 */

// ───────── Public ─────────

export type HeroSlot = "main_carousel" | "secondary" | "third" | "blog_1" | "blog_2";

export type ApiFeatureCard = {
  id: string;
  slot: HeroSlot;
  title: string;
  titleBn: string | null;
  category: string;
  /** S3/CDN url, or null when no image has been set. */
  image: string | null;
  href: string;
  order: number;
};

export type TeamCategoryUpper = "BOARD" | "ADVISORY" | "LEADERSHIP" | "MANAGEMENT";

export type ApiBoardMember = {
  id: string;
  slug: string;
  name: string;
  nameBn: string | null;
  role: string;
  roleBn: string | null;
  category: TeamCategoryUpper;
  email: string | null;
  bio: string | null;
  bioBn: string | null;
  order: number;
  photo: { url: string; alt: string | null } | null;
};

export type ApiPageSection = {
  sectionKey: string;
  content: Record<string, unknown>;
  order: number;
};

export type ApiSiteSettings = Record<string, unknown>;

// ───────── Admin (Phase 3) ─────────

export type CardStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ContentRefType =
  | "PROJECT"
  | "SERVICE"
  | "BLOG"
  | "STORY"
  | "EXTERNAL";

/**
 * Admin view of a hero card — includes lifecycle fields hidden from the public
 * read endpoint. The public endpoint resolves `contentType + contentRef` into
 * `href` server-side; the admin view keeps both so editors can change targets.
 */
export type AdminFeatureCard = {
  id: string;
  slot: HeroSlot;
  contentType: ContentRefType;
  /** slug for project/service, id-as-string for blog/story, raw url for external */
  contentRef: string;
  title: string;
  titleBn: string | null;
  category: string;
  /** MediaAsset id — use when sending updates back to the server */
  imageId: string | null;
  /** CDN URL — use for display only */
  image: string | null;
  status: CardStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCreateCardInput = {
  slot: HeroSlot;
  contentType: ContentRefType;
  contentRef: string;
  title: string;
  titleBn?: string | null;
  category: string;
  /** MediaAsset id from /admin/media upload or linked post's coverImage.id */
  imageId?: string | null;
  status?: CardStatus;
  order?: number;
};

export type AdminUpdateCardInput = Partial<AdminCreateCardInput> & {
  publishedAt?: string | null;
  archivedAt?: string | null;
};

export type AdminListCardsParams = {
  slot?: HeroSlot;
  status?: CardStatus;
};

export type ApiUpload = {
  id: string;
  url: string;
  alt?: string | null;
};

// ───────── Editable pages (About, etc.) ─────────

/** A single body block on an editable page. */
export type ApiPageBodySection = {
  id: string;
  heading: string;
  body: string;
  order: number;
};

/** Public response — what /about/mission-vision reads. */
export type ApiEditablePage = {
  slug: string;
  heroTitle: string;
  bannerUrl: string | null;
  bannerAlt: string | null;
  sections: ApiPageBodySection[];
  updatedAt: string;
};

/** Admin write inputs. The body sections are sent as an ordered array;
 *  server treats this as the new authoritative list (replace, not patch). */
export type AdminPageBodySectionInput = {
  /** Omit `id` for new sections; server assigns one. */
  id?: string;
  heading: string;
  body: string;
};

export type AdminUpdateEditablePageInput = {
  heroTitle?: string;
  bannerUrl?: string | null;
  bannerAlt?: string | null;
  /** When provided, replaces the section list in order. */
  sections?: AdminPageBodySectionInput[];
};

/** Known editable-page slugs. Add new ones here as pages are made editable. */
export type EditablePageSlug = "about-mission-vision" | "about-who-we-are";

// ───────── Board Assignments (dynamic Who We Are) ─────────

export type BoardCategory = "BOARD" | "ADVISORY" | "LEADERSHIP" | "MANAGEMENT";

export type ApiBoardAssignment = {
  id: string;
  userId: string;
  fullName: string;
  fullNameBn: string | null;
  slug: string | null;
  avatarUrl: string | null;
  email: string | null;
  bio: string | null;
  bioBn: string | null;
  roleLabel: string;
  roleLabelBn: string | null;
  category: BoardCategory;
  order: number;
  isActive: boolean;
};

export type ApiBoardGroups = {
  board: ApiBoardAssignment[];
  advisory: ApiBoardAssignment[];
  leadership: ApiBoardAssignment[];
  management: ApiBoardAssignment[];
};

export type AdminCreateAssignmentInput = {
  userId: string;
  category: BoardCategory;
  roleLabel: string;
  roleLabelBn?: string;
};

export type AdminUpdateAssignmentInput = {
  roleLabel?: string;
  roleLabelBn?: string | null;
  category?: BoardCategory;
  isActive?: boolean;
};

export type AdminReorderAssignmentsInput = {
  category: BoardCategory;
  items: Array<{ id: string; order: number }>;
};

// ───────── Public user profile (Who We Are member detail) ─────────

export type ApiPublicUser = {
  id: string;
  slug: string | null;
  fullName: string;
  profile: {
    avatarUrl: string | null;
    bio: string | null;
    bioBn: string | null;
    fullNameBn: string | null;
  } | null;
  boardAssignments: Array<{
    id: string;
    category: BoardCategory;
    roleLabel: string;
    roleLabelBn: string | null;
    order: number;
    isActive: boolean;
  }>;
};
