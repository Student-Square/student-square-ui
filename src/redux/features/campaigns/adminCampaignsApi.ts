import { baseApi } from "../../api/baseApi";
import type { ApiCampaign } from "@/types/campaigns";
import type { Paginated } from "@/types/donations";

type CampaignDateUpdate = {
  id: string;
  startDate?: string | null;
  endDate?: string | null;
  order?: number;
};

const adminCampaignsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCampaigns: build.query<Paginated<ApiCampaign>, { status?: string } | void>({
      query: (params) => ({ url: "/admin/campaigns", params: params ?? {} }),
      providesTags: ["AdminCampaigns"],
    }),

    activateCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}/activate`, method: "POST" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    pauseCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}/pause`, method: "POST" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    updateCampaignSchedule: build.mutation<ApiCampaign, CampaignDateUpdate>({
      query: ({ id, ...body }) => ({ url: `/admin/campaigns/${id}`, method: "PATCH", body }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),
  }),
});

export const {
  useGetAdminCampaignsQuery,
  useActivateCampaignMutation,
  usePauseCampaignMutation,
  useUpdateCampaignScheduleMutation,
} = adminCampaignsApi;
