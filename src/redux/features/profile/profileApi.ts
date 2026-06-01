import { baseApi } from "@/redux/api/baseApi";
import type { ApiMe } from "@/types/auth";
import type { ProfileUpdateInput } from "@/types/profile";
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
  useUploadAvatarMutation,
} = profileApiSlice;

export { profileApiSlice };
