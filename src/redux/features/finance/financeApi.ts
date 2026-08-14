import { baseApi } from "@/redux/api/baseApi";
import type {
  BooksSummary,
  ExportFormat,
  FinanceEntry,
  FinanceEntryInput,
  FinancePeriodClose,
  Invoice,
  PaginatedFinance,
} from "@/types/finance";
import type { UserRole } from "@/types/auth";

export type BookFilters = {
  q?: string;
  userId?: string;
  panelScope?: UserRole;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

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

    adminListFinance: build.query<PaginatedFinance, BookFilters | void>({
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

    // --- period close (FR-13-010) ---

    listFinanceCloses: build.query<FinancePeriodClose[], { userId?: string } | void>({
      query: (params) => ({ url: "/finance/mine/closes", params: params ?? {} }),
      providesTags: [{ type: "Finance", id: "CLOSES" }],
    }),

    closeFinancePeriod: build.mutation<
      FinancePeriodClose,
      { userId: string; fromDate: string; toDate: string; note?: string }
    >({
      query: (body) => ({ url: "/admin/finance/closes", method: "POST", body }),
      invalidatesTags: [
        { type: "Finance", id: "MINE" },
        { type: "Finance", id: "CLOSES" },
        { type: "AdminFinance", id: "LIST" },
      ],
    }),

    // --- invoices (SRS 11.2) ---

    listInvoices: build.query<Invoice[], { userId?: string } | void>({
      query: (params) => ({ url: "/finance/invoices", params: params ?? {} }),
      providesTags: [{ type: "Finance", id: "INVOICES" }],
    }),

    createInvoice: build.mutation<
      Invoice,
      {
        entryIds: string[];
        userId?: string;
        dueAt?: string;
        billToName?: string;
        notes?: string;
      }
    >({
      query: (body) => ({ url: "/finance/invoices", method: "POST", body }),
      invalidatesTags: [
        { type: "Finance", id: "INVOICES" },
        { type: "Finance", id: "MINE" },
      ],
    }),

    // --- centralised books view (FR-13-013) ---

    getBooksSummary: build.query<BooksSummary, BookFilters | void>({
      query: (params) => ({ url: "/admin/books/summary", params: params ?? {} }),
      providesTags: [{ type: "AdminFinance", id: "SUMMARY" }],
    }),
  }),
});

/** Builds the query string for an export link, skipping empty filters. */
export const bookQuery = (filters: BookFilters = {}) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "" && key !== "page" && key !== "limit") {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const financeExportPath = (
  scope: "mine" | "all",
  format: ExportFormat,
  filters?: BookFilters
) =>
  scope === "mine"
    ? `/finance/mine/export.${format}${bookQuery(filters)}`
    : `/admin/finance/export.${format}${bookQuery(filters)}`;

export const {
  useListMyFinanceQuery,
  useCreateFinanceEntryMutation,
  useUpdateFinanceEntryMutation,
  useDeleteFinanceEntryMutation,
  useAdminListFinanceQuery,
  useAdminUpdateFinanceEntryMutation,
  useAdminDeleteFinanceEntryMutation,
  useListFinanceClosesQuery,
  useCloseFinancePeriodMutation,
  useListInvoicesQuery,
  useCreateInvoiceMutation,
  useGetBooksSummaryQuery,
} = financeApi;

export { financeApi };
