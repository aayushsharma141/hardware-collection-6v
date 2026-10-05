"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/catalog";

export interface ShowcaseCardProps {
  product: Product;
  image: string;
  onOpen: (product: Product, trigger: HTMLElement) => void;
}

/**
 * A product as evidence that the showroom carries it — not a shop listing.
 * No price, stock, badges or "add" controls: the card opens the quick view,
 * and the quick view hands the visitor to WhatsApp or the showroom.
 */
export default function ShowcaseCard({ product, image, onOpen }: ShowcaseCardProps) {
  const brand = product.brandName || product.brand;
  const blurb = product.shortDescription || product.description;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(e) => onOpen(product, e.currentTarget)}
      className="group hc-focus flex h-full w-full flex-col overflow-hidden rounded border border-[var(--border)] bg-[var(--surface)] text-left transition-colors duration-200 hover:border-[var(--color-brass)]"
    >
      <span className="relative block aspect-[4/3] w-full bg-[var(--surface-raised)]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            placeholder={product.imageLqip ? "blur" : "empty"}
            blurDataURL={product.imageLqip}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}
      </span>

      <span className="flex flex-1 flex-col gap-2 border-t border-[var(--border)] p-4">
        {brand && (
          <span className="hc-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-ink">
            {brand}
          </span>
        )}
        <span className="hc-serif text-lg font-light leading-snug text-[var(--text-primary)]">
          {product.name}
        </span>
        {blurb && (
          <span className="line-clamp-2 text-[13px] font-light leading-relaxed text-[var(--text-secondary)]">
            {blurb}
          </span>
        )}
        <span className="hc-mono mt-auto inline-flex items-center gap-1.5 pt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--color-brass)]">
          View details
          <ArrowRight
            aria-hidden="true"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </span>
    </button>
  );
}
