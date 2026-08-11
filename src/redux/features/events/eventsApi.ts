import { baseApi } from "@/redux/api/baseApi";
import type { ApiEvent } from "@/types/events";
import type { Paginated } from "@/types/api";

const eventsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<
      Paginated<ApiEvent>,
      { when?: "upcoming" | "past" | "all"; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/events", params: params ?? {} }),
      providesTags: ["Events"],
    }),

    getEventBySlug: build.query<ApiEvent, string>({
      query: (slug) => `/events/${encodeURIComponent(slug)}`,
      providesTags: (_r, _e, slug) => [{ type: "Events", id: slug }],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventBySlugQuery } = eventsApiSlice;
