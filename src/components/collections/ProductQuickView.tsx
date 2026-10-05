"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Product } from "@/types/catalog";

export interface ProductQuickViewProps {
  product: Product | null;
  image: string;
  /** Prefilled WhatsApp enquiry for this product. */
  whatsappHref: string;
  /** `/catalogues?brand=…` when the brand has a catalogue on the site; otherwise omitted. */
  catalogueHref?: string;
  onClose: () => void;
}

/**
 * Lightweight product detail, on the native <dialog> element: showModal() gives
 * the focus trap, Escape-to-close, inert page and focus return without any
 * script of our own. A click on the backdrop also closes it.
 *
 * It answers "is this what I'm after?" and then hands over: WhatsApp, or the
 * brand's catalogue when one exists. Specifications, prices and availability
 * stay with the showroom team.
 */
export default function ProductQuickView({
  product,
  image,
  whatsappHref,
  catalogueHref,
  onClose,
}: ProductQuickViewProps) {
  // Mounted only while a product is selected and opened as it attaches, so there
  // is no open/close state to keep in sync: closing is unmounting.
  const openAsModal = useCallback((dialog: HTMLDialogElement | null) => {
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  if (!product) return null;

  const brand = product.brandName || product.brand;
  const features = (product.features ?? []).filter(Boolean).slice(0, 5);
  const blurb = product.shortDescription || product.description;

  return (
    <dialog
      ref={openAsModal}
      aria-labelledby="quick-view-title"
      onClose={onClose}
      onClick={(e) => {
        // The dialog element itself is only hit on its backdrop; content sits in the inner div.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[90dvh] overflow-y-auto rounded border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--text-primary)] shadow-[0_24px_60px_rgba(26,16,23,0.18)] backdrop:bg-[#1a1017]/55 backdrop:backdrop-blur-sm"
    >
      <div className="relative grid gap-0 md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hc-focus absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface)]/90 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative aspect-square bg-[var(--surface-raised)] md:aspect-auto md:min-h-[420px]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              placeholder={product.imageLqip ? "blur" : "empty"}
              blurDataURL={product.imageLqip}
              sizes="(min-width: 768px) 384px, 100vw"
              className="object-contain p-8"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div>
            {brand && (
              <p className="hc-mono mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-ink">
                {brand}
              </p>
            )}
            <h2 id="quick-view-title" className="hc-serif text-3xl font-light leading-tight">
              {product.name}
            </h2>
            {blurb && (
              <p className="mt-3 text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                {blurb}
              </p>
            )}
          </div>

          {features.length > 0 && (
            <ul className="space-y-2 border-t border-[var(--border)] pt-5">
              {features.map((feature, i) => (
                <li key={`${i}-${feature}`} className="flex gap-3 text-sm font-light text-[var(--text-secondary)]">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-brass)]" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex flex-col gap-3 border-t border-[var(--border)] pt-5">
            <p className="text-xs font-light text-[var(--text-secondary)]">
              Price, finishes and availability are confirmed by our team at the Sakchi showroom.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="brass-plate hc-focus inline-flex min-h-12 items-center justify-center rounded px-6 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Ask on WhatsApp
            </a>
            {catalogueHref && brand && (
              <Link
                href={catalogueHref}
                className="rail-button hc-focus inline-flex min-h-12 items-center justify-center rounded border border-[var(--border)] px-6 text-xs font-medium uppercase tracking-widest transition-colors hover:border-[var(--color-brass)]"
              >
                View {brand} catalogue
              </Link>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
