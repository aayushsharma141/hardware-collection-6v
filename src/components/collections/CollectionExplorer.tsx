"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
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
const readHash = () => (typeof window !== "undefined" ? window.location.hash.slice(1) : "");
const readServerHash = () => "";

export default function CollectionExplorer({
  sections,
  familyCategories,
  familyImage,
  enquiryHref,
}: CollectionExplorerProps) {
  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  const [openId, setOpenId] = useState<string | null>(() => {
    const family = familyForAnchor(hash);
    return family && sections.some((s) => s.group.id === family) ? family : sections[0]?.group.id ?? null;
  });

  const [seenHash, setSeenHash] = useState(hash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    const family = familyForAnchor(hash);
    if (family && sections.some((s) => s.group.id === family)) {
      setOpenId(family);
    }
  }

  if (sections.length === 0) return null;

  return (
    <section className="w-full bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-12 md:py-20">
        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] block mb-3">
            Showroom Taxonomy
          </span>
          <h2 className="hc-serif text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)] leading-[1.1] font-normal tracking-tight max-w-2xl">
            Find the hardware
            <br />
            for your space.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--text-secondary)] font-light max-w-lg">
            Explore our curated collections by application. Expand any space to see the full category specification.
          </p>
        </div>

        {/* 7 Canonical Showroom Families Rendered in Server HTML */}
        <div className="w-full border-t border-[var(--border)] flex flex-col">
          {sections.map((section, index) => {
            const image = familyImage(section.group.id, section.products);
            const numStr = String(index + 1).padStart(2, "0");
            const isOpen = openId === section.group.id;
            const categories = familyCategories.get(section.group.id) ?? [];

            return (
              <details
                key={section.group.id}
                id={section.group.id}
                open={isOpen}
                onToggle={(e) => {
                  const target = e.currentTarget;
                  if (target.open) {
                    setOpenId(section.group.id);
                    if (window.location.hash !== `#${section.group.id}`) {
                      window.history.pushState(null, "", `#${section.group.id}`);
                    }
                  } else if (openId === section.group.id) {
                    setOpenId(null);
                  }
                }}
                className="group border-b border-[var(--border)] overflow-hidden transition-colors"
              >
                <summary className="list-none flex flex-row items-stretch w-full min-h-[88px] md:min-h-[110px] text-left cursor-pointer hover:bg-black/[0.015] transition-colors duration-300 select-none">
                  {/* Left Metadata & Title */}
                  <div className="flex-1 flex flex-row items-center gap-4 sm:gap-6 pl-1 pr-4 sm:pr-8 py-4">
                    <span className="hc-mono text-[11px] text-[var(--color-brass)] font-medium shrink-0 w-6 text-right tabular-nums">
                      {numStr}
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="hc-serif text-xl sm:text-2xl md:text-[28px] text-[var(--text-primary)] group-open:text-[var(--accent)] transition-colors truncate">
                        {section.group.title}
                      </span>
                      <span className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-light tracking-wide truncate">
                        {section.group.tagline}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)] hidden sm:inline-block">
                        {isOpen ? "Collapse" : "Explore"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] group-open:rotate-180 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Right Image Thumbnail */}
                  <div className="w-[32%] sm:w-[30%] md:w-[28%] lg:w-[24%] shrink-0 relative bg-[var(--surface-elevated)] overflow-hidden">
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
                </summary>

                {/* Expanded Family Detail & Crawlable Category Directory */}
                <div className="pt-6 pb-12 px-2 sm:px-6 md:px-8 bg-[var(--surface)]">
                  <div className="max-w-3xl mb-8">
                    <p className="text-[15px] sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                      {section.group.description}
                    </p>
                  </div>

                  {/* Use-Case & Category Cards */}
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
                      {categories.map((category, catIndex) => {
                        const catNumStr = String(catIndex + 1).padStart(2, "0");
                        return (
                          <a
                            key={category.slug}
                            href={enquiryHref(category.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/card flex flex-col text-left border border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--accent)]/40 transition-colors overflow-hidden"
                          >
                            {/* Category Image */}
                            <div className="w-full aspect-[4/3] bg-[var(--surface-elevated)] relative overflow-hidden border-b border-[var(--border)]">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                  className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-[var(--surface-elevated)]" />
                              )}
                            </div>

                            {/* Card Body */}
                            <div className="p-4 sm:p-5 flex flex-col gap-2">
                              <span className="hc-mono text-[10px] text-[var(--color-brass)] font-medium">
                                {catNumStr}
                              </span>
                              <span className="hc-serif text-base sm:text-lg text-[var(--text-primary)] group-hover/card:text-[var(--accent)] transition-colors leading-snug">
                                {category.name}
                              </span>
                              {category.blurb && (
                                <span className="text-[12px] text-[var(--text-secondary)] font-light line-clamp-2">
                                  {category.blurb}
                                </span>
                              )}
                              <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] flex items-center gap-1.5 group-hover/card:gap-2.5 transition-all">
                                Enquire
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)] font-light mb-8">
                      Full catalogue samples and finishes available on display at our Sakchi showroom.
                    </p>
                  )}

                  {/* WhatsApp Consultation Banner */}
                  <div className="w-full border border-[var(--border)] bg-[var(--surface-raised)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="hc-serif text-2xl sm:text-3xl text-[var(--text-primary)]">
                        Need guidance on {section.group.title}?
                      </h3>
                      <p className="text-[14px] text-[var(--text-secondary)] font-light max-w-md">
                        Share your drawings or requirement with our Sakchi showroom team on WhatsApp.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-[var(--accent)] hover:opacity-90 text-white h-12 rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors shrink-0"
                    >
                      <a
                        href={enquiryHref(section.group.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ask an expert on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
