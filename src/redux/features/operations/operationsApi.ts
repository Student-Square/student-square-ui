import { baseApi } from "@/redux/api/baseApi";
import type {
  OperationEntry,
  OperationEntryInput,
  OperationMemberOption,
  PaginatedOperations,
} from "@/types/operations";
import type { ExportFormat } from "@/types/finance";
import { bookQuery, type BookFilters } from "@/redux/features/finance/financeApi";

/** One path builder for both books, so the filters travel identically. */
export const operationExportPath = (
  scope: "mine" | "all",
  format: ExportFormat,
  filters?: BookFilters
) =>
  scope === "mine"
    ? `/operations/mine/export.${format}${bookQuery(filters)}`
    : `/admin/operations/export.${format}${bookQuery(filters)}`;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

/** Binary/CSV downloads bypass RTK JSON unwrap. */
export async function downloadOperationExport(
  path: string,
  filename: string
) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const operationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listMyOperations: build.query<
      PaginatedOperations,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/operations/mine", params: params ?? {} }),
      providesTags: [{ type: "Operations", id: "MINE" }],
    }),

    searchOperationMembers: build.query<OperationMemberOption[], string>({
      query: (q) => ({
        url: "/operations/members/search",
        params: { q },
      }),
    }),

    createOperation: build.mutation<OperationEntry, OperationEntryInput>({
      query: (body) => ({ url: "/operations", method: "POST", body }),
      invalidatesTags: [
        { type: "Operations", id: "MINE" },
        { type: "AdminOperations", id: "LIST" },
      ],
    }),

    updateOperation: build.mutation<
      OperationEntry,
      { id: string; data: Partial<OperationEntryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/operations/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        { type: "Operations", id: "MINE" },
        { type: "AdminOperations", id: "LIST" },
      ],
    }),

    deleteOperation: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/operations/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Operations", id: "MINE" },
        { type: "AdminOperations", id: "LIST" },
      ],
    }),

    adminListOperations: build.query<PaginatedOperations, BookFilters | void>({
      query: (params) => ({
        url: "/admin/operations",
        params: params ?? {},
      }),
      providesTags: [{ type: "AdminOperations", id: "LIST" }],
    }),
  }),
});

export const {
  useListMyOperationsQuery,
  useLazySearchOperationMembersQuery,
  useCreateOperationMutation,
  useUpdateOperationMutation,
  useDeleteOperationMutation,
  useAdminListOperationsQuery,
} = operationsApi;

export { operationsApi };
