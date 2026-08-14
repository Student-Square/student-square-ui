import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiFeatureCard,
  ApiPageSection,
  ApiSiteSettings,
  HeroSlot,
  AdminFeatureCard,
  AdminCreateCardInput,
  AdminUpdateCardInput,
  AdminListCardsParams,
  ApiUpload,
  ApiEditablePage,
  ApiPageBodySection,
  AdminUpdateEditablePageInput,
  EditablePageSlug,
  ApiBoardMember,
  ApiBoardGroups,
  ApiBoardAssignment,
  ApiPublicUser,
  AdminCreateAssignmentInput,
  AdminUpdateAssignmentInput,
  AdminReorderAssignmentsInput,
  BoardCategory,
} from "@/types/content";

/**
 * Editable-page response adapter.
 *
 * The frontend contract is ApiEditablePage:
 *   { slug, heroTitle, bannerUrl, bannerAlt, sections[], updatedAt }
 *
 * The backend may legitimately return either:
 *   (a) That exact shape — pass through unchanged.
 *   (b) Raw PageSection rows for the slug — assemble per the seed contract:
 *         sectionKey "banner"  → { url, alt }
 *         sectionKey "hero"    → { title }
 *         sectionKey "body-*"  → { heading, body }   (order from row.order)
 *
 * Returning the proper shape from the server is preferable long-term; this
 * adapter just keeps the editor working while that endpoint is being built.
 */
type RawSectionRow = {
  id: string;
  pageSlug: string;
  sectionKey: string;
  content: Record<string, unknown> | null;
  order: number;
  updatedAt?: string;
};

function isAssembledPage(x: unknown): x is ApiEditablePage {
  return (
    !!x &&
    typeof x === "object" &&
    "heroTitle" in (x as Record<string, unknown>) &&
    "sections" in (x as Record<string, unknown>)
  );
}

function isSectionRowArray(x: unknown): x is RawSectionRow[] {
  return (
    Array.isArray(x) &&
    (x.length === 0 ||
      (typeof x[0] === "object" &&
        x[0] !== null &&
        "sectionKey" in (x[0] as Record<string, unknown>)))
  );
}

function assembleEditablePage(
  rows: RawSectionRow[],
  slug: EditablePageSlug
): ApiEditablePage {
  let heroTitle = "";
  let bannerUrl: string | null = null;
  let bannerAlt: string | null = null;
  let latestUpdate = "";

  // Dedupe by sectionKey — that's the natural unique key for {pageSlug, sectionKey}
  // in the PageSection table. If duplicates arrive, the LAST one wins (treating
  // it as the most recent value).
  const bodyByKey = new Map<string, ApiPageBodySection>();
  // Track a fallback id counter so missing/duplicate row ids still produce
  // unique section ids (used as React keys downstream).
  let synthCounter = 0;

  for (const row of rows) {
    const c = (row.content ?? {}) as Record<string, unknown>;
    if (row.updatedAt && row.updatedAt > latestUpdate) latestUpdate = row.updatedAt;

    if (row.sectionKey === "banner") {
      bannerUrl = (c.url as string | null | undefined) ?? null;
      bannerAlt = (c.alt as string | null | undefined) ?? null;
    } else if (row.sectionKey === "hero") {
      heroTitle = (c.title as string | undefined) ?? "";
    } else if (row.sectionKey.startsWith("body-")) {
      // Prefer the row's own id; fall back to sectionKey if that's missing/dup;
      // last resort, a synthetic id keyed by position in this assembly pass.
      const id =
        (typeof row.id === "string" && row.id.length > 0 && row.id) ||
        row.sectionKey ||
        `synth-${synthCounter++}`;
      bodyByKey.set(row.sectionKey, {
        id,
        heading: (c.heading as string | undefined) ?? "",
        body: (c.body as string | undefined) ?? "",
        order: row.order,
      });
    }
  }

  const sections = Array.from(bodyByKey.values()).sort(
    (a, b) => a.order - b.order
  );

  return {
    slug,
    heroTitle,
    bannerUrl,
    bannerAlt,
    sections,
    updatedAt: latestUpdate || new Date(0).toISOString(),
  };
}

/** Ensure every section has a unique, non-empty id (used as React key). */
function normaliseSectionIds(
  raw: unknown
): ApiPageBodySection[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: ApiPageBodySection[] = [];
  let synth = 0;
  for (const s of raw) {
    if (!s || typeof s !== "object") continue;
    const src = s as Partial<ApiPageBodySection>;
    let id = typeof src.id === "string" && src.id.length > 0 ? src.id : "";
    while (!id || seen.has(id)) {
      id = `synth-${synth++}`;
    }
    seen.add(id);
    out.push({
      id,
      heading: typeof src.heading === "string" ? src.heading : "",
      body: typeof src.body === "string" ? src.body : "",
      order: typeof src.order === "number" ? src.order : out.length,
    });
  }
  return out.sort((a, b) => a.order - b.order);
}

function adaptEditablePageResponse(
  raw: unknown,
  slug: EditablePageSlug
): ApiEditablePage {
  if (isAssembledPage(raw)) {
    return {
      slug,
      heroTitle: raw.heroTitle ?? "",
      bannerUrl: raw.bannerUrl ?? null,
      bannerAlt: raw.bannerAlt ?? null,
      sections: normaliseSectionIds(raw.sections),
      updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
    };
  }
  if (isSectionRowArray(raw)) {
    return assembleEditablePage(raw, slug);
  }
  return {
    slug,
    heroTitle: "",
    bannerUrl: null,
    bannerAlt: null,
    sections: [],
    updatedAt: new Date(0).toISOString(),
  };
}

const contentApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ───── Public ─────
    getCards: build.query<ApiFeatureCard[], { slot?: HeroSlot } | void>({
      query: (params) => ({ url: "/content/cards", params: params ?? {} }),
      providesTags: ["Cards"],
    }),

    // Raw rows. /content/pages/:slug returns the assembled ApiEditablePage
    // instead, which drops sections that aren't banner/hero/body-N.
    getPageSections: build.query<ApiPageSection[], string>({
      query: (pageSlug) => `/content/sections/${encodeURIComponent(pageSlug)}`,
      providesTags: (_result, _err, slug) => [{ type: "Content", id: slug }],
    }),

    getBoardMembers: build.query<ApiBoardMember[], { category?: string } | void>({
      query: (params) => ({ url: "/content/board", params: params ?? {} }),
      providesTags: ["Board"],
    }),

    getBoardMemberBySlug: build.query<ApiBoardMember, string>({
      query: (slug) => `/content/board/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: "Board", id: slug }],
    }),

    getSiteSettings: build.query<ApiSiteSettings, void>({
      query: () => "/content/settings",
      providesTags: ["SiteSettings"],
    }),

    // ───── Admin: hero feature cards ─────
    adminListCards: build.query<AdminFeatureCard[], AdminListCardsParams | void>({
      query: (params) => ({ url: "/admin/content/cards", params: params ?? {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "AdminCards" as const, id: c.id })),
              { type: "AdminCards" as const, id: "LIST" },
            ]
          : [{ type: "AdminCards" as const, id: "LIST" }],
    }),

    adminGetCard: build.query<AdminFeatureCard, string>({
      query: (id) => `/admin/content/cards/${encodeURIComponent(id)}`,
      providesTags: (_r, _e, id) => [{ type: "AdminCards" as const, id }],
    }),

    adminCreateCard: build.mutation<AdminFeatureCard, AdminCreateCardInput>({
      query: (body) => ({
        url: "/admin/content/cards",
        method: "POST",
        body,
      }),
      // New row may affect both the admin list and the public hero
      invalidatesTags: [{ type: "AdminCards", id: "LIST" }, "Cards"],
    }),

    adminUpdateCard: build.mutation<
      AdminFeatureCard,
      { id: string; data: AdminUpdateCardInput }
    >({
      query: ({ id, data }) => ({
        url: `/admin/content/cards/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminCards", id },
        { type: "AdminCards", id: "LIST" },
        "Cards",
      ],
    }),

    adminDeleteCard: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/admin/content/cards/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "AdminCards", id },
        { type: "AdminCards", id: "LIST" },
        "Cards",
      ],
    }),

    adminReorderCards: build.mutation<
      AdminFeatureCard[],
      { slot: HeroSlot; order: Array<{ id: string; order: number }> }
    >({
      query: (body) => ({
        url: "/admin/content/cards/reorder",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AdminCards", id: "LIST" }, "Cards"],
    }),

    adminUploadCardImage: build.mutation<ApiUpload, FormData>({
      query: (formData) => ({
        url: "/admin/media",
        method: "POST",
        body: formData,
      }),
    }),

    // ───── Editable pages (About, etc.) ─────
    getEditablePage: build.query<ApiEditablePage, EditablePageSlug>({
      query: (slug) => `/content/pages/${encodeURIComponent(slug)}`,
      transformResponse: (raw: unknown, _meta, slug: EditablePageSlug) =>
        adaptEditablePageResponse(raw, slug),
      providesTags: (_r, _e, slug) => [{ type: "Pages", id: slug }],
    }),

    adminGetEditablePage: build.query<ApiEditablePage, EditablePageSlug>({
      query: (slug) => `/admin/content/pages/${encodeURIComponent(slug)}`,
      transformResponse: (raw: unknown, _meta, slug: EditablePageSlug) =>
        adaptEditablePageResponse(raw, slug),
      providesTags: (_r, _e, slug) => [{ type: "AdminPages", id: slug }],
    }),

    adminUpdateEditablePage: build.mutation<
      ApiEditablePage,
      { slug: EditablePageSlug; data: AdminUpdateEditablePageInput }
    >({
      query: ({ slug, data }) => ({
        url: `/admin/content/pages/${encodeURIComponent(slug)}`,
        method: "PATCH",
        body: data,
      }),
      // Invalidate both the public + admin caches for this slug
      invalidatesTags: (_r, _e, { slug }) => [
        { type: "AdminPages", id: slug },
        { type: "Pages", id: slug },
      ],
    }),

    /** Generic upload used by the page editor's banner image picker. */
    adminUploadPageImage: build.mutation<ApiUpload, FormData>({
      query: (formData) => ({
        url: "/admin/content/uploads",
        method: "POST",
        body: formData,
      }),
    }),

    // ───── Public board groups ─────
    getBoardGroups: build.query<ApiBoardGroups, void>({
      query: () => "/content/board/groups",
      providesTags: ["Board"],
    }),

    getPublicUserBySlug: build.query<ApiPublicUser, string>({
      query: (slug) => `/content/users/${encodeURIComponent(slug)}`,
      providesTags: (_r, _e, slug) => [{ type: "Board", id: slug }],
    }),

    // ───── Admin board assignments ─────
    adminListAssignments: build.query<ApiBoardAssignment[], { category?: BoardCategory } | void>({
      query: (params) => ({ url: "/admin/content/board/assignments", params: params ?? {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "AdminBoard" as const, id: a.id })),
              { type: "AdminBoard" as const, id: "LIST" },
            ]
          : [{ type: "AdminBoard" as const, id: "LIST" }],
    }),

    adminCreateAssignment: build.mutation<ApiBoardAssignment, AdminCreateAssignmentInput>({
      query: (body) => ({ url: "/admin/content/board/assignments", method: "POST", body }),
      invalidatesTags: [{ type: "AdminBoard", id: "LIST" }, "Board"],
    }),

    adminUpdateAssignment: build.mutation<ApiBoardAssignment, { id: string; data: AdminUpdateAssignmentInput }>({
      query: ({ id, data }) => ({ url: `/admin/content/board/assignments/${encodeURIComponent(id)}`, method: "PATCH", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "AdminBoard", id }, { type: "AdminBoard", id: "LIST" }, "Board"],
    }),

    adminDeleteAssignment: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/content/board/assignments/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [{ type: "AdminBoard", id }, { type: "AdminBoard", id: "LIST" }, "Board"],
    }),

    adminReorderAssignments: build.mutation<void, AdminReorderAssignmentsInput>({
      query: (body) => ({ url: "/admin/content/board/assignments/reorder", method: "POST", body }),
      invalidatesTags: [{ type: "AdminBoard", id: "LIST" }, "Board"],
    }),
  }),
});

export const {
  // public
  useGetCardsQuery,
  useGetPageSectionsQuery,
  useGetSiteSettingsQuery,
  useGetBoardGroupsQuery,
  useGetPublicUserBySlugQuery,
  // admin
  useAdminListCardsQuery,
  useAdminGetCardQuery,
  useAdminCreateCardMutation,
  useAdminUpdateCardMutation,
  useAdminDeleteCardMutation,
  useAdminReorderCardsMutation,
  useAdminUploadCardImageMutation,
  // editable pages
  useGetEditablePageQuery,
  useAdminGetEditablePageQuery,
  useAdminUpdateEditablePageMutation,
  useAdminUploadPageImageMutation,
  // board assignments
  useAdminListAssignmentsQuery,
  useAdminCreateAssignmentMutation,
  useAdminUpdateAssignmentMutation,
  useAdminDeleteAssignmentMutation,
  useAdminReorderAssignmentsMutation,
} = contentApiSlice;

export { contentApiSlice };
