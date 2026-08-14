import { baseApi } from "@/redux/api/baseApi";

export type Feature = { key: string; enabled: boolean };

const systemApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeatures: build.query<Feature[], void>({
      query: () => ({ url: "/admin/system/features" }),
      providesTags: ["Features"],
    }),
    setFeature: build.mutation<Feature, { key: string; enabled: boolean }>({
      query: ({ key, enabled }) => ({
        url: `/admin/system/features/${key}`,
        method: "PATCH",
        body: { enabled },
      }),
      invalidatesTags: ["Features"],
    }),
  }),
});

export const { useGetFeaturesQuery, useSetFeatureMutation } = systemApiSlice;
