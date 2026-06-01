import { baseApi } from "@/redux/api/baseApi";
import type { ApiNotification, NotificationsListResponse } from "@/types/notifications";

type NotificationListQuery = {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
};

const notificationsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationsListResponse, NotificationListQuery>({
      query: (params = {}) => ({ url: "/notifications", params }),
      providesTags: ["Notifications"],
    }),

    markNotificationRead: build.mutation<ApiNotification, string>({
      query: (id) => ({
        url: `/notifications/${encodeURIComponent(id)}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllNotificationsRead: build.mutation<{ updated: number }, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApiSlice;

export { notificationsApiSlice };
