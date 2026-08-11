import { baseApi } from "@/redux/api/baseApi";
import type { ApiMagazineListItem, MagazineDownloadLink } from "@/types/magazine";
import type { Paginated } from "@/types/api";

const magazineApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMagazines: build.query<Paginated<ApiMagazineListItem>, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/magazines", params: params ?? {} }),
      providesTags: ["Magazines"],
    }),

    getMagazineDownloadUrl: build.mutation<MagazineDownloadLink, string>({
      query: (id) => ({ url: `/magazines/${id}/download` }),
    }),
  }),
});

export const { useGetMagazinesQuery, useGetMagazineDownloadUrlMutation } = magazineApiSlice;
