import { baseApi } from "@/redux/api/baseApi";
import type { ApiAdminEvent, AdminEventWriteInput } from "@/types/events";

const adminEventsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminListEvents: build.query<ApiAdminEvent[], void>({
      query: () => "/admin/events",
      providesTags: ["AdminEvents"],
    }),

    adminCreateEvent: build.mutation<ApiAdminEvent, AdminEventWriteInput>({
      query: (body) => ({ url: "/admin/events", method: "POST", body }),
      invalidatesTags: ["AdminEvents", "Events"],
    }),

    adminUpdateEvent: build.mutation<ApiAdminEvent, { id: string; data: Partial<AdminEventWriteInput> }>({
      query: ({ id, data }) => ({ url: `/admin/events/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["AdminEvents", "Events"],
    }),

    adminDeleteEvent: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/events/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminEvents", "Events"],
    }),
  }),
});

export const {
  useAdminListEventsQuery,
  useAdminCreateEventMutation,
  useAdminUpdateEventMutation,
  useAdminDeleteEventMutation,
} = adminEventsApiSlice;
