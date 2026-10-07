"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Product } from "@/types/catalog";
import {
  familyForAnchor,
  type FamilyCategory,
  type ShowroomSection,
} from "@/lib/collections/showroom";
import { Button } from "@/components/ui/button";

export interface CollectionExplorerProps {
  sections: ShowroomSection<Product>[];
  familyCategories: ReadonlyMap<string, FamilyCategory[]>;
  familyImage: (familyId: string, products: Product[]) => string | undefined;
  brandLogo: (brandName: string) => string | undefined;
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (label: string) => string;
  catalogueHrefFor: (brandName: string) => string | undefined;
  activeProduct: Product | null;
  groupIdOf: (product: Product) => string;
}

/* ── hash-based deep linking ─────────────────────────────────────────── */
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => window.location.hash.slice(1);
const readServerHash = () => "";

export default function CollectionExplorer({
  sections,
  familyCategories,
  familyImage,
  enquiryHref,
}: CollectionExplorerProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  const [seenHash, setSeenHash] = useState(readServerHash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    const family = familyForAnchor(hash);
    if (family && sections.some((s) => s.group.id === family)) {
      setOpenId(family);
    } else {
      setOpenId(null);
    }
  }

  if (sections.length === 0) return null;

  const activeSection = sections.find((s) => s.group.id === openId);
  const activeCategories = activeSection
    ? familyCategories.get(activeSection.group.id) ?? []
    : [];

  return (
    <section className="w-full bg-[#fbf5ea]">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        {!activeSection ? (
          /* ═══════ LEVEL 1: HEADING + FULL-WIDTH ROWS ═══════ */
          <div className="flex flex-col w-full">
            {/* Section Header */}
            <div className="mb-10 md:mb-14">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B1A42] block mb-5">
                Collections
              </span>
              <h2 className="hc-serif text-[clamp(2rem,5vw,3.5rem)] text-[#1a1017] leading-[1.1] font-normal tracking-tight max-w-2xl">
                Find the hardware
                <br />
                for your space.
              </h2>
              <p className="mt-4 text-[15px] sm:text-base text-[#1a1017]/60 font-light max-w-lg">
                Choose what you&apos;re working on or looking for.
              </p>
            </div>

            {/* Full-Width Collection Rows */}
            <div className="w-full border-t border-[#1a1017]/10">
              {sections.map((section, index) => {
                const image = familyImage(
                  section.group.id,
                  section.products
                );
                const numStr = String(index + 1).padStart(2, "0");
                return (
                  <button
                    key={section.group.id}
                    onClick={() => {
                      setOpenId(section.group.id);
                      window.history.pushState(
                        null,
                        "",
                        `#${section.group.id}`
                      );
                    }}
                    className="group flex flex-row items-stretch w-full border-b border-[#1a1017]/10 min-h-[88px] md:min-h-[110px] text-left bg-transparent hover:bg-black/[0.015] transition-colors duration-300 overflow-hidden"
                  >
                    {/* Text Content */}
                    <div className="flex-1 flex flex-row items-center gap-4 sm:gap-6 pl-1 pr-4 sm:pr-8 py-4">
                      <span className="hc-mono text-[11px] text-[#C8A96E] font-medium shrink-0 w-6 text-right tabular-nums">
                        {numStr}
                      </span>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="hc-serif text-xl sm:text-2xl md:text-[28px] text-[#1a1017] group-hover:text-[#8B1A42] transition-colors truncate">
                          {section.group.title}
                        </span>
                        <span className="text-[12px] sm:text-[13px] text-[#1a1017]/50 font-light tracking-wide truncate">
                          {section.group.tagline}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#1a1017]/25 group-hover:text-[#8B1A42] group-hover:translate-x-1 transition-all ml-auto shrink-0" />
                    </div>

                    {/* Image — right side */}
                    <div className="w-[32%] sm:w-[30%] md:w-[28%] lg:w-[24%] shrink-0 relative bg-[#1a1017]/[0.04] overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={section.group.title}
                          fill
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 28vw, 32vw"
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ═══════ LEVEL 2: SELECTED COLLECTION → USE CASES ═══════ */
          <div className="w-full flex flex-col animate-in fade-in duration-500 fill-mode-forwards">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1017]/60">
              <button
                onClick={() => {
                  setOpenId(null);
                  window.history.pushState(
                    null,
                    "",
                    window.location.pathname
                  );
                }}
                className="hover:text-[#8B1A42] transition-colors"
              >
                Collections
              </button>
              <span>/</span>
              <span className="text-[#8B1A42]">
                {activeSection.group.title}
              </span>
            </nav>

            {/* Title */}
            <h2 className="hc-serif text-4xl sm:text-5xl text-[#1a1017] leading-tight flex items-center gap-5">
              {activeSection.group.title}
              <span
                className="hidden sm:inline-block h-px w-12 bg-[#C8A96E]"
                aria-hidden="true"
              />
            </h2>
            <p className="mt-4 mb-10 text-[15px] sm:text-base text-[#1a1017]/60 font-light max-w-2xl leading-relaxed">
              {activeSection.group.description}
            </p>

            {/* Use-Case Cards — full width grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
              {activeCategories.slice(0, 8).map((category, index) => {
                const numStr = String(index + 1).padStart(2, "0");
                return (
                  <a
                    key={category.slug}
                    href={enquiryHref(category.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col text-left border border-[#1a1017]/10 bg-[#fbf5ea] hover:border-[#8B1A42]/30 transition-colors overflow-hidden"
                  >
                    {/* Category Image */}
                    <div className="w-full aspect-[4/3] bg-[#1a1017]/[0.04] relative overflow-hidden border-b border-[#1a1017]/10">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#f5efe3]" />
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex flex-col gap-2">
                      <span className="hc-mono text-[10px] text-[#C8A96E] font-medium">
                        {numStr}
                      </span>
                      <span className="hc-serif text-base sm:text-lg text-[#1a1017] group-hover:text-[#8B1A42] transition-colors leading-snug">
                        {category.name}
                      </span>
                      {category.blurb && (
                        <span className="text-[12px] text-[#1a1017]/50 font-light line-clamp-1">
                          {category.blurb}
                        </span>
                      )}
                      <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B1A42] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="w-full border border-[#1a1017]/10 bg-[#fbf5ea] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="hc-serif text-2xl sm:text-3xl text-[#1a1017]">
                  Not sure what you need?
                </h3>
                <p className="text-[14px] text-[#1a1017]/60 font-light max-w-md">
                  Share your requirement with our team on WhatsApp and get
                  expert guidance.
                </p>
              </div>
              <Button
                asChild
                className="bg-[#8B1A42] hover:bg-[#6A1231] text-white h-12 rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors shrink-0"
              >
                <a
                  href={enquiryHref(activeSection.group.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask an expert on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
