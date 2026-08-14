import { baseApi } from "@/redux/api/baseApi";
import type { ApiCampaign, ApiCampaignDetail, CampaignStatus } from "@/types/campaigns";

const campaignsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCampaigns: build.query<ApiCampaign[], { status?: CampaignStatus } | void>({
      query: (params) => ({
        url: "/campaigns",
        params: params ?? {},
      }),
      transformResponse: (res: unknown): ApiCampaign[] => {
        if (Array.isArray(res)) return res;
        if (res && typeof res === "object" && Array.isArray((res as { data?: unknown }).data)) {
          return (res as { data: ApiCampaign[] }).data;
        }
        return [];
      },
      providesTags: ["Campaigns"],
    }),

    getCampaignBySlug: build.query<ApiCampaignDetail, string>({
      query: (slug) => `/campaigns/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: "Campaigns", id: slug }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignBySlugQuery,
} = campaignsApiSlice;

export { campaignsApiSlice };
