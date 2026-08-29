import React from "react";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/config";
import { SIGNATURE_PIECES } from "@/data/home";

/**
 * MobileProductReel — flagship pieces, with a per-piece WhatsApp handoff.
 *
 * The three pieces here are the first of the shared signature set, so mobile
 * and desktop name the same hardware from the same authorized brands. The
 * earlier version invented two products ("The Obsidian Lever", "Aura Smart
 * Lock") that are in no catalog.
 *
 * Each inquiry carries the brand and the finish into the message, so the
 * specialist opens the conversation already knowing what is being asked about.
 */
const FEATURED = SIGNATURE_PIECES.slice(0, 3);

export default function MobileProductReel() {
  return (
    <section className="w-full py-unit-xl bg-background flex flex-col space-y-unit-xl border-t border-outline-variant lg:hidden">
      <div className="px-margin-mobile flex flex-col space-y-unit-xs">
        <p className="font-label-caps text-label-caps text-primary uppercase">
          Selected hardware
        </p>
        <h2 className="font-headline-md text-[30px] leading-[1.1] text-text-bone">
          Flagship pieces
        </h2>
      </div>

      <div className="flex flex-col space-y-unit-xl">
        {FEATURED.map((piece) => (
          <article
            key={piece.index}
            className="flex flex-col px-margin-mobile gap-base"
          >
            <div className="relative w-full aspect-[4/5] bg-surface-graphite border border-outline-variant overflow-hidden">
              <Image
                src={piece.img}
                alt={`${piece.brand} ${piece.name.toLowerCase()} in ${piece.finish}`}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <span className="absolute left-unit-md top-unit-md hc-mono text-[10px] tracking-[0.16em] text-primary">
                {piece.index}
              </span>
            </div>

            <div className="w-full flex flex-col space-y-unit-sm">
              <p className="hc-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {piece.brand}
                <span className="text-text-muted"> · {piece.finish}</span>
              </p>

              <h3 className="font-headline-md text-[26px] leading-[1.15] text-text-bone">
                {piece.name}
              </h3>

              <p className="font-body-md text-[14px] leading-[1.65] font-light text-text-muted max-w-[46ch]">
                {piece.blurb}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-unit-sm">
                <a
                  href={buildWhatsAppUrl(
                    `Hi Hardware Collection, I'd like details on the ${piece.brand} ${piece.name} in ${piece.finish}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hc-focus inline-flex items-center min-h-[44px] px-unit-lg border border-primary text-text-bone font-ui-button text-ui-button uppercase transition-colors duration-200 hover:bg-primary hover:text-on-primary active:bg-primary active:text-on-primary"
                >
                  Ask about this
                </a>

                <Link
                  href={piece.href}
                  className="hc-focus inline-flex items-center gap-2 min-h-[44px] text-[10px] uppercase tracking-[0.18em] text-text-muted hover:text-text-bone transition-colors"
                >
                  View in {piece.category}
                  <svg
                    className="w-3.5 h-3.5 text-primary"
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
          </article>
        ))}
      </div>

      <div className="px-margin-mobile">
        <Link
          href="/collections"
          className="hc-focus flex items-center justify-center gap-3 min-h-[52px] w-full border border-outline-variant text-text-bone font-ui-button text-ui-button uppercase transition-colors duration-200 hover:border-primary hover:text-primary"
        >
          Explore the full collection
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
