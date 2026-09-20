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

/** Staff and member shells — not public traffic, so never tracked. */
const INTERNAL_AREA = /^\/(admin|panel|dashboard)(\/|$)/;

/**
 * sendBeacon survives the page unloading, which a click on a link usually
 * causes; fetch with keepalive is the fallback.
 */
function send(url: string, payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  } else {
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
      () => {}
    );
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
    if (INTERNAL_AREA.test(pathname)) return;

    send(`${API_BASE_URL}/analytics/track`, {
      path: pathname,
      referrer: document.referrer || undefined,
      sessionId: getOrCreateSessionId(),
    });
  }, [pathname]);

  // Link clicks, for "Most clicked links". One delegated listener instead of
  // wiring every <a>: it sees links rendered later too. Capture phase, so a
  // handler that stops propagation cannot hide the click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const from = window.location.pathname;
      if (INTERNAL_AREA.test(from)) return;

      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // Absolute URL, minus query and fragment — the server strips them too,
      // but they need not leave the browser at all.
      const target = href.startsWith("mailto:") || href.startsWith("tel:")
        ? href.split(/[?#]/)[0]
        : `${link.origin}${link.pathname}`;

      const label = (link.getAttribute("aria-label") || link.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);

      send(`${API_BASE_URL}/analytics/click`, {
        target,
        fromPath: from,
        ...(label ? { label } : {}),
        sessionId: getOrCreateSessionId(),
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
