import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiAdminStory,
  ApiAdminStoryListItem,
  AdminStoryWriteInput,
  StoryStatus,
} from "@/types/stories";
import type { Paginated } from "@/types/api";

type AdminStoryListQuery = {
  searchTerm?: string;
  status?: StoryStatus | "ALL";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const adminStoriesApiSlice = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (build) => ({
    adminListStories: build.query<Paginated<ApiAdminStoryListItem>, AdminStoryListQuery>({
      query: (params = {}) => {
        const p = { ...params };
        if (p.status === "ALL") delete p.status;
        return { url: "/admin/stories", params: p };
      },
      providesTags: ["AdminStories"],
    }),

    adminGetStory: build.query<ApiAdminStory, string>({
      query: (id) => `/admin/stories/${id}`,
      providesTags: (_r, _e, id) => [{ type: "AdminStories", id }],
    }),

    adminCreateStory: build.mutation<ApiAdminStory, AdminStoryWriteInput>({
      query: (body) => ({ url: "/admin/stories", method: "POST", body }),
      invalidatesTags: ["AdminStories", "Stories"],
    }),

    adminUpdateStory: build.mutation<ApiAdminStory, { id: string; data: Partial<AdminStoryWriteInput> }>({
      query: ({ id, data }) => ({ url: `/admin/stories/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "AdminStories", id }, "AdminStories", "Stories"],
    }),

    adminApproveStory: build.mutation<void, { id: string; publishNow?: boolean }>({
      query: ({ id, publishNow }) => ({ url: `/admin/stories/${id}/approve`, method: "POST", body: { publishNow } }),
      invalidatesTags: ["AdminStories", "Stories"],
    }),

    adminRejectStory: build.mutation<void, { id: string; rejectionNote: string }>({
      query: ({ id, rejectionNote }) => ({ url: `/admin/stories/${id}/reject`, method: "POST", body: { rejectionNote } }),
      invalidatesTags: ["AdminStories", "Stories"],
    }),

    adminPublishStory: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/stories/${id}/publish`, method: "POST" }),
      invalidatesTags: ["AdminStories", "Stories"],
    }),

    adminArchiveStory: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/stories/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminStories", "Stories"],
    }),
  }),
});

export const {
  useAdminListStoriesQuery,
  useAdminGetStoryQuery,
  useAdminCreateStoryMutation,
  useAdminUpdateStoryMutation,
  useAdminApproveStoryMutation,
  useAdminRejectStoryMutation,
  useAdminPublishStoryMutation,
  useAdminArchiveStoryMutation,
} = adminStoriesApiSlice;
