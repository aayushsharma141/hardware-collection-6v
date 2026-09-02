import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_FAMILIES, type CategoryFamily } from "@/content/fallback/home";

/**
 * MobileCategoryDiscovery - the showroom families, as one specimen and an index.
 *
 * Every family used to render as its own full-bleed 4:5 card. Five equally
 * weighted blocks ran to 2425px on an 812px screen: three viewports to read a
 * set of five, and no moment at which the set was ever visible as a set.
 * Breadth of physical display is the positioning here, and a vertical run of
 * identical cards is the one layout that hides it.
 *
 * The data already carried the hierarchy the layout ignored - `isFocal` marks
 * door hardware as the lead. That family takes the photograph; the other four
 * resolve into a hairline index that fits in a glance. The visitor sees all
 * five and chooses one, instead of scrolling past them one at a time.
 */
const focal: CategoryFamily =
  CATEGORY_FAMILIES.find((family) => family.isFocal) ?? CATEGORY_FAMILIES[0];
const index: CategoryFamily[] = CATEGORY_FAMILIES.filter(
  (family) => family.id !== focal.id
);

/** "01 / 05" is desktop's format; the index rows only need the position. */
const position = (family: CategoryFamily) => family.index.split(" ")[0];

const fullName = (family: CategoryFamily) =>
  family.nameBreak ? `${family.name} ${family.nameBreak}` : family.name;

export default function MobileCategoryDiscovery() {
  return (
    /* Uneven vertical rhythm: every mobile section used to carry an identical
       64px top and bottom, which reads as a stack of equal slabs. Each chapter
       now opens with more air than it closes with, and the amount varies by the
       weight of the chapter. */
    <section className="w-full px-margin-mobile pt-[104px] pb-[72px] bg-surface-obsidian lg:hidden">
      <div className="flex flex-col">
        <p className="font-label-caps t-eyebrow text-[#c8a96e]">
          Showroom families
        </p>
        <h2 className="font-headline-md t-h2 mt-3 text-text-bone">
          Five thresholds
        </h2>
        <p className="t-body mt-4 font-light text-text-muted max-w-[34ch]">
          From the entrance door to the last drawer runner.
        </p>
      </div>

      {/* The lead specimen carries the photography for the whole set, and runs
          edge to edge while the type stays inset. Inside a single column that
          offset is where the asymmetry lives — the photograph breaks the
          margin the rest of the section obeys. */}
      <Link
        href={focal.href}
        className="hc-focus group relative -mx-margin-mobile mt-[52px] block aspect-[4/5] overflow-hidden border-y border-outline-variant bg-surface-graphite transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <Image
          src={focal.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover opacity-80 transition-[opacity,transform] duration-500 ease-out group-active:scale-[1.03] group-active:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian via-surface-obsidian/35 to-transparent" />

        {/* Now the frame is full-bleed, its type realigns to the section margin
            so it sits on the same left edge as the heading above it. */}
        <span className="absolute left-margin-mobile top-unit-lg hc-mono t-meta text-[#c8a96e]">
          {position(focal)}
        </span>

        <div className="absolute inset-x-0 bottom-0 px-margin-mobile pb-unit-lg">
          <h3 className="font-headline-md t-h3 text-text-bone">
            {fullName(focal)}
          </h3>
          <p className="t-body-sm mt-2.5 font-light text-text-muted max-w-[34ch]">
            {focal.detail}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-text-bone">
            View {fullName(focal)}
            <Arrow className="w-3.5 h-3.5 text-[#c8a96e] transition-transform duration-200 group-active:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* The remaining four, as an index rather than four more photographs.
          Rows rise in sequence on load — one authored moment for the section,
          in CSS so it cannot depend on JS to become readable. */}
      <ul className="mt-[52px] border-t border-outline-variant">
        {index.map((family, i) => (
          <li key={family.id} className="border-b border-outline-variant">
            <Link
              href={family.href}
              /* Load-in cascade, transform only. An opacity-from-0 reveal was
                 tried both ways here — motion's `whileInView` and a CSS fade —
                 and each leaves the row invisible for as long as the timeline
                 is stalled. Rising 8px from a fully opaque default gives the
                 same cascade with no state in which the row cannot be read. */
              style={{ animationDelay: `${i * 80}ms` }}
              className="hc-focus group flex items-center gap-unit-md py-4 min-h-[72px] [animation:catRise_.5s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <span className="hc-mono t-meta shrink-0 text-[#c8a96e]">
                {position(family)}
              </span>

              <span className="relative shrink-0 w-14 h-[62px] overflow-hidden bg-surface-graphite">
                <Image
                  src={family.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover opacity-90 transition-opacity duration-300 group-active:opacity-100"
                />
              </span>

              {/* Name only. The four supporting lines that used to sit here
                  made all five families read at the same weight, which is the
                  hierarchy the focal frame above exists to establish. */}
              <span className="min-w-0 flex-1 font-headline-md t-h4 text-text-bone">
                {fullName(family)}
              </span>

              <Arrow className="w-4 h-4 shrink-0 text-[#c8a96e] transition-transform duration-200 group-active:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
