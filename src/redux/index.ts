// Store
export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

// Hooks
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";

// Auth
export { setUser, logout, setStatus, selectCurrentUser, selectAuthStatus, selectIsAuthenticated, selectUserRole } from "./features/auth/authSlice";
export {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} from "./features/auth/authApi";

// Blogs
export {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
} from "./features/blogs/blogsApi";

// Stories
export {
  useGetStoriesQuery,
  useGetStoryBySlugQuery,
  useGetMyStoriesQuery,
  useSubmitStoryMutation,
} from "./features/stories/storiesApi";

// Campaigns
export {
  useGetCampaignsQuery,
  useGetCampaignBySlugQuery,
} from "./features/campaigns/campaignsApi";

// Content
export {
  useGetCardsQuery,
  useGetPageSectionsQuery,
  useGetBoardMembersQuery,
  useGetBoardMemberBySlugQuery,
  useGetSiteSettingsQuery,
} from "./features/content/contentApi";

// Comments
export {
  useGetCommentsQuery,
  useGetMyCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "./features/comments/commentsApi";

// Profile
export {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "./features/profile/profileApi";

// Notifications
export {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "./features/notifications/notificationsApi";
