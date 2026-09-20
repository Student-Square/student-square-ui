"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Download, X } from "lucide-react";

/**
 * Look at a PDF before saving it.
 *
 * Every generated document in the admin used to go straight to the downloads
 * folder: you clicked PDF, something landed on disk, and the only way to know
 * whether the filters were right was to open it and, usually, do it again.
 * This is the pattern the donation report modal already used, lifted out so
 * one implementation serves every PDF in the app.
 *
 * Two kinds of document need it, so the hook takes either:
 *
 *  - `path` — a PDF the API generates. It is fetched with the session cookie,
 *    held as a blob, and the same blob is what Download saves. Previewing then
 *    saving is one generation, not two.
 *  - `url` — a PDF that already exists behind a signed link. The frame points
 *    at it directly, because a framed request is a subresource and would not
 *    carry a `SameSite=Lax` cookie to the API.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export type PdfPreviewRequest = {
  /** API path (relative to the API base) that returns the PDF itself. */
  path?: string;
  /** A ready-to-frame URL — a pre-signed link, say. Used when `path` is absent. */
  url?: string;
  /** What Download names the file. */
  fileName: string;
  title: string;
  subtitle?: string;
};

type OpenPreview = PdfPreviewRequest & {
  /** Frame source: a blob: URL when fetched, the given URL otherwise. */
  src: string;
  /** Present only for a fetched PDF; saving it needs no second request. */
  blob?: Blob;
};

export function usePdfPreview() {
  const [preview, setPreview] = useState<OpenPreview | null>(null);
  const [loading, setLoading] = useState(false);

  // A blob: URL is the only thing here that has to be released by hand, and
  // the ref keeps the cleanup honest when one preview replaces another.
  const objectUrl = useRef<string | null>(null);

  const release = useCallback(() => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }, []);

  useEffect(() => release, [release]);

  const openPdfPreview = useCallback(
    async (request: PdfPreviewRequest) => {
      if (request.url && !request.path) {
        release();
        setPreview({ ...request, src: request.url });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}${request.path}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Preview failed");
        const blob = await res.blob();
        release();
        objectUrl.current = URL.createObjectURL(blob);
        setPreview({ ...request, src: objectUrl.current, blob });
      } catch {
        toast.error("Could not build the PDF");
      } finally {
        setLoading(false);
      }
    },
    [release]
  );

  const closePdfPreview = useCallback(() => {
    release();
    setPreview(null);
  }, [release]);

  const pdfPreview = preview ? (
    <PdfPreviewModal preview={preview} onClose={closePdfPreview} />
  ) : null;

  return { openPdfPreview, closePdfPreview, pdfPreview, pdfPreviewLoading: loading };
}

function PdfPreviewModal({
  preview,
  onClose,
}: {
  preview: OpenPreview;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  // `download` is ignored on a cross-origin href, so only a fetched blob can
  // actually be saved from here. A signed link opens in a tab instead, which
  // is what the button then says.
  const save = () => {
    if (!preview.blob) {
      window.open(preview.src, "_blank", "noopener,noreferrer");
      return;
    }
    const a = document.createElement("a");
    a.href = preview.src;
    a.download = preview.fileName;
    a.click();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={preview.title}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground">{preview.title}</h2>
            {preview.subtitle && (
              <p className="truncate text-xs text-muted-foreground">{preview.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <iframe
          src={preview.src}
          title={preview.title}
          className="min-h-0 w-full flex-1 bg-muted"
        />

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Close
          </button>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            {preview.blob ? "Download PDF" : "Open in new tab"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
