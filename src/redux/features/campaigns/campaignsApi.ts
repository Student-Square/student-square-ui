import { baseApi } from "@/redux/api/baseApi";
import type { ApiCampaign, ApiCampaignDetail, CampaignStatus } from "@/types/campaigns";

const campaignsApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCampaigns: build.query<ApiCampaign[], { status?: CampaignStatus } | void>({
      query: (params) => ({
        url: "/campaigns",
        params: params ?? {},
      }),
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
