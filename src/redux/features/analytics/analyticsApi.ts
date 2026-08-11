import { baseApi } from "@/redux/api/baseApi";
import type { AnalyticsOverview } from "@/types/analytics";

const analyticsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalyticsOverview: build.query<AnalyticsOverview, { days?: number } | void>({
      query: (params) => ({ url: "/admin/analytics/overview", params: params ?? {} }),
    }),
  }),
});

export const { useGetAnalyticsOverviewQuery } = analyticsApiSlice;
