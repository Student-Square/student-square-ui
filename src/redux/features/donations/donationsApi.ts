import { baseApi } from "../../api/baseApi";
import type {
  ApiDonation,
  CreateDonationBody,
  CreateDonationResult,
  DonationReceipt,
  Paginated,
} from "@/types/donations";

const donationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDonation: build.mutation<CreateDonationResult, CreateDonationBody>({
      query: (body) => ({ url: "/donations", method: "POST", body }),
      invalidatesTags: ["Donations"],
    }),

    getMyDonations: build.query<
      Paginated<ApiDonation>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/donations/mine", params: params ?? {} }),
      providesTags: ["Donations"],
    }),

    lookupDonation: build.query<DonationReceipt, string>({
      query: (token) => ({
        url: "/donations/lookup",
        params: { token },
      }),
    }),
  }),
});

export const {
  useCreateDonationMutation,
  useGetMyDonationsQuery,
  useLookupDonationQuery,
} = donationsApi;
