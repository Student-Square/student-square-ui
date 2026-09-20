import { baseApi } from "@/redux/api/baseApi";
import type { ApiMe, ApiMemberProfile } from "@/types/auth";
import type {
  MembershipAccount,
  MembershipUpdateInput,
  ProfileUpdateInput,
} from "@/types/profile";
import { setUser } from "../auth/authSlice";

const profileApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ApiMe, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data as ApiMe));
        } catch {
          // not authenticated — ignore
        }
      },
    }),

    updateProfile: build.mutation<ApiMe["profile"], ProfileUpdateInput>({
      query: (body) => ({ url: "/profile", method: "PATCH", body }),
      invalidatesTags: ["Profile", "Auth"],
    }),

    /**
     * The registration answers. Invalidating "Auth" is the point: the profile
     * page reads them from the `/auth/me` user in the store, so a save has to
     * refetch that rather than just this endpoint.
     */
    updateMembership: build.mutation<
      { membership: ApiMemberProfile; account: MembershipAccount },
      MembershipUpdateInput
    >({
      query: (body) => ({ url: "/profile/membership", method: "PATCH", body }),
      invalidatesTags: ["Profile", "Auth"],
    }),

    uploadAvatar: build.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/profile/avatar",
        method: "POST",
        body: formData,
        // No Content-Type override — browser sets multipart/form-data with boundary
      }),
      invalidatesTags: ["Profile", "Auth"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateMembershipMutation,
  useUploadAvatarMutation,
} = profileApiSlice;

export { profileApiSlice };
