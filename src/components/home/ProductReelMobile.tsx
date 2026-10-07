"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { generateWhatsAppUrl } from "@/lib/config";
import { SIGNATURE_PIECES } from "@/content/fallback/home";

/**
 * ProductReelMobile - flagship pieces, one open at a time.
 *
 * Three pieces used to render as three stacked blocks, each a full-bleed 4:5
 * photograph followed by brand, name, blurb and two actions: 2603px on an
 * 812px screen. The pieces are genuinely equivalent - nothing in the data
 * ranks them - so a vertical sequence charged a viewport of scrolling per
 * piece and still gave the visitor no way to compare the set.
 *
 * They now read as an index that opens. Every piece is named in a single
 * glance; the open one gets the photograph and the material copy. Choosing
 * between pieces is a tap rather than a scroll, and the WhatsApp handoff
 * still carries brand and finish into the message.
 *
 * The open panel takes `statement`, not `blurb`. Three 30-word paragraphs
 * under cinematic photography read as a wall of text; the photograph is the
 * argument here and one sentence is enough to support it.
 *
 * The section sits on `--surface-raised`, a step up from the page ground, so
 * it reads as featured without leaving the warm palette. It was previously
 * flipped to obsidian because its type is bone (#e8e3d9) and the page canvas
 * resolved to white - 1.13:1, invisible on a phone. The canvas is warm ivory
 * now and the type here is on-light, so the dark island is no longer needed.
 */
const FEATURED = SIGNATURE_PIECES.slice(0, 3);

import { urlForImage } from "@/content/sanity/lib/image";

interface ProductReelMobileProps {
  products?: {
    productName: string;
    slug: string;
    imageUrl?: string;
    image?: any;
    brandName?: string;
  }[];
}

export default function ProductReelMobile({ products }: ProductReelMobileProps) {
  const activeProducts = products && products.length > 0
    ? products.map((p, idx) => {
        const fb = FEATURED[idx % FEATURED.length];
        const productImageUrl = p.image ? urlForImage(p.image).url() : p.imageUrl;
        return {
          index: `0${idx + 1}`,
          brand: p.brandName || fb.brand,
          name: p.productName,
          category: fb.category,
          finish: fb.finish,
          statement: fb.statement,
          blurb: fb.blurb,
          img: productImageUrl || fb.img,
          href: `/collections?product=${p.slug}`,
          sweepDelay: fb.sweepDelay,
        };
      })
    : FEATURED;

  const [openIndex, setOpenIndex] = useState(activeProducts[0]?.index || "01");

  return (
    <section className="w-full px-margin-mobile pt-[88px] pb-[72px] bg-[var(--surface-raised)] border-t border-[var(--border)] lg:hidden">
      <div className="flex flex-col">
        <p className="font-label-caps t-eyebrow text-brass-ink">
          Selected hardware
        </p>
        <h2 className="font-headline-md t-h2 mt-3 text-[var(--text-primary)]">
          Flagship pieces
        </h2>
      </div>

      <ul className="mt-unit-lg border-t border-[var(--border)]">
        {activeProducts.map((piece) => {
          const isOpen = piece.index === openIndex;
          const panelId = `piece-panel-${piece.index}`;

          return (
            <li key={piece.index} className="border-b border-[var(--border)]">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(piece.index)}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  className="hc-focus flex w-full items-start gap-unit-md py-5 min-h-[64px] text-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  <span className="hc-mono t-meta shrink-0 pt-1.5 text-brass-ink">
                    {piece.index}
                  </span>

                  {/* Brand reads above the name: the specifier scans for the
                      manufacturer first, and it keeps the serif name as the
                      one large object in the row. */}
                  <span className="min-w-0 flex-1">
                    <span className="hc-mono block text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                      {piece.brand}
                    </span>
                    <span className="block font-headline-md t-h3 mt-1 text-[var(--text-primary)]">
                      {piece.name}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`shrink-0 pt-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-[var(--accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeWidth={1.5} d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>

              {/* Rendered only while open. A grid 0fr-to-1fr reveal was tried
                  first and does not survive here: the container is auto-height,
                  so the available space is indefinite and both fr endpoints
                  resolve to the same content contribution - the closed track
                  measured 478px. Mounting on open also keeps three product
                  photographs off the wire until one is actually asked for. */}
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-label={`${piece.brand} ${piece.name}`}
                  className="pb-unit-lg [animation:catFadeIn_.45s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none"
                >
                  {/* Full-bleed: width stays auto so the negative margins
                      expand the frame to the viewport edges while the copy
                      below holds the section margin. */}
                  <div className="relative -mx-margin-mobile aspect-[3/2] overflow-hidden border-y border-[var(--border)] bg-[var(--surface-elevated)]">
                    {piece.img ? (
                      <Image
                        src={piece.img}
                        alt={`${piece.brand} ${piece.name.toLowerCase()} in ${piece.finish}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
                      </div>
                    )}
                  </div>

                  <p className="hc-mono t-meta mt-unit-md uppercase text-[var(--text-secondary)]">
                    {piece.finish}
                  </p>

                  <p className="t-body-sm mt-2 font-light text-[var(--text-secondary)] max-w-[62ch]">
                    {piece.statement}
                  </p>

                  <div className="mt-unit-lg flex flex-wrap items-center gap-3">
                    <a
                      href={generateWhatsAppUrl(
                        "product-enquiry",
                        `${piece.brand} ${piece.name} in ${piece.finish}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hc-focus inline-flex items-center min-h-[44px] px-unit-lg border border-[var(--accent)] text-[var(--accent)] font-ui-button text-ui-button uppercase transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:bg-[var(--accent)] active:text-white active:scale-[0.97] motion-reduce:active:scale-100"
                    >
                      Ask about this
                    </a>

                    <Link
                      href={piece.href}
                      className="hc-focus inline-flex items-center gap-2 min-h-[44px] text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] active:text-[var(--text-primary)] transition-colors"
                    >
                      View in {piece.category}
                      <svg
                        className="w-3.5 h-3.5 text-[var(--accent)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Link
        href="/collections"
        className="hc-focus mt-unit-lg flex items-center justify-center gap-3 min-h-[52px] w-full border border-[var(--border)] text-[var(--text-primary)] font-ui-button text-ui-button uppercase transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:border-[var(--accent)] active:text-[var(--accent)] active:scale-[0.98] motion-reduce:active:scale-100"
      >
        Explore the full collection
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
