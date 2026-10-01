import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_FAMILIES, type CategoryFamily } from "@/content/fallback/home";

/**
 * CategoryDiscoveryMobile - the showroom families, as one specimen and an index.
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
interface CategoryDiscoveryMobileProps {
  categories?: {
    categoryName: string;
    slug: string;
    imageUrl?: string;
    description?: string;
  }[];
}

export default function CategoryDiscoveryMobile({ categories }: CategoryDiscoveryMobileProps) {
  const activeFamilies = categories && categories.length > 0
    ? categories.map((c, idx) => {
        const fallback = CATEGORY_FAMILIES.find(f =>
          c.slug.includes(f.id) ||
          f.id === "handles" && c.slug.includes("handle") ||
          f.id === "door" && (c.slug.includes("door") || c.slug.includes("lock")) ||
          f.id === "bathroom" && c.slug.includes("bath") ||
          f.id === "kitchen" && (c.slug.includes("kitchen") || c.slug.includes("wardrobe")) ||
          f.id === "furniture" && c.slug.includes("furniture")
        ) || CATEGORY_FAMILIES[idx % CATEGORY_FAMILIES.length];
        return {
          id: c.slug,
          index: `0${idx + 1}`,
          name: c.categoryName,
          nameBreak: undefined,
          subtitle: c.description || fallback.subtitle,
          detail: fallback.detail,
          image: c.imageUrl || fallback.image,
          href: `/catalogs?category=${c.slug}`,
          isFocal: idx === 1,
        };
      })
    : CATEGORY_FAMILIES;

  const focal: CategoryFamily =
    activeFamilies.find((family) => family.isFocal) ?? activeFamilies[0];
  const index: CategoryFamily[] = activeFamilies.filter(
    (family) => family.id !== focal.id
  );

  const fullName = (family: CategoryFamily) =>
    family.nameBreak ? `${family.name} ${family.nameBreak}` : family.name;

  return (
    <section className="w-full px-margin-mobile pt-[104px] pb-[72px] bg-[#fbf5ea] border-t border-[#1a1017]/[0.08] lg:hidden">
      <div className="flex flex-col">
        <p className="font-label-caps t-eyebrow text-[#8b1a42] font-semibold tracking-[0.22em] uppercase text-xs">
          Showroom families
        </p>
        <h2 className="font-headline-md t-h2 mt-3 text-[#1a1017] text-3xl sm:text-4xl font-light">
          Five thresholds
        </h2>
        <p className="t-body mt-4 font-light text-[#5a4854] max-w-[34ch] text-sm sm:text-base leading-relaxed">
          From the entrance door to the last drawer runner.
        </p>
      </div>

      {/* The lead specimen carries the photography for the whole set, and runs
          edge to edge while the type stays inset. */}
      <Link
        href={focal.href}
        className="hc-focus group relative -mx-margin-mobile mt-[52px] block aspect-[4/5] overflow-hidden border-y border-[#1a1017]/[0.10] bg-[#f7f0e2] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {focal.image ? (
          <Image
            src={focal.image}
            alt={`${fullName(focal)} premium architectural hardware`}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover transition-transform duration-500 ease-out group-active:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1017]/85 via-[#1a1017]/30 to-transparent" />

        {/* Sequential 01 for the focal lead item */}
        <span className="absolute left-margin-mobile top-unit-lg hc-mono text-xs uppercase tracking-[0.2em] font-medium text-white bg-[#1a1017]/60 px-2.5 py-1 rounded backdrop-blur-sm">
          01
        </span>

        <div className="absolute inset-x-0 bottom-0 px-margin-mobile pb-unit-lg">
          <h3 className="font-headline-md t-h3 text-white text-2xl font-normal">
            {fullName(focal)}
          </h3>
          <p className="t-body-sm mt-2.5 font-light text-zinc-200 max-w-[34ch] text-xs sm:text-sm leading-relaxed">
            {focal.detail}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-white">
            View {fullName(focal)}
            <Arrow className="w-3.5 h-3.5 text-[#c8a96e] transition-transform duration-200 group-active:translate-x-1" />
          </span>
        </div>
      </Link>

      {/* The remaining four, numbered sequentially 02 to 05 */}
      <ul className="mt-[52px] border-t border-[#1a1017]/[0.10]">
        {index.map((family, i) => {
          const rowPosition = String(i + 2).padStart(2, "0");
          return (
            <li key={family.id} className="border-b border-[#1a1017]/[0.10]">
              <Link
                href={family.href}
                style={{ animationDelay: `${i * 80}ms` }}
                className="hc-focus group flex items-center gap-unit-md py-4 min-h-[72px] [animation:catRise_.5s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <span className="hc-mono t-meta shrink-0 text-[#8b1a42] font-semibold text-xs tracking-wider">
                  {rowPosition}
                </span>

                <span className="relative shrink-0 w-14 h-[62px] overflow-hidden rounded bg-[#f7f0e2] border border-[#1a1017]/[0.08]">
                  {family.image ? (
                    <Image
                      src={family.image}
                      alt={`${fullName(family)} hardware collection`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-raised)]">
                      <span className="text-[8px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Wait</span>
                    </div>
                  )}
                </span>

                <span className="min-w-0 flex-1 font-headline-md text-lg text-[#1a1017] group-hover:text-[#8b1a42] transition-colors">
                  {fullName(family)}
                </span>

                <Arrow className="w-4 h-4 shrink-0 text-[#8b1a42] transition-transform duration-200 group-active:translate-x-1" />
              </Link>
            </li>
          );
        })}
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
