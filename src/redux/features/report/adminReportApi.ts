import { baseApi } from "@/redux/api/baseApi";
import type { Paginated } from "@/types/api";
import type {
  AdminReportPatch,
  AdminReportWriteInput,
  ApiAdminReport,
  ReportCategory,
} from "@/types/reports";

/** Multipart body for the upload routes. Lists travel one entry per line (see report.utils.ts on the server). */
const toFormData = (fields: Record<string, unknown>, file?: File) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) form.append(key, value.join("\n"));
      continue;
    }
    form.append(key, String(value));
  }
  if (file) form.append("file", file);
  return form;
};

const adminReportApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminListReports: build.query<
      Paginated<ApiAdminReport>,
      { page?: number; limit?: number; searchTerm?: string; category?: ReportCategory } | void
    >({
      query: (params) => ({ url: "/admin/reports", params: params ?? {} }),
      providesTags: ["AdminReports"],
    }),

    adminCreateReport: build.mutation<ApiAdminReport, AdminReportWriteInput & { file: File }>({
      query: ({ file, ...fields }) => ({
        url: "/admin/reports",
        method: "POST",
        body: toFormData(fields, file),
      }),
      invalidatesTags: ["AdminReports", "Reports"],
    }),

    adminUpdateReport: build.mutation<ApiAdminReport, { id: string; data: AdminReportPatch }>({
      query: ({ id, data }) => ({ url: `/admin/reports/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["AdminReports", "Reports"],
    }),

    adminReplaceReportFile: build.mutation<ApiAdminReport, { id: string; file: File }>({
      query: ({ id, file }) => ({
        url: `/admin/reports/${id}/file`,
        method: "PUT",
        body: toFormData({}, file),
      }),
      invalidatesTags: ["AdminReports", "Reports"],
    }),

    adminDeleteReport: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/reports/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminReports", "Reports"],
    }),
  }),
});

export const {
  useAdminListReportsQuery,
  useAdminCreateReportMutation,
  useAdminUpdateReportMutation,
  useAdminReplaceReportFileMutation,
  useAdminDeleteReportMutation,
} = adminReportApiSlice;
