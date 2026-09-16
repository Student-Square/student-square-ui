"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import type { ReactNode } from "react";

/** How long to wait before re-checking a session check that failed for a reason other than 401. */
const SESSION_RETRY_MS = 5000;

/**
 * Silently checks whether a session cookie exists on first render.
 * Public pages render their content independently — this never blocks them.
 *
 * A check that fails with anything but a 401 (API restarting, network blip)
 * is retried rather than treated as "signed out"; protected layouts keep
 * showing their loading state meanwhile instead of bouncing to /auth/login.
 */
function AuthBootstrap() {
  const { error, refetch } = useGetMeQuery(undefined, {
    // Don't spam /auth/me on every tab focus or reconnect for public pages.
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const status = (error as { status?: unknown } | undefined)?.status;

  useEffect(() => {
    if (!error || status === 401) return;
    const timer = setTimeout(() => void refetch(), SESSION_RETRY_MS);
    return () => clearTimeout(timer);
  }, [error, status, refetch]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <LanguageProvider>{children}</LanguageProvider>
    </Provider>
  );
}
