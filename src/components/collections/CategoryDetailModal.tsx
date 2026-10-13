"use client";

import React, { useState } from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import { Product, getSlugString } from "@/types/catalog";
import { FamilyCategory } from "@/lib/collections/showroom";
import { CategoryBrandChip } from "./CollectionExplorer";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Target logo area (px²): balanced visual weight between wordmarks and emblems. */
const LOGO_AREA = 820;

function ModalBrandMark({ src, alt }: { src: string; alt: string }) {
  const [aspect, setAspect] = useState(2.5);
  const measure = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth && img.naturalHeight) {
      const next = img.naturalWidth / img.naturalHeight;
      if (Math.abs(next - aspect) > 0.01) setAspect(next);
    }
  };
  const height = Math.min(30, Math.max(14, Math.sqrt(LOGO_AREA / aspect)));
  const width = Math.min(64, height * aspect);

  return (
    <span aria-hidden="true" className="flex h-9 w-14 sm:w-16 shrink-0 items-center justify-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- brand logos are small SVG/PNG marks */}
      <img
        ref={measure}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => measure(e.currentTarget)}
        style={{ width, height }}
        className="max-w-full object-contain object-left"
      />
    </span>
  );
}

export interface CategoryDetailModalProps {
  category: FamilyCategory | null;
  familyTitle: string;
  products: Product[];
  brands: CategoryBrandChip[];
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (categoryName: string) => string;
  getImage: (product: Product) => string;
}

export default function CategoryDetailModal({
  category: propCategory,
  familyTitle,
  products,
  brands,
  isOpen,
  onClose,
  onOpenProduct,
  enquiryHref,
  getImage,
}: CategoryDetailModalProps) {
  const [prevPropCategory, setPrevPropCategory] = React.useState(propCategory);
  const [cachedCategory, setCachedCategory] = React.useState(propCategory);

  if (propCategory && propCategory !== prevPropCategory) {
    setPrevPropCategory(propCategory);
    setCachedCategory(propCategory);
  }

  const category = propCategory || cachedCategory;

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-lenis-prevent="true"
        className="max-h-[90dvh] sm:max-h-[92dvh] w-[94vw] sm:w-[95vw] max-w-4xl gap-0 overflow-hidden rounded-none border border-[var(--border)] bg-white p-0 text-[var(--text-primary)] shadow-2xl sm:max-w-4xl"
      >
        <div
          data-lenis-prevent="true"
          className="flex flex-col md:grid md:grid-cols-12 max-h-[90dvh] sm:max-h-[92dvh] h-full overflow-y-auto md:overflow-hidden overscroll-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Left Column: Category Overview & Direct Action (5 cols) */}
          <div
            data-lenis-prevent="true"
            className="md:col-span-5 bg-white border-b md:border-b-0 md:border-r border-[var(--border)] p-5 sm:p-7 flex flex-col justify-between md:overflow-y-auto overscroll-contain touch-pan-y"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div>
              {/* Category Image Header */}
              {category.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border)] mb-5">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 380px, 90vw"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Family Context & Numeral */}
              <div className="flex items-center gap-2 mb-2">
                <span className="hc-mono text-[11px] font-medium text-[var(--color-brass)] uppercase tracking-wider">
                  {familyTitle}
                </span>
                <span className="text-[var(--border)]">·</span>
                <span className="text-[11px] text-[var(--text-secondary)] font-light uppercase tracking-wider">
                  Specification
                </span>
              </div>

              <DialogTitle className="hc-serif text-2xl sm:text-3xl font-normal leading-tight text-[var(--text-primary)]">
                {category.name}
              </DialogTitle>

              <DialogDescription className="mt-3 text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">
                {category.blurb || "Curated architectural hardware specification available at our Sakchi showroom."}
              </DialogDescription>
            </div>

            {/* Showroom Consultation Box */}
            <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)]">
                Showroom Guidance
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] font-light leading-relaxed">
                Need finishes, dimensions or project estimates for {category.name}? Speak directly with our Sakchi showroom team.
              </p>
              <Button
                asChild
                className="bg-[var(--accent)] hover:opacity-90 text-white h-11 rounded-none px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity w-full mt-1"
              >
                <a
                  href={enquiryHref(category.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: Products & Brand Catalogues (7 cols) */}
          <div
            data-lenis-prevent="true"
            className="md:col-span-7 p-5 sm:p-7 md:pr-10 flex flex-col gap-7 md:overflow-y-auto md:max-h-[92dvh] bg-white overscroll-contain touch-pan-y"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Section 1: In Brand Catalogues (Primary Reference) */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--color-brass)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                    Authorized Brand Catalogues
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] font-light">
                  {brands.length} {brands.length === 1 ? "Brand Reference" : "Brand References"}
                </span>
              </div>

              {brands.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {brands.map((brand) => {
                    const total = brand.morePages + 1;
                    return (
                      <Link
                        key={brand.key}
                        href={brand.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/brand flex items-center justify-between gap-4 p-3 bg-white border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all rounded-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {brand.logo ? (
                            <ModalBrandMark src={brand.logo} alt={brand.name} />
                          ) : (
                            <span className="h-9 w-14 shrink-0 flex items-center justify-center font-bold text-xs uppercase bg-[var(--surface-elevated)] text-[var(--text-primary)]">
                              {brand.name.slice(0, 2)}
                            </span>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[var(--text-primary)] group-hover/brand:text-[var(--accent)] transition-colors truncate">
                              {brand.name}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] font-light tabular-nums">
                              Best match: <strong className="font-medium text-[var(--text-primary)]">Page {brand.bestPage}</strong>
                              {total > 1 ? ` · ${total} matching pages` : " · 1 matching page"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] shrink-0">
                          <span className="hidden sm:inline">Open Catalogue</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/brand:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white border border-[var(--border)] text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">
                  Manufacturer catalogues for {category.name} can be reviewed on display at our Sakchi showroom or shared on request.
                </div>
              )}
            </div>

            {/* Section 2: Showroom Products */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-brass)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                    Showroom Display Products
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] font-light">
                  {products.length} {products.length === 1 ? "Specimen" : "Specimens"}
                </span>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product) => {
                    const brandName = product.brandName || product.brand;
                    const img = getImage(product);
                    return (
                      <button
                        key={getSlugString(product.slug) || product.name}
                        type="button"
                        onClick={(e) => {
                          onOpenProduct(product, e.currentTarget);
                        }}
                        className="group/product flex items-center gap-3 p-2.5 bg-white border border-[var(--border)] hover:border-[var(--color-brass)] text-left transition-colors cursor-pointer"
                      >
                        <div className="relative w-12 h-12 shrink-0 bg-[var(--surface-elevated)] border border-[var(--border)] overflow-hidden">
                          {img ? (
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[12px] font-medium text-[var(--text-primary)] group-hover/product:text-[var(--accent)] transition-colors line-clamp-1">
                            {product.name}
                          </span>
                          {brandName && (
                            <span className="hc-mono text-[10px] uppercase tracking-wider text-[var(--color-brass)]">
                              {brandName}
                            </span>
                          )}
                          <span className="text-[10px] text-[var(--text-secondary)] font-light mt-0.5">
                            Click to view details →
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white border border-[var(--border)] text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">
                  Full finish samples and mounting mock-ups for {category.name} are available live at our Sakchi showroom.
                </div>
              )}
            </div>

            {/* Quick cross-link to all catalogues */}
            <div className="pt-2 text-center">
              <Link
                href="/catalogues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Browse All Brand Official Catalogues</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
