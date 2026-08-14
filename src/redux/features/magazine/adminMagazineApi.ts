import { baseApi } from "@/redux/api/baseApi";
import type { ApiAdminMagazine, AdminMagazineWriteInput } from "@/types/magazine";
import type { Paginated } from "@/types/api";

const adminMagazineApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminListMagazines: build.query<
      Paginated<ApiAdminMagazine>,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({ url: "/admin/magazines", params: params ?? {} }),
      providesTags: ["AdminMagazines"],
    }),

    adminCreateMagazine: build.mutation<ApiAdminMagazine, AdminMagazineWriteInput>({
      query: ({ file, ...fields }) => {
        const form = new FormData();
        for (const [key, value] of Object.entries(fields)) {
          if (value !== undefined && value !== "") form.append(key, String(value));
        }
        if (file) form.append("file", file);
        return { url: "/admin/magazines", method: "POST", body: form };
      },
      invalidatesTags: ["AdminMagazines", "Magazines"],
    }),

    adminUpdateMagazine: build.mutation<
      ApiAdminMagazine,
      { id: string; data: Partial<Omit<AdminMagazineWriteInput, "file">> }
    >({
      query: ({ id, data }) => ({ url: `/admin/magazines/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["AdminMagazines", "Magazines"],
    }),

    adminDeleteMagazine: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/magazines/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminMagazines", "Magazines"],
    }),
  }),
});

export const {
  useAdminListMagazinesQuery,
  useAdminCreateMagazineMutation,
  useAdminUpdateMagazineMutation,
  useAdminDeleteMagazineMutation,
} = adminMagazineApiSlice;
