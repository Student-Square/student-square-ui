"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import type { ReactNode } from "react";

/**
 * Silently checks whether a session cookie exists on first render.
 * Public pages render their content independently — this never blocks them.
 */
function AuthBootstrap() {
  useGetMeQuery(undefined, {
    // Don't spam /auth/me on every tab focus or reconnect for public pages.
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
