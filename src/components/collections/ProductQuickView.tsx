"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
 * Lightweight product detail in a shadcn Dialog (Radix): focus trap, Escape,
 * inert page and focus return come with it.
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
  const brand = product?.brandName || product?.brand;
  const features = (product?.features ?? []).filter(Boolean).slice(0, 5);
  const blurb = product?.shortDescription || product?.description;

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] max-w-3xl gap-0 overflow-y-auto rounded-none border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--text-primary)] sm:max-w-3xl">
        {product && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square bg-[var(--surface-raised)] md:aspect-auto md:min-h-[420px]">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  placeholder={product.imageLqip ? "blur" : "empty"}
                  blurDataURL={product.imageLqip}
                  sizes="(min-width: 768px) 384px, 100vw"
                  className="object-cover"
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
                <DialogTitle className="hc-serif text-3xl font-light leading-tight">{product.name}</DialogTitle>
                <DialogDescription className="mt-3 text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                  {blurb || "Available to see at our Sakchi showroom."}
                </DialogDescription>
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
                <Button
                  asChild
                  className="brass-plate h-12 rounded-none text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Ask on WhatsApp
                  </a>
                </Button>
                {catalogueHref && brand && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-none border-[var(--border)] bg-transparent text-xs font-medium uppercase tracking-widest hover:border-[var(--color-brass)] hover:bg-transparent"
                  >
                    <Link href={catalogueHref}>View {brand} catalogue</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
