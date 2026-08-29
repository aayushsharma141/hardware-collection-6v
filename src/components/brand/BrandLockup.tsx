import React from "react";
import Image from "next/image";

const EMBLEM_SRC = "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png";

const COLLECTION_LETTERS = "COLLECTION".split("");

// Measured alpha bounding box of the emblem PNG: on its 1167x1167 canvas the mark
// occupies x 76-1103, y 211-984 — a third of the height is transparent padding.
// Sizing the box to the canvas therefore renders the emblem ~34% smaller than it
// looks like it should, so these fractions pull the layout box in to hug the mark.
// Box side, in em, per layout. Each is (that layout's text-block height) / 0.6632,
// so the *visible* mark ends up exactly as tall as the type beside it. The stacked
// wordmark is 2.49em tall; the inline one is 1.66em.
const EMBLEM_BOX_EM = { stacked: 3.75, inline: 2.8 } as const;
const EMBLEM_PAD = { top: 0.1808, bottom: 0.156, left: 0.0651 } as const;

export interface BrandLockupProps {
  /**
   * "stacked" sets COLLECTION beneath HARDWARE, width-matched, with the tagline
   * signed off to the right — the full mark, for the footer. "inline" runs
   * HARDWARE COLLECTION across one line with the tagline left-aligned beneath,
   * which is what fits inside the navbar's fixed-height pill.
   */
  layout?: "stacked" | "inline";
  /** Any CSS length; every part of the mark is sized in em from this one value. */
  fontSize: string;
  showTagline?: boolean;
  /** The navbar mark is above the fold, so it opts out of lazy loading. */
  priority?: boolean;
  /** Rendered width of the emblem bitmap, passed through to next/image. */
  emblemSizes?: string;
  className?: string;
}

/**
 * The Hardware Collection mark: the real HC emblem beside a wordmark recreated in
 * text. Callers supply their own <Link> wrapper (so click handling and the
 * accessible name stay at the call site) and must put `group` on it for the hover
 * transitions here to fire.
 */
export function BrandLockup({
  layout = "stacked",
  fontSize,
  showTagline = true,
  priority = false,
  emblemSizes = "120px",
  className = "",
}: BrandLockupProps) {
  const box = EMBLEM_BOX_EM[layout];

  const tagline = (
    <span
      className={`${
        layout === "stacked"
          ? "mt-[0.62em]"
          : "mt-[0.76em] brand-tagline-optional"
      } self-end
      whitespace-nowrap italic font-normal leading-[1.15] text-[#C8A96E] transition-colors duration-300 group-hover:text-[#E5C487]`}
      style={{
        fontSize: layout === "stacked" ? "0.44em" : "0.5em",
        letterSpacing: "0.015em",
        fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
      }}
    >
      The Jewelry of Fittings
    </span>
  );

  return (
    <span
      className={`inline-flex items-stretch align-bottom gap-[0.45em] max-w-full leading-none ${className}`}
      style={{
        fontFamily:
          "var(--font-manrope), var(--font-dmsans), -apple-system, sans-serif",
        fontSize,
      }}
    >
      {/* The 3D HC emblem — the actual brand asset, not a CSS approximation. The
          negative margins pull the layout box in to hug the visible mark (see
          EMBLEM_PAD), so the emblem optically matches the wordmark's height
          instead of rendering a third smaller inside its own padding. */}
      <span
        className="relative block shrink-0 self-center"
        style={{
          width: `${box}em`,
          height: `${box}em`,
          marginTop: `${-(box * EMBLEM_PAD.top).toFixed(3)}em`,
          marginBottom: `${-(box * EMBLEM_PAD.bottom).toFixed(3)}em`,
          marginLeft: `${-(box * EMBLEM_PAD.left).toFixed(3)}em`,
        }}
      >
        <Image
          src={EMBLEM_SRC}
          alt=""
          fill
          sizes={emblemSizes}
          priority={priority}
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </span>

      <span className="flex flex-col items-stretch justify-center min-w-0">
        {layout === "stacked" ? (
          <>
            {/* HARDWARE — crimson, moderately tight tracking. The negative right
                margin cancels the trailing letter-space so the stack's width is the
                visual glyph run, which the two lines below align themselves to. */}
            <span
              className="font-semibold uppercase text-[#A31D4A] transition-colors duration-300 group-hover:text-[#B8285A]"
              style={{ letterSpacing: "0.05em", marginRight: "-0.05em" }}
            >
              HARDWARE
            </span>

            {/* COLLECTION — ivory, lighter weight, letters distributed edge to edge
                so the word matches HARDWARE's width exactly rather than by a guessed
                tracking value. Real text, so it scales and reflows; the wrapping
                link's aria-label carries the accessible name, so the split letters
                are hidden from assistive tech rather than spelled out. */}
            <span
              className="mt-[0.32em] flex justify-between font-normal uppercase text-[#E8E3D9] transition-colors duration-300 group-hover:text-white"
              aria-hidden="true"
              style={{ fontSize: "0.54em" }}
            >
              {COLLECTION_LETTERS.map((letter, i) => (
                <span key={`${letter}-${i}`}>{letter}</span>
              ))}
            </span>
          </>
        ) : (
          /* One line, baseline-aligned: HARDWARE at full size, COLLECTION smaller
             and tracked out. The negative right margin again trims the trailing
             letter-space so the tagline below starts flush with the same left edge. */
          <span className="flex items-baseline gap-[0.5em] whitespace-nowrap">
            <span
              className="font-semibold uppercase text-[#A31D4A] transition-colors duration-300 group-hover:text-[#B8285A]"
              style={{ letterSpacing: "0.05em", marginRight: "-0.05em" }}
            >
              HARDWARE
            </span>
            <span
              className="font-normal uppercase text-[#E8E3D9] transition-colors duration-300 group-hover:text-white"
              style={{
                fontSize: "0.76em",
                letterSpacing: "0.27em",
                marginRight: "-0.27em",
              }}
            >
              COLLECTION
            </span>
          </span>
        )}

        {showTagline ? tagline : null}
      </span>
    </span>
  );
}
