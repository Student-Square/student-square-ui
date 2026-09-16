import { baseApi } from "@/redux/api/baseApi";
import type { Paginated } from "@/types/api";
import type {
  ApiReportDetail,
  ApiReportListItem,
  ReportFilterOptions,
  ReportListFilters,
} from "@/types/reports";

const reportApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query<Paginated<ApiReportListItem>, ReportListFilters | void>({
      query: (params) => ({ url: "/reports", params: params ?? {} }),
      providesTags: ["Reports"],
    }),

    getReportFilters: build.query<ReportFilterOptions, void>({
      query: () => "/reports/filters",
      providesTags: ["Reports"],
    }),

    getReport: build.query<ApiReportDetail, string>({
      query: (slug) => `/reports/${encodeURIComponent(slug)}`,
      providesTags: ["Reports"],
      // The detail page renders its own "not found" state.
      extraOptions: { silentOn404: true },
    }),
  }),
});

export const { useGetReportsQuery, useGetReportFiltersQuery, useGetReportQuery } = reportApiSlice;
