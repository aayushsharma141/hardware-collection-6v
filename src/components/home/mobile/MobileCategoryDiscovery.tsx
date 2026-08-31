import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_FAMILIES } from "@/content/fallback/home";

/**
 * MobileCategoryDiscovery — the showroom families, as cards.
 *
 * Reads the same five families as the desktop chapter. It previously listed
 * three of its own under different names, pointed at `/categories/*` routes
 * that do not exist on this site, so every card was a 404.
 */
export default function MobileCategoryDiscovery() {
  return (
    <section
      className="w-full px-margin-mobile py-unit-xl bg-surface-obsidian flex flex-col space-y-unit-lg lg:hidden"
    >
      <div className="flex flex-col space-y-unit-xs">
        <p className="font-label-caps text-label-caps text-primary uppercase">
          Showroom families
        </p>
        <h2 className="font-headline-md text-[30px] leading-[1.1] tracking-normal text-text-bone">
          Five thresholds
        </h2>
        <p className="pt-1 text-[13px] leading-[1.6] font-light text-text-muted max-w-[38ch]">
          A considered route through architectural hardware, security, bath,
          kitchen systems and the joinery details that finish a room.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-base">
        {CATEGORY_FAMILIES.map((family) => (
          <Link
            key={family.id}
            href={family.href}
            className="group relative aspect-[4/5] bg-surface-graphite border border-outline-variant overflow-hidden"
          >
            <Image
              src={family.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover opacity-80 transition-[opacity,transform] duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.03] group-active:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian via-surface-obsidian/35 to-transparent" />

            <span className="absolute left-unit-md top-unit-md hc-mono text-[10px] tracking-[0.16em] text-primary">
              {family.index}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-unit-md">
              <h3 className="font-headline-md text-[26px] leading-[1.05] text-text-bone">
                {family.name}
                {family.nameBreak ? ` ${family.nameBreak}` : ""}
              </h3>
              <p className="mt-1.5 text-[12px] leading-[1.5] font-light text-text-muted max-w-[34ch]">
                {family.subtitle}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-text-bone">
                View {family.name}
                <svg
                  className="w-3.5 h-3.5 text-primary transition-transform duration-200 group-hover:translate-x-1"
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
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
