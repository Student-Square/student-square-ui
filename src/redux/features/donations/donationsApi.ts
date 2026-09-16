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
    createDonation: build.mutation<
      CreateDonationResult,
      { body: CreateDonationBody; idempotencyKey: string }
    >({
      // The key makes a retried submit (a timeout, a second tap) return the
      // donation the first attempt created instead of opening another one.
      query: ({ body, idempotencyKey }) => ({
        url: "/donations",
        method: "POST",
        body,
        headers: { "Idempotency-Key": idempotencyKey },
      }),
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
