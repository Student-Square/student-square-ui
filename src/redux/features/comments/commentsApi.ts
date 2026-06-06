import { baseApi } from "@/redux/api/baseApi";
import type { ApiComment, ApiMyComment, CommentCreateInput, CommentStatus } from "@/types/comments";

type CommentListQuery = { blogPostId: string } | { storyId: string };

const commentsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<ApiComment[], CommentListQuery>({
      query: (params) => ({ url: "/comments", params }),
      providesTags: (_result, _err, params) => [
        { type: "Comments", id: "blogPostId" in params ? `blog-${params.blogPostId}` : `story-${params.storyId}` },
      ],
    }),

    getMyComments: build.query<ApiMyComment[], void>({
      query: () => "/comments/mine",
      providesTags: [{ type: "Comments", id: "mine" }],
    }),

    createComment: build.mutation<
      { id: string; body: string; status: CommentStatus; createdAt: string },
      CommentCreateInput
    >({
      query: (body) => ({ url: "/comments", method: "POST", body }),
      invalidatesTags: (_result, _err, input) => [
        {
          type: "Comments",
          id: input.blogPostId ? `blog-${input.blogPostId}` : `story-${input.storyId}`,
        },
      ],
    }),

    deleteComment: build.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/comments/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Comments", id: "mine" }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetMyCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApiSlice;

export { commentsApiSlice };
