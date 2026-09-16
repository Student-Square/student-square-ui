import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { logout } from "../features/auth/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  // No custom responseHandler — default JSON parsing; envelope unwrapped below.
});

type RawResult = Awaited<ReturnType<typeof rawBaseQuery>>;
type QueryApi = Parameters<typeof rawBaseQuery>[1];
type QueryExtra = Parameters<typeof rawBaseQuery>[2];

/** Unwraps the API's { success, message, meta, data } envelope. */
const unwrapEnvelope = (result: RawResult): RawResult => {
  if (result.error) return result;

  const payload = result.data as {
    success?: boolean;
    message?: string;
    meta?: unknown;
    data?: unknown;
    error?: unknown;
  } | null;

  if (!payload?.success) {
    return {
      error: {
        status: 400,
        data: { message: payload?.message ?? "Request failed", error: payload?.error },
      } as FetchBaseQueryError,
    };
  }

  return {
    data: payload.meta != null ? { meta: payload.meta, data: payload.data } : payload.data,
  };
};

const isUnauthorized = (result: RawResult) =>
  (result.error as { status?: unknown } | undefined)?.status === 401;

/**
 * Auth endpoints where a 401 is the answer itself (wrong password, bad or
 * expired token) rather than "your access token expired". Refreshing on them
 * achieved nothing, and a failed login used to log the visitor out as well.
 */
const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const isPublicAuth = (url: string) => {
  const path = url.split("?")[0];
  return PUBLIC_AUTH_PATHS.some((p) => path.startsWith(p));
};

let refreshInFlight: Promise<boolean> | null = null;

/**
 * One refresh for everyone. Several queries failing together used to fire a
 * refresh each; they now wait on the same one, then all retry.
 */
const refreshSession = (api: QueryApi, extraOptions: QueryExtra) => {
  refreshInFlight ??= (async () => {
    try {
      const refreshed = await rawBaseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );
      return !refreshed.error;
    } finally {
      // Cleared once settled, so the next expiry refreshes again.
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
};

const baseQueryWithRefreshAndToasts: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : (args as FetchArgs).url;
  let result = unwrapEnvelope(await rawBaseQuery(args, api, extraOptions));

  // 401 handling. /auth/me is included on purpose: the access cookie lives 15
  // minutes and the refresh cookie days, so a 401 from /auth/me on page load
  // usually means "refresh me", not "signed out". Treating it as signed out
  // ended every session at the first reload after 15 minutes.
  if (isUnauthorized(result) && !isPublicAuth(url)) {
    if (await refreshSession(api, extraOptions)) {
      // The retry goes through the same unwrap as the first attempt. It used
      // to skip it, so every request that triggered a refresh handed its
      // component the raw envelope instead of the data.
      result = unwrapEnvelope(await rawBaseQuery(args, api, extraOptions));
    }
    if (isUnauthorized(result)) api.dispatch(logout());
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
    const aborted =
      status === "FETCH_ERROR" &&
      typeof (result.error as { error?: string }).error === "string" &&
      /abort/i.test((result.error as { error: string }).error);

    if (silent || silent404 || aborted) {
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
    } else if (status === 503) {
      // A Super Admin switched this feature off (see /admin/system). It is not
      // a fault, so it must not read like one — the server names the feature.
      toast.error(message ?? "This feature is currently unavailable.");
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
    "Donations",
    "AdminDonations",
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
    "Operations",
    "AdminOperations",
    "Finance",
    "AdminFinance",
    "Assessments",
    "AdminAssessments",
    "DataRequests",
    "Care",
    "Roadmap",
    "Sessions",
    "Rank",
    "Messaging",
    "Feedback",
    "Resources",
    "Comms",
    "Magazines",
    "AdminMagazines",
    "Reports",
    "AdminReports",
    "Events",
    "AdminEvents",
    "Features",
  ],
  endpoints: () => ({}),
});
