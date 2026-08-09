import { baseApi } from "@/redux/api/baseApi";
import type {
  FinanceEntry,
  FinanceEntryInput,
  PaginatedFinance,
} from "@/types/finance";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export async function downloadFinanceExport(path: string, filename: string) {
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

const financeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listMyFinance: build.query<
      PaginatedFinance,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/finance/mine", params: params ?? {} }),
      providesTags: [{ type: "Finance", id: "MINE" }],
    }),

    createFinanceEntry: build.mutation<FinanceEntry, FinanceEntryInput>({
      query: (body) => ({ url: "/finance", method: "POST", body }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),

    updateFinanceEntry: build.mutation<
      FinanceEntry,
      { id: string; data: Partial<FinanceEntryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/finance/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),

    deleteFinanceEntry: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/finance/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),

    adminListFinance: build.query<
      PaginatedFinance,
      { q?: string; from?: string; to?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/finance",
        params: params ?? {},
      }),
      providesTags: [{ type: "AdminFinance", id: "LIST" }],
    }),

    adminUpdateFinanceEntry: build.mutation<
      FinanceEntry,
      { id: string; data: Partial<FinanceEntryInput> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/finance/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),

    adminDeleteFinanceEntry: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/admin/finance/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListMyFinanceQuery,
  useCreateFinanceEntryMutation,
  useUpdateFinanceEntryMutation,
  useDeleteFinanceEntryMutation,
  useAdminListFinanceQuery,
  useAdminUpdateFinanceEntryMutation,
  useAdminDeleteFinanceEntryMutation,
} = financeApi;

export { financeApi };
