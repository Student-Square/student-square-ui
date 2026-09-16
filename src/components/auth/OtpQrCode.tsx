"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Authenticator QR code, rendered in the browser.
 *
 * The otpauth:// URI carries the TOTP secret, so it must never leave the page.
 * The previous version put it in the image URL of a third-party QR service,
 * handing every enrolling account's second factor to that service's logs.
 */
export default function OtpQrCode({
  otpauthUrl,
  size = 180,
}: {
  otpauthUrl: string;
  size?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(otpauthUrl, { width: size, margin: 1, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        // The secret is shown as text beside the code; manual entry still works.
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [otpauthUrl, size]);

  const className = "mx-auto rounded-md border border-border bg-white p-2";

  if (!src) {
    return <div aria-hidden className={className} style={{ width: size, height: size }} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Authenticator QR code" width={size} height={size} className={className} />
  );
}
