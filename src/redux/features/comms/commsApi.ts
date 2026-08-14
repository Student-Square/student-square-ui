import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminResource,
  Audience,
  AudiencePreview,
  BookmarkRefType,
  Campaign,
  CampaignChannel,
  CommsVariable,
  Feedback,
  FeedbackKind,
  FeedbackStatus,
  NotificationPreference,
  NotificationTemplate,
  PersonalNote,
  Resource,
  SavedItems,
  SignedFile,
  Suppression,
  Thread,
  ThreadMessage,
  ThreadSummary,
} from "@/types/comms";
import type { UserRole } from "@/types/auth";

const enc = encodeURIComponent;

const commsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ----- messaging -----

    getThreads: build.query<ThreadSummary[], void>({
      query: () => ({ url: "/messaging" }),
      providesTags: [{ type: "Messaging", id: "LIST" }],
    }),

    openThread: build.mutation<{ id: string }, string>({
      query: (userId) => ({ url: "/messaging", method: "POST", body: { userId } }),
      invalidatesTags: [{ type: "Messaging", id: "LIST" }],
    }),

    getThread: build.query<Thread, string>({
      query: (id) => ({ url: `/messaging/${enc(id)}` }),
      providesTags: (_r, _e, id) => [
        { type: "Messaging", id },
        { type: "Messaging", id: "LIST" },
      ],
    }),

    /**
     * Sent as multipart so the same endpoint carries optional attachments.
     * `fetchBaseQuery` leaves the Content-Type unset for FormData, which is
     * required — setting it manually drops the multipart boundary.
     */
    sendMessage: build.mutation<
      ThreadMessage,
      { threadId: string; body: string; internal?: boolean; files?: File[] }
    >({
      query: ({ threadId, body, internal, files }) => {
        const form = new FormData();
        form.append("body", body);
        if (internal) form.append("internal", "true");
        for (const file of files ?? []) form.append("files", file);

        return {
          url: `/messaging/${enc(threadId)}/messages`,
          method: "POST",
          body: form,
        };
      },
      invalidatesTags: (_r, _e, { threadId }) => [
        { type: "Messaging", id: threadId },
        { type: "Messaging", id: "LIST" },
      ],
    }),

    getAttachmentUrl: build.mutation<SignedFile, string>({
      query: (id) => ({ url: `/messaging/attachments/${enc(id)}` }),
    }),

    setThreadClosed: build.mutation<unknown, { id: string; closed: boolean }>({
      query: ({ id, closed }) => ({
        url: `/messaging/${enc(id)}/closed`,
        method: "PATCH",
        body: { closed },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Messaging", id },
        { type: "Messaging", id: "LIST" },
      ],
    }),

    getPersonalNote: build.query<PersonalNote, void>({
      query: () => ({ url: "/messaging/notes" }),
      providesTags: [{ type: "Messaging", id: "NOTES" }],
    }),

    savePersonalNote: build.mutation<{ updatedAt: string }, string>({
      query: (body) => ({ url: "/messaging/notes", method: "PUT", body: { body } }),
      invalidatesTags: [{ type: "Messaging", id: "NOTES" }],
    }),

    // ----- feedback -----

    submitFeedback: build.mutation<
      Feedback,
      {
        kind: FeedbackKind;
        rating?: number;
        subject: string;
        body: string;
        context?: string;
      }
    >({
      query: (body) => ({ url: "/feedback", method: "POST", body }),
      invalidatesTags: [{ type: "Feedback", id: "MINE" }],
    }),

    getMyFeedback: build.query<Feedback[], void>({
      query: () => ({ url: "/feedback/me" }),
      providesTags: [{ type: "Feedback", id: "MINE" }],
    }),

    getAdminFeedback: build.query<
      { meta: { total: number; page: number; limit: number }; data: Feedback[] },
      { status?: FeedbackStatus; kind?: FeedbackKind; search?: string; page?: string } | void
    >({
      query: (args) => ({ url: "/admin/feedback", params: args ?? undefined }),
      providesTags: [{ type: "Feedback", id: "ADMIN" }],
    }),

    reviewFeedback: build.mutation<
      Feedback,
      { id: string; status: FeedbackStatus; response?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/feedback/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Feedback", id: "ADMIN" }],
    }),

    // ----- resources + bookmarks -----

    getResources: build.query<Resource[], { category?: string } | void>({
      query: (args) => ({ url: "/resources", params: args ?? undefined }),
      providesTags: [{ type: "Resources", id: "LIST" }],
    }),

    getResourceCategories: build.query<string[], void>({
      query: () => ({ url: "/resources/categories" }),
      providesTags: [{ type: "Resources", id: "CATEGORIES" }],
    }),

    getResourceFileUrl: build.mutation<SignedFile, string>({
      query: (id) => ({ url: `/resources/${enc(id)}/file` }),
    }),

    getSavedItems: build.query<SavedItems, void>({
      query: () => ({ url: "/resources/bookmarks" }),
      providesTags: [{ type: "Resources", id: "SAVED" }],
    }),

    toggleBookmark: build.mutation<
      { bookmarked: boolean },
      { refType: BookmarkRefType; refId: string }
    >({
      query: (body) => ({ url: "/resources/bookmarks", method: "POST", body }),
      invalidatesTags: [
        { type: "Resources", id: "SAVED" },
        { type: "Resources", id: "LIST" },
      ],
    }),

    // ----- resources (admin) -----

    getAdminResources: build.query<AdminResource[], void>({
      query: () => ({ url: "/admin/resources" }),
      providesTags: [{ type: "Resources", id: "ADMIN" }],
    }),

    createResource: build.mutation<
      AdminResource,
      {
        title: string;
        titleBn?: string;
        description?: string;
        type: Resource["type"];
        url?: string;
        category?: string;
        published?: boolean;
        file?: File;
      }
    >({
      query: ({ file, ...fields }) => {
        const form = new FormData();
        for (const [key, value] of Object.entries(fields)) {
          if (value !== undefined && value !== "") form.append(key, String(value));
        }
        if (file) form.append("file", file);
        return { url: "/admin/resources", method: "POST", body: form };
      },
      invalidatesTags: [
        { type: "Resources", id: "ADMIN" },
        { type: "Resources", id: "LIST" },
      ],
    }),

    updateResource: build.mutation<
      AdminResource,
      { id: string } & Partial<{
        title: string;
        description: string | null;
        category: string | null;
        published: boolean;
        order: number;
      }>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/resources/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Resources", id: "ADMIN" },
        { type: "Resources", id: "LIST" },
      ],
    }),

    deleteResource: build.mutation<unknown, string>({
      query: (id) => ({ url: `/admin/resources/${enc(id)}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Resources", id: "ADMIN" },
        { type: "Resources", id: "LIST" },
      ],
    }),

    assignResource: build.mutation<
      unknown,
      { id: string; userId?: string; role?: UserRole }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/resources/${enc(id)}/assignments`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Resources", id: "ADMIN" }],
    }),

    unassignResource: build.mutation<unknown, string>({
      query: (assignmentId) => ({
        url: `/admin/resources/assignments/${enc(assignmentId)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Resources", id: "ADMIN" }],
    }),

    // ----- notification preferences + unsubscribe -----

    getNotificationPreferences: build.query<NotificationPreference[], void>({
      query: () => ({ url: "/comms/preferences" }),
      providesTags: [{ type: "Comms", id: "PREFERENCES" }],
    }),

    setNotificationPreference: build.mutation<
      unknown,
      { type: string; channel: "IN_APP" | "EMAIL"; enabled: boolean }
    >({
      query: (body) => ({ url: "/comms/preferences", method: "PATCH", body }),
      invalidatesTags: [{ type: "Comms", id: "PREFERENCES" }],
    }),

    unsubscribe: build.mutation<{ email: string }, { e: string; t: string }>({
      query: (params) => ({ url: "/comms/unsubscribe", params }),
      extraOptions: { silent: true },
    }),

    // ----- templates -----

    getTemplates: build.query<NotificationTemplate[], void>({
      query: () => ({ url: "/admin/comms/templates" }),
      providesTags: [{ type: "Comms", id: "TEMPLATES" }],
    }),

    getCommsVariables: build.query<CommsVariable[], void>({
      query: () => ({ url: "/admin/comms/templates/variables" }),
      providesTags: [{ type: "Comms", id: "VARIABLES" }],
    }),

    createTemplate: build.mutation<
      NotificationTemplate,
      { key: string; name: string; subject: string; bodyHtml: string }
    >({
      query: (body) => ({ url: "/admin/comms/templates", method: "POST", body }),
      invalidatesTags: [{ type: "Comms", id: "TEMPLATES" }],
    }),

    updateTemplate: build.mutation<
      NotificationTemplate,
      { id: string } & Partial<{
        name: string;
        subject: string;
        bodyHtml: string;
        active: boolean;
      }>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/comms/templates/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Comms", id: "TEMPLATES" }],
    }),

    // ----- campaigns -----

    getCampaigns: build.query<Campaign[], void>({
      query: () => ({ url: "/admin/comms/campaigns" }),
      providesTags: [{ type: "Comms", id: "CAMPAIGNS" }],
    }),

    getCampaign: build.query<Campaign, string>({
      query: (id) => ({ url: `/admin/comms/campaigns/${enc(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "Comms", id }],
    }),

    previewAudience: build.mutation<AudiencePreview, Audience>({
      query: (body) => ({
        url: "/admin/comms/campaigns/audience",
        method: "POST",
        body,
      }),
    }),

    createCampaign: build.mutation<
      Campaign,
      {
        name: string;
        subject: string;
        bodyHtml: string;
        channel?: CampaignChannel;
        audience?: Audience;
      }
    >({
      query: (body) => ({ url: "/admin/comms/campaigns", method: "POST", body }),
      invalidatesTags: [{ type: "Comms", id: "CAMPAIGNS" }],
    }),

    updateCampaign: build.mutation<
      Campaign,
      { id: string } & Partial<{
        name: string;
        subject: string;
        bodyHtml: string;
        channel: CampaignChannel;
        audience: Audience;
      }>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/comms/campaigns/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Comms", id },
        { type: "Comms", id: "CAMPAIGNS" },
      ],
    }),

    testSendCampaign: build.mutation<{ sentTo: string }, string>({
      query: (id) => ({
        url: `/admin/comms/campaigns/${enc(id)}/test`,
        method: "POST",
      }),
    }),

    submitCampaign: build.mutation<
      { needsApproval: boolean; recipientCount: number },
      string
    >({
      query: (id) => ({
        url: `/admin/comms/campaigns/${enc(id)}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Comms", id },
        { type: "Comms", id: "CAMPAIGNS" },
      ],
    }),

    approveCampaign: build.mutation<
      Campaign,
      { id: string; approved: boolean; reason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/comms/campaigns/${enc(id)}/approve`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Comms", id },
        { type: "Comms", id: "CAMPAIGNS" },
      ],
    }),

    startCampaign: build.mutation<Campaign, string>({
      query: (id) => ({
        url: `/admin/comms/campaigns/${enc(id)}/send`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Comms", id },
        { type: "Comms", id: "CAMPAIGNS" },
      ],
    }),

    cancelCampaign: build.mutation<Campaign, string>({
      query: (id) => ({
        url: `/admin/comms/campaigns/${enc(id)}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Comms", id },
        { type: "Comms", id: "CAMPAIGNS" },
      ],
    }),

    getSuppressions: build.query<Suppression[], void>({
      query: () => ({ url: "/admin/comms/suppressions" }),
      providesTags: [{ type: "Comms", id: "SUPPRESSIONS" }],
    }),

    removeSuppression: build.mutation<unknown, string>({
      query: (email) => ({
        url: "/admin/comms/suppressions",
        method: "DELETE",
        body: { email },
      }),
      invalidatesTags: [{ type: "Comms", id: "SUPPRESSIONS" }],
    }),
  }),
});

export const {
  useGetThreadsQuery,
  useOpenThreadMutation,
  useGetThreadQuery,
  useSendMessageMutation,
  useGetAttachmentUrlMutation,
  useSetThreadClosedMutation,
  useGetPersonalNoteQuery,
  useSavePersonalNoteMutation,
  useSubmitFeedbackMutation,
  useGetMyFeedbackQuery,
  useGetAdminFeedbackQuery,
  useReviewFeedbackMutation,
  useGetResourcesQuery,
  useGetResourceCategoriesQuery,
  useGetResourceFileUrlMutation,
  useGetSavedItemsQuery,
  useToggleBookmarkMutation,
  useGetAdminResourcesQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useAssignResourceMutation,
  useUnassignResourceMutation,
  useGetNotificationPreferencesQuery,
  useSetNotificationPreferenceMutation,
  useUnsubscribeMutation,
  useGetTemplatesQuery,
  useGetCommsVariablesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useGetCampaignsQuery,
  useGetCampaignQuery,
  usePreviewAudienceMutation,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useTestSendCampaignMutation,
  useSubmitCampaignMutation,
  useApproveCampaignMutation,
  useStartCampaignMutation,
  useCancelCampaignMutation,
  useGetSuppressionsQuery,
  useRemoveSuppressionMutation,
} = commsApi;

export default commsApi;
