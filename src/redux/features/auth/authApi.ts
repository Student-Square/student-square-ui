import { baseApi } from "@/redux/api/baseApi";
import { setUser, logout } from "./authSlice";
import type { ApiMe } from "@/types/auth";
import type { FoundationRegisterInput } from "@/lib/registration";

type RegisterResult = {
  id: string;
  email: string;
  fullName: string;
  memberId?: string | null;
  role?: string;
  status?: string;
};
type LoginInput = { email: string; password: string };
type ChangePasswordInput = { oldPassword: string; newPassword: string };
type ForgotPasswordInput = { email: string };
type ResetPasswordInput = { email?: string; password: string; token?: string };

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<RegisterResult, FoundationRegisterInput>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    verifyEmail: build.mutation<null, { token: string }>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),

    login: build.mutation<{ accessToken: string; refreshToken: string }, LoginInput>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          const me = await dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
          );
          if (me.data) dispatch(setUser(me.data as ApiMe));
        } catch {
          // login failed
        }
      },
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation<null, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    getMe: build.query<ApiMe, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data as ApiMe));
        } catch {
          dispatch(logout());
        }
      },
    }),

    forgotPassword: build.mutation<null, ForgotPasswordInput>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: build.mutation<null, ResetPasswordInput>({
      query: ({ token, ...body }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    }),

    changePassword: build.mutation<{ message: string }, ChangePasswordInput>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;

export { authApi };
