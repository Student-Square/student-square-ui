import { baseApi } from "@/redux/api/baseApi";
import type {
  ModerationQueue,
  ModerationStats,
  AdminComment,
  AdminCommentListQuery,
} from "@/types/moderation";
import type { Paginated } from "@/types/api";

const moderationApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    moderationQueue: build.query<ModerationQueue, { type?: "story" | "comment" | "all"; limit?: number } | void>({
      query: (params) => ({ url: "/admin/moderation/queue", params: params ?? {} }),
      providesTags: ["AdminComments", "AdminStories"],
    }),

    moderationStats: build.query<ModerationStats, void>({
      query: () => "/admin/moderation/stats",
      providesTags: ["AdminComments", "AdminStories"],
    }),

    adminListComments: build.query<Paginated<AdminComment>, AdminCommentListQuery | void>({
      query: (params = {}) => {
        const p: Record<string, unknown> = { ...params };
        if (p.status === "ALL") delete p.status;
        return { url: "/admin/comments", params: p };
      },
      providesTags: ["AdminComments"],
    }),

    adminApproveComment: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/comments/${id}/approve`, method: "POST" }),
      invalidatesTags: ["AdminComments", "Comments"],
    }),

    adminRejectComment: build.mutation<void, { id: string; rejectionNote?: string }>({
      query: ({ id, rejectionNote }) => ({
        url: `/admin/comments/${id}/reject`,
        method: "POST",
        body: rejectionNote ? { rejectionNote } : {},
      }),
      invalidatesTags: ["AdminComments", "Comments"],
    }),

    adminMarkSpamComment: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/comments/${id}/mark-spam`, method: "POST" }),
      invalidatesTags: ["AdminComments", "Comments"],
    }),
  }),
});

export const {
  useModerationQueueQuery,
  useModerationStatsQuery,
  useAdminListCommentsQuery,
  useAdminApproveCommentMutation,
  useAdminRejectCommentMutation,
  useAdminMarkSpamCommentMutation,
} = moderationApiSlice;
