"use client";

import { useRef, MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/catalog";

import { urlForImage } from "@/content/sanity/lib/image";

export interface ShowcaseCardProps {
  product: Product;
  image: string | unknown;
  onOpen: (product: Product, trigger: HTMLElement) => void;
}

/**
 * A product as evidence that the showroom carries it — not a shop listing.
 * No price, stock, badges or "add" controls: the card opens the quick view,
 * and the quick view hands the visitor to WhatsApp or the showroom.
 */
export default function ShowcaseCard({ product, image, onOpen }: ShowcaseCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--pointer-x", `${x}px`);
    cardRef.current.style.setProperty("--pointer-y", `${y}px`);
  };

  const brand = product.brandName || product.brand;
  const blurb = product.shortDescription || product.description;
  const imageUrl = typeof image === "string" ? image : image ? urlForImage(image).url() : "";

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-none border-[var(--border)] bg-[var(--surface)] p-0 shadow-none transition-colors duration-300 hover:border-[var(--color-brass)] relative">
      <button
        ref={cardRef}
        type="button"
        aria-haspopup="dialog"
        onMouseMove={handleMouseMove}
        onClick={(e) => onOpen(product, e.currentTarget)}
        className="hc-focus flex h-full w-full flex-col text-left active:scale-[0.98] transition-transform duration-200"
      >
        <div className="pointer-light absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
        
        <span className="relative block aspect-[4/3] w-full bg-[var(--surface-raised)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              placeholder={product.imageLqip ? "blur" : "empty"}
              blurDataURL={product.imageLqip}
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}
        </span>

        <span className="flex flex-1 flex-col gap-1.5 p-4">
          {brand && (
            <span className="hc-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:text-[10px]">
              {brand}
            </span>
          )}
          <span className="hc-serif text-base font-normal leading-snug text-[var(--text-primary)] sm:text-[17px]">
            {product.name}
          </span>
          {blurb && (
            <span className="line-clamp-2 text-sm font-light leading-relaxed text-[var(--text-secondary)] sm:text-[13px]">
              {blurb}
            </span>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] text-brass-ink sm:text-[12px]">
            View details
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </span>
      </button>
    </Card>
  );
}
