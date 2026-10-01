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
// wordmark is 2.49em tall (2.49 / 0.6632 ≈ 3.75); the inline wordmark is 0.98em
// tall (0.98 / 0.6632 ≈ 1.48).
const EMBLEM_BOX_EM = { stacked: 3.75, inline: 1.48 } as const;
const EMBLEM_PAD = { top: 0.1808, bottom: 0.156, left: 0.0651 } as const;

export interface BrandLockupProps {
  /**
   * "stacked" sets COLLECTION beneath HARDWARE, width-matched — the full mark,
   * for the footer. "inline" runs HARDWARE COLLECTION across one line, which is
   * what fits inside the navbar's fixed-height pill.
   */
  layout?: "stacked" | "inline";
  /** Any CSS length; every part of the mark is sized in em from this one value. */
  fontSize: string;
  /** The navbar mark is above the fold, so it opts out of lazy loading. */
  priority?: boolean;
  /** Rendered width of the emblem bitmap, passed through to next/image. */
  emblemSizes?: string;
  /**
   * Plays the entrance on mount — emblem scale-in, wordmark slide — and then
   * runs the metallic sweep across the mark on a continuous repeating cycle.
   * Reserved for the navbar, where the mark is the page's visual anchor.
   */
  animateEntrance?: boolean;
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
  priority = false,
  emblemSizes = "120px",
  animateEntrance = false,
  className = "",
}: BrandLockupProps) {
  const box = EMBLEM_BOX_EM[layout];

  return (
    <span
      className={`brand-lockup relative inline-flex items-stretch align-bottom gap-[0.45em] max-w-full leading-none ${
        animateEntrance ? "brand-lockup--enter" : ""
      } ${className}`}
      style={{
        // Jost — a geometric sans in the Futura lineage. Futura itself is a
        // licensed Monotype face; point --font-wordmark at self-hosted files
        // when a licence is bought and nothing here changes.
        fontFamily:
          "var(--font-wordmark), var(--font-manrope), var(--font-dmsans), -apple-system, sans-serif",
        fontSize,
      }}
    >
      {/* The 3D HC emblem — the actual brand asset, not a CSS approximation. The
          negative margins pull the layout box in to hug the visible mark (see
          EMBLEM_PAD), so the emblem optically matches the wordmark's height
          instead of rendering a third smaller inside its own padding. */}
      <span
        className="brand-lockup__emblem relative block shrink-0 self-center"
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
          alt="Hardware Collection Emblem"
          fill
          sizes={emblemSizes}
          priority={priority}
          className="brand-lockup__emblem-img object-contain"
        />
      </span>

      <span className="brand-lockup__words flex flex-col items-stretch justify-center min-w-0">
        {layout === "stacked" ? (
          <>
            {/* HARDWARE — crimson, moderately tight tracking. The negative right
                margin cancels the trailing letter-space so the stack's width is the
                visual glyph run, which the two lines below align themselves to. */}
            <span
              className="font-medium uppercase text-[#8b1a42] transition-colors duration-300 group-hover:text-[#6b1432]"
              style={{ letterSpacing: "0.055em", marginRight: "-0.055em" }}
            >
              HARDWARE
            </span>

            {/* COLLECTION — charcoal, lighter weight, letters distributed edge to edge
                so the word matches HARDWARE's width exactly rather than by a guessed
                tracking value. Real text, so it scales and reflows; the wrapping
                link's aria-label carries the accessible name, so the split letters
                are hidden from assistive tech rather than spelled out. */}
            <span
              className="mt-[0.3em] flex justify-between font-medium uppercase text-[#1a1017] transition-colors duration-300 group-hover:text-[#3d2e38]"
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
             letter-space so the mark ends on the glyph rather than on tracking. */
          /* Both words at one cap height and one weight, as the approved
             wordmark sets them; COLLECTION carries the wider tracking. */
          <span className="flex items-baseline gap-[0.42em] whitespace-nowrap">
            <span
              className="font-medium uppercase text-[#8b1a42] transition-colors duration-300 group-hover:text-[#6b1432]"
              style={{ letterSpacing: "0.055em", marginRight: "-0.055em" }}
            >
              HARDWARE
            </span>
            <span
              className="font-medium uppercase text-[#1a1017] transition-colors duration-300 group-hover:text-[#3d2e38]"
              style={{ letterSpacing: "0.1em", marginRight: "-0.1em" }}
            >
              COLLECTION
            </span>
          </span>
        )}

      </span>

      {/* Recurring metallic pass over the finished mark. Purely decorative,
          sits above the lockup and clips to it; removed entirely under
          prefers-reduced-motion. */}
      {animateEntrance && (
        <span className="brand-lockup__sheen" aria-hidden="true" />
      )}
    </span>
  );
}
