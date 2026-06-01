import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiStoryListItem,
  ApiStory,
  ApiMyStory,
  StorySubmissionInput,
  StoryStatus,
} from "@/types/stories";
import type { Paginated } from "@/types/api";

type StoryListQuery = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const storiesApiSlice = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (build) => ({
    getStories: build.query<Paginated<ApiStoryListItem>, StoryListQuery>({
      query: (params = {}) => ({ url: "/stories", params }),
      providesTags: ["Stories"],
    }),

    getStoryBySlug: build.query<ApiStory, string>({
      query: (slug) => `/stories/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: "Stories", id: slug }],
    }),

    getMyStories: build.query<Paginated<ApiMyStory>, StoryListQuery>({
      query: (params = {}) => ({ url: "/stories/mine", params }),
      providesTags: ["Stories"],
    }),

    submitStory: build.mutation<
      { id: string; slug: string; name: string; status: StoryStatus; createdAt: string },
      StorySubmissionInput
    >({
      query: (body) => ({ url: "/stories", method: "POST", body }),
      invalidatesTags: ["Stories"],
    }),
  }),
});

export const {
  useGetStoriesQuery,
  useGetStoryBySlugQuery,
  useGetMyStoriesQuery,
  useSubmitStoryMutation,
} = storiesApiSlice;

export { storiesApiSlice };
