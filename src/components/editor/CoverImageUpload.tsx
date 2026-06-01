"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useAdminUploadMediaMutation } from "@/redux/features/blogs/adminBlogsApi";

type Props = {
  imageUrl: string | null;
  onUpload: (id: string, url: string) => void;
  onRemove: () => void;
};

export default function CoverImageUpload({ imageUrl, onUpload, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadMedia, { isLoading }] = useAdminUploadMediaMutation();
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const result = await uploadMedia(fd).unwrap();
      onUpload(result.id, result.url);
    } catch {
      setError("Upload failed — please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
        Cover Image
      </label>

      {imageUrl ? (
        <div
          className="relative rounded-xl overflow-hidden border border-border"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Cover" className="w-full aspect-[16/9] object-cover" />
          {hovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="aspect-[16/9] rounded-xl border-2 border-dashed border-border hover:border-emerald-500/60 bg-muted/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground">Click or drag to upload</p>
              <p className="text-[10px] text-muted-foreground/70">JPG, PNG, WebP · max 5 MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
