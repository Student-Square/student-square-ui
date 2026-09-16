import { baseApi } from "@/redux/api/baseApi";
import type { SearchResults } from "@/types/search";

const searchApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    search: build.query<SearchResults, { q: string; limit?: number }>({
      query: ({ q, limit }) => ({ url: "/search", params: { q, ...(limit ? { limit } : {}) } }),
      // The results page renders its own empty/error UI.
      extraOptions: { silent: true },
    }),
  }),
});

export const { useSearchQuery } = searchApiSlice;
