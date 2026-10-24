import type React from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";

export interface ShowroomPhoto {
  _key?: string;
  url?: string;
  lqip?: string;
  width?: number;
  height?: number;
}

interface ShowroomGalleryProps {
  photos?: ShowroomPhoto[];
}

/** Photos per row the layout is designed for; more would shrink each below a useful size. */
const MAX_PHOTOS = 4;

/** Tallest the desktop row is allowed to be, in px; wider sets of photos are narrowed to match. */
const MAX_ROW_HEIGHT = 560;
const GAP = 24;

/** Width over height, so each photo keeps its own shape; square when Sanity did not report one. */
export function photoRatio(photo: ShowroomPhoto): number {
  return photo.width && photo.height ? photo.width / photo.height : 1;
}

/**
 * The `sizes` hint for one photo: the full width when stacked, and on desktop its share of the
 * viewport, but never more than it can be drawn at (its shape times the row height cap).
 */
export function photoSizes(ratio: number, totalRatio: number): string {
  const share = Math.round((100 * ratio) / totalRatio);
  const maxWidth = Math.round(ratio * MAX_ROW_HEIGHT);
  return `(max-width: 1023px) 100vw, min(${share}vw, ${maxWidth}px)`;
}

/**
 * Inside the showroom: the photographs in Studio's Home Page > Showroom Gallery,
 * shown at their own proportions. On desktop they sit in one row of equal height
 * (each photo's share of the width follows its shape); on phones they stack.
 *
 * Studio images carry no alt text, so each gets a plain description by position.
 * Renders nothing while the field is empty.
 */
export default function ShowroomGallery({ photos }: ShowroomGalleryProps) {
  const items = (photos ?? []).filter((photo) => photo.url).slice(0, MAX_PHOTOS);
  if (items.length === 0) return null;
  // Photos share one row height, so the row is as wide as the heights allow: ratios summed, times the cap.
  const totalRatio = items.reduce((sum, photo) => sum + photoRatio(photo), 0);
  const rowMaxWidth = Math.round(totalRatio * MAX_ROW_HEIGHT + GAP * (items.length - 1));

  return (
    <section id="showroom-photos" aria-labelledby="showroom-photos-heading" className="py-16 lg:py-24 border-t border-[var(--border)] text-[var(--text-primary)]">
      <div className="px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--border)] pb-6 lg:pb-8">
          <h2 id="showroom-photos-heading" className="hc-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] font-light tracking-[-0.01em] text-balance">
            Inside the showroom
          </h2>
          <p className="max-w-[420px] text-base lg:text-lg leading-relaxed text-[var(--text-secondary)] font-light text-pretty lg:text-right">
            See, handle and compare the hardware in person, in Sakchi, Jamshedpur.
          </p>
        </div>

        <ul
          className="mt-8 lg:mt-10 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:mx-auto lg:max-w-[var(--row-max)]"
          style={{ "--row-max": `${rowMaxWidth}px` } as React.CSSProperties}
        >
          {items.map((photo, index) => {
            const ratio = photoRatio(photo);
            return (
              <li
                key={photo._key ?? `${photo.url}-${index}`}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] lg:min-w-0 lg:[flex-grow:var(--ratio)] lg:[flex-basis:0]"
                style={{ aspectRatio: ratio, "--ratio": ratio } as React.CSSProperties}
              >
                <Image
                  src={photo.url as string}
                  alt={`Hardware Collection showroom in Sakchi, photograph ${index + 1} of ${items.length}`}
                  fill
                  sizes={photoSizes(ratio, totalRatio)}
                  placeholder={photo.lqip ? "blur" : "empty"}
                  blurDataURL={photo.lqip}
                  className="object-cover"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
