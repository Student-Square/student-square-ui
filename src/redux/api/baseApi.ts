import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  // No custom responseHandler — default JSON parsing; envelope unwrapped below.
});

const baseQueryWithRefreshAndToasts: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : (args as FetchArgs).url;
  let result = await rawBaseQuery(args, api, extraOptions);

  // Unwrap { success, message, meta, data } envelope on successful HTTP responses.
  if (!result.error) {
    const payload = result.data as {
      success?: boolean;
      message?: string;
      meta?: unknown;
      data?: unknown;
      error?: unknown;
    } | null;

    if (!payload?.success) {
      result = {
        error: {
          status: 400,
          data: { message: payload?.message ?? "Request failed", error: payload?.error },
        } as FetchBaseQueryError,
      };
    } else {
      result = {
        data: payload.meta != null
          ? { meta: payload.meta, data: payload.data }
          : payload.data,
      };
    }
  }

  // 401 handling
  if (result.error && (result.error as { status?: number }).status === 401) {
    const isAuthEndpoint =
      url.includes("/auth/me") || url.includes("/auth/refresh-token");

    if (isAuthEndpoint) {
      // 401 from /auth/me means the user simply isn't logged in — no refresh needed.
      api.dispatch(logout());
    } else {
      // For protected endpoints, try a silent token refresh once then retry.
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        const meResult = await rawBaseQuery("/auth/me", api, extraOptions);
        if (meResult.data) {
          api.dispatch(setUser(meResult.data as Parameters<typeof setUser>[0]));
        }
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }

  // Surface errors as Sonner toasts.
  // Endpoints can opt out via `extraOptions: { silentOn404: true }` when they
  // want to render their own contextual error UI instead of the global toast.
  if (result.error) {
    const { status } = result.error as { status?: number | string };
    const message =
      (result.error as { data?: { message?: string } }).data?.message;
    const opts = (extraOptions ?? {}) as {
      silentOn404?: boolean;
      silent?: boolean;
    };

    const silent = opts.silent === true;
    const silent404 = status === 404 && opts.silentOn404 === true;

    if (silent || silent404) {
      // caller handles the error UX
    } else if (status === "FETCH_ERROR") {
      toast.error("Network error — check your connection.");
    } else if (status === 400 || status === 422) {
      toast.error(message ?? "Invalid request. Please check your input.");
    } else if (status === 401) {
      // Suppress for background auth checks — those silently handle logout
      if (!url.includes("/auth/me") && !url.includes("/auth/refresh-token")) {
        toast.error(message ?? "Unauthorized. Please sign in.");
      }
    } else if (status === 403) {
      toast.error(message ?? "You don't have permission to do that.");
    } else if (status === 409) {
      toast.error(message ?? "This resource already exists.");
    } else if (status === 404) {
      toast.error(message ?? "Resource not found.");
    } else if (typeof status === "number" && status >= 500) {
      toast.error("Server error — please try again later.");
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefreshAndToasts,
  tagTypes: [
    "Auth",
    "Profile",
    "Blogs",
    "BlogCategories",
    "BlogTags",
    "Stories",
    "AdminStories",
    "AdminBlogs",
    "Campaigns",
    "Content",
    "Cards",
    "Pages",
    "Board",
    "SiteSettings",
    "Comments",
    "Notifications",
    "AdminBlogs",
    "AdminStories",
    "AdminCampaigns",
    "AdminCards",
    "AdminPages",
    "AdminBoard",
    "AdminComments",
    "AdminUsers",
    "AdminMedia",
    "AdminAudit",
  ],
  endpoints: () => ({}),
});

