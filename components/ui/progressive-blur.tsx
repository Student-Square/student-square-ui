"use client";

import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  className?: string;
  blurIntensity?: number;
  blurLayers?: number;
}

export function ProgressiveBlur({
  className,
  blurIntensity = 2,
  blurLayers = 6,
}: ProgressiveBlurProps) {
  return (
    <div className={cn("relative", className)}>
      {Array.from({ length: blurLayers }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${(i + 1) * blurIntensity}px)`,
            maskImage: `linear-gradient(to top, black ${(i / blurLayers) * 100}%, transparent ${((i + 1) / blurLayers) * 100}%)`,
            WebkitMaskImage: `linear-gradient(to top, black ${(i / blurLayers) * 100}%, transparent ${((i + 1) / blurLayers) * 100}%)`,
          }}
        />
      ))}
    </div>
  );
}
