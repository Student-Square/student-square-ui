"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAdminUploadMediaMutation } from "@/redux/features/blogs/adminBlogsApi";
import { ImagePlus, Loader2, X } from "lucide-react";

export type UploadedImage = { id: string; url: string; caption?: string };

interface Props {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function StoryImagesUpload({ images, onChange, maxImages = 10 }: Props) {
  const [uploadMedia] = useAdminUploadMediaMutation();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    setUploading(true);
    const results: UploadedImage[] = [];
    for (const file of toUpload) {
      if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); continue; }
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await uploadMedia(fd).unwrap();
        results.push({ id: res.id, url: res.url, caption: "" });
      } catch { /* baseApi toasts */ }
    }
    if (results.length) onChange([...images, ...results]);
    setUploading(false);
  };

  const remove = (id: string) => onChange(images.filter((img) => img.id !== id));

  const updateCaption = (id: string, caption: string) =>
    onChange(images.map((img) => (img.id === id ? { ...img, caption } : img)));

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group rounded-lg border border-border bg-muted overflow-hidden">
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(img.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <input
                type="text"
                value={img.caption ?? ""}
                onChange={(e) => updateCaption(img.id, e.target.value)}
                placeholder="Caption (optional)"
                maxLength={300}
                className="w-full px-2 py-1.5 text-[11px] bg-background border-t border-border placeholder:text-muted-foreground/50 focus:outline-none focus:bg-emerald-50/30 dark:focus:bg-emerald-900/10"
              />
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/10"
              : "border-border hover:border-emerald-500/50 hover:bg-muted/40"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Drop images or <span className="text-emerald-600 font-semibold">browse</span>
                <span className="ml-1 opacity-60">({images.length}/{maxImages})</span>
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
