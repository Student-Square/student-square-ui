"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const SESSION_KEY = "ss_analytics_sid";

/** A random id kept in localStorage — not a login session, just enough to
 * approximate "how many different visitors" and "pages per visit" without
 * storing anything that identifies a person. */
function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) — a per-load id still
    // lets this pageview count, it just won't join up with the next one.
    return crypto.randomUUID();
  }
}

/**
 * Fires a first-party pageview beacon on every route change, for the
 * Website Analytics dashboard (traffic + blog view counts). No cookies, no
 * third-party script, no PII — see analytics.service.ts on the backend for
 * exactly what gets stored.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Never track the admin/panel/dashboard shells — internal staff and
    // member usage would otherwise inflate "visitor" counts meant to
    // measure public site traffic.
    if (/^\/(admin|panel|dashboard)(\/|$)/.test(pathname)) return;

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
      sessionId: getOrCreateSessionId(),
    });

    const url = `${API_BASE_URL}/analytics/track`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
        () => {}
      );
    }
  }, [pathname]);

  return null;
}
