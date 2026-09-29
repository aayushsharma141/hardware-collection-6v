import React from "react";
import Image from "next/image";

interface NormalizedLogoProps {
  src: string;
  alt: string;
  /** Width / height from Sanity's asset metadata; null for local fallback logos. */
  aspect?: number | null;
  className?: string;
}

const BOX_HEIGHT = 64;
const MAX_WIDTH = 220;

/**
 * Renders a brand logo inside the catalogue card's 64px-tall slot. Logos come
 * in every proportion, so the intrinsic size is derived from the asset's
 * aspect ratio (when the CMS supplies one) and clamped to the slot, keeping
 * wide wordmarks and square emblems the same visual weight.
 */
export function NormalizedLogo({ src, alt, aspect, className = "" }: NormalizedLogoProps) {
  const ratio = aspect && Number.isFinite(aspect) && aspect > 0 ? aspect : 2.5;
  const width = Math.min(Math.round(BOX_HEIGHT * ratio), MAX_WIDTH);

  return (
    <Image
      src={src}
      alt={alt}
      width={width * 2}
      height={Math.round((width * 2) / ratio)}
      sizes={`${width}px`}
      className={`h-full w-auto max-w-full object-contain object-left ${className}`}
      unoptimized={src.endsWith(".svg")}
    />
  );
}

export default NormalizedLogo;
