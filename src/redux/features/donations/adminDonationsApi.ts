import { baseApi } from "../../api/baseApi";
import type {
  AdminDonation,
  AttemptsSummary,
  DonationSummary,
  ManualDonationBody,
  Paginated,
  ProjectDonationStats,
  VerifyResult,
} from "@/types/donations";

type AdminDonationFilters = {
  searchTerm?: string;
  status?: string;
  method?: string;
  kind?: string;
  campaignId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

const adminDonationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminDonations: build.query<Paginated<AdminDonation>, AdminDonationFilters | void>({
      query: (params) => ({ url: "/admin/donations", params: params ?? {} }),
      providesTags: ["AdminDonations"],
    }),

    getDonationSummary: build.query<DonationSummary, { from?: string; to?: string } | void>({
      query: (params) => ({ url: "/admin/donations/summary", params: params ?? {} }),
      providesTags: ["AdminDonations"],
    }),

    getAttemptsSummary: build.query<AttemptsSummary, { campaignId?: string; from?: string; to?: string } | void>({
      query: (params) => ({ url: "/admin/donations/attempts/summary", params: params ?? {} }),
      providesTags: ["AdminDonations"],
    }),

    getProjectStats: build.query<ProjectDonationStats, string>({
      query: (campaignId) => ({ url: `/admin/donations/project/${campaignId}/stats` }),
      providesTags: ["AdminDonations"],
    }),

    createManualDonation: build.mutation<AdminDonation, ManualDonationBody>({
      query: (body) => ({ url: "/admin/donations", method: "POST", body }),
      invalidatesTags: ["AdminDonations", "Campaigns", "AdminCampaigns"],
    }),

    confirmDonation: build.mutation<AdminDonation, string>({
      query: (id) => ({ url: `/admin/donations/${id}/confirm`, method: "POST" }),
      invalidatesTags: ["AdminDonations", "Campaigns", "AdminCampaigns"],
    }),

    verifyDonation: build.mutation<VerifyResult, string>({
      query: (id) => ({ url: `/admin/donations/${id}/verify`, method: "POST" }),
      invalidatesTags: ["AdminDonations", "Campaigns", "AdminCampaigns"],
    }),

    refundDonation: build.mutation<AdminDonation, string>({
      query: (id) => ({ url: `/admin/donations/${id}/refund`, method: "POST" }),
      invalidatesTags: ["AdminDonations", "Campaigns", "AdminCampaigns"],
    }),

    syncGatewayDonations: build.mutation<
      { checked: number; paid: number; expired: number },
      void
    >({
      query: () => ({ url: "/admin/donations/sync-gateway", method: "POST" }),
      invalidatesTags: ["AdminDonations", "Campaigns", "AdminCampaigns"],
    }),
  }),
});

export const {
  useGetAdminDonationsQuery,
  useGetDonationSummaryQuery,
  useGetAttemptsSummaryQuery,
  useGetProjectStatsQuery,
  useCreateManualDonationMutation,
  useConfirmDonationMutation,
  useVerifyDonationMutation,
  useRefundDonationMutation,
  useSyncGatewayDonationsMutation,
} = adminDonationsApi;
