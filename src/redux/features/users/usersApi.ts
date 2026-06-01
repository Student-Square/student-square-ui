import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminUser,
  AdminCreateUserInput,
  AdminUpdateUserInput,
  AdminUserListParams,
  PaginatedUsers,
} from "@/types/users";

const usersApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminListUsers: build.query<PaginatedUsers, AdminUserListParams | void>({
      query: (params) => ({ url: "/admin/users", params: params ?? {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((u) => ({ type: "AdminUsers" as const, id: u.id })),
              { type: "AdminUsers" as const, id: "LIST" },
            ]
          : [{ type: "AdminUsers" as const, id: "LIST" }],
    }),

    adminGetUser: build.query<AdminUser, string>({
      query: (id) => `/admin/users/${encodeURIComponent(id)}`,
      providesTags: (_r, _e, id) => [{ type: "AdminUsers" as const, id }],
    }),

    adminCreateUser: build.mutation<{ user: AdminUser; temporaryPassword: string }, AdminCreateUserInput>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),

    adminUpdateUser: build.mutation<AdminUser, { id: string; data: AdminUpdateUserInput }>({
      query: ({ id, data }) => ({ url: `/admin/users/${encodeURIComponent(id)}`, method: "PATCH", body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "AdminUsers", id }, { type: "AdminUsers", id: "LIST" }],
    }),

    adminDeactivateUser: build.mutation<AdminUser, string>({
      query: (id) => ({ url: `/admin/users/${encodeURIComponent(id)}/deactivate`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "AdminUsers", id }, { type: "AdminUsers", id: "LIST" }],
    }),

    adminReactivateUser: build.mutation<AdminUser, string>({
      query: (id) => ({ url: `/admin/users/${encodeURIComponent(id)}/reactivate`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "AdminUsers", id }, { type: "AdminUsers", id: "LIST" }],
    }),
  }),
});

export const {
  useAdminListUsersQuery,
  useAdminGetUserQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
  useAdminDeactivateUserMutation,
  useAdminReactivateUserMutation,
} = usersApiSlice;

export { usersApiSlice };
