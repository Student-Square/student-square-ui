import { baseApi } from "../../api/baseApi";
import type { ApiCampaign, ApiCampaignDetail } from "@/types/campaigns";
import type { Paginated } from "@/types/donations";

type CampaignDateUpdate = {
  id: string;
  startDate?: string | null;
  endDate?: string | null;
  order?: number;
};

/**
 * What the API accepts when a donation project is created. Mirrors
 * `campaign.validation.ts` on the server, which is `.strict()` — an unknown
 * key is a 400, so this type is the contract rather than a convenience.
 *
 * `goalAmount` is a decimal **string**: it is money and never a float.
 * The dates are full ISO datetimes, not the `YYYY-MM-DD` a date input gives.
 */
export type CampaignCreateBody = {
  title: string;
  summary: string;
  description: string;
  slug?: string;
  titleBn?: string;
  summaryBn?: string;
  descriptionBn?: string;
  coverImageId?: string;
  goalAmount?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
};

/** Every field is optional on update, and nullable where the column is. */
export type CampaignUpdateBody = {
  id: string;
} & Partial<{
  title: string;
  summary: string;
  description: string;
  slug: string;
  titleBn: string | null;
  summaryBn: string | null;
  descriptionBn: string | null;
  coverImageId: string | null;
  goalAmount: string | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  order: number;
  status: ApiCampaign["status"];
}>;

const adminCampaignsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCampaigns: build.query<Paginated<ApiCampaign>, { status?: string } | void>({
      query: (params) => ({ url: "/admin/campaigns", params: params ?? {} }),
      providesTags: ["AdminCampaigns"],
    }),

    /** The full record, including the description the list endpoint omits. */
    getAdminCampaign: build.query<ApiCampaignDetail, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "AdminCampaigns", id }],
    }),

    // Named for its domain: `createCampaign` is already the bulk-message one
    // in commsApi, and every slice shares one endpoint namespace on baseApi.
    createDonationCampaign: build.mutation<ApiCampaign, CampaignCreateBody>({
      query: (body) => ({ url: "/admin/campaigns", method: "POST", body }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    updateDonationCampaign: build.mutation<ApiCampaign, CampaignUpdateBody>({
      query: ({ id, ...body }) => ({
        url: `/admin/campaigns/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminCampaigns", id },
        "AdminCampaigns",
        "Campaigns",
      ],
    }),

    activateCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}/activate`, method: "POST" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    pauseCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}/pause`, method: "POST" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    /** Goal reached or the appeal is over — it stops taking gifts but stays public. */
    completeCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}/complete`, method: "POST" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    /**
     * DELETE on the server, but it archives rather than destroys — the gifts
     * already recorded against the project have to keep pointing somewhere.
     */
    archiveCampaign: build.mutation<ApiCampaign, string>({
      query: (id) => ({ url: `/admin/campaigns/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),

    /** The asset is uploaded through /admin/media first; this attaches it. */
    addCampaignImage: build.mutation<
      ApiCampaignDetail,
      { id: string; imageId: string; caption?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/campaigns/${id}/images`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminCampaigns", id },
        "AdminCampaigns",
        "Campaigns",
      ],
    }),

    /** `imageId` here is the gallery row's id, not the asset's. */
    removeCampaignImage: build.mutation<
      ApiCampaignDetail,
      { id: string; imageId: string }
    >({
      query: ({ id, imageId }) => ({
        url: `/admin/campaigns/${id}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminCampaigns", id },
        "AdminCampaigns",
        "Campaigns",
      ],
    }),

    updateCampaignSchedule: build.mutation<ApiCampaign, CampaignDateUpdate>({
      query: ({ id, ...body }) => ({ url: `/admin/campaigns/${id}`, method: "PATCH", body }),
      invalidatesTags: ["AdminCampaigns", "Campaigns"],
    }),
  }),
});

export const {
  useGetAdminCampaignsQuery,
  useGetAdminCampaignQuery,
  useCreateDonationCampaignMutation,
  useUpdateDonationCampaignMutation,
  useActivateCampaignMutation,
  usePauseCampaignMutation,
  useCompleteCampaignMutation,
  useArchiveCampaignMutation,
  useAddCampaignImageMutation,
  useRemoveCampaignImageMutation,
  useUpdateCampaignScheduleMutation,
} = adminCampaignsApi;
