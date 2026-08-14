import { baseApi } from "@/redux/api/baseApi";
import type { ApiAdminEvent, AdminEventWriteInput } from "@/types/events";
import type { Paginated } from "@/types/api";

const adminEventsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminListEvents: build.query<
      Paginated<ApiAdminEvent>,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({ url: "/admin/events", params: params ?? {} }),
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
