"use client";

import { useEffect } from "react";

/**
 * If a donate result page loads inside the SSLCommerz Easy Checkout lightbox
 * (which is an iframe), break out so the full page shows the result.
 */
export default function BreakIframe() {
  useEffect(() => {
    if (window.top !== window.self) {
      window.top!.location.href = window.location.href;
    }
  }, []);

  return null;
}
