"use client";

import { useState } from "react";
import NextImage, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Every image on the site goes through here, so the delivery quality is set once.
 * 100 by default: best fidelity, and the AVIF output is still a fraction of the
 * original file size. Must be one of the `images.qualities` values in next.config.ts.
 */
export function LazyImage({ className, onLoad, quality = 100, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <NextImage
      quality={quality}
      className={cn(
        !isLoaded && "animate-pulse bg-[var(--surface-raised)]",
        className
      )}
      onLoad={(e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
      }}
      {...props}
    />
  );
}
