"use client";

import React from "react";
import Image from "next/image";
import { Plus, Check, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Product } from "@/types/catalog";

export interface ProductCardProps {
  product: Product;
  index: number;
  totalInCategory: number;
  isShortlisted: boolean;
  onSelect: (product: Product, event?: React.MouseEvent | HTMLElement) => void;
  onToggleShortlist: (product: Product, event?: React.MouseEvent) => void;
  displayImage: string;
}

export default function ProductCard({
  product,
  index,
  totalInCategory,
  isShortlisted,
  onSelect,
  onToggleShortlist,
  displayImage
}: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isOnlyTwo = totalInCategory === 2;
  const isFeatured = !isOnlyTwo && (product.featured === true || (index === 0 && totalInCategory > 2));

  // Grid spans: 2 items => 6 cols each; 3+ items => featured 8 cols, others 4 cols
  const spanClass = isOnlyTwo
    ? "md:col-span-6 lg:col-span-6"
    : isFeatured
    ? "md:col-span-12 lg:col-span-8"
    : "md:col-span-6 lg:col-span-4";

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      key={product._id || product.id}
      onClick={(e) => onSelect(product, e)}
      className={`specimen-tray hc-focus p-3.5 flex flex-col justify-between cursor-pointer ${spanClass}`}
      tabIndex={0}
      role="button"
      aria-label={`View specifications for ${product.name} by ${product.brandName || product.brand}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(product, e.currentTarget);
        }
      }}
    >
      <div>
        {/* Image Specimen Frame with Glow & Sweep */}
        <div className={`specimen-frame relative w-full mb-4 ${
          isFeatured ? "aspect-[21/9]" : isOnlyTwo ? "aspect-[16/10]" : "aspect-[16/11]"
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(200,169,110,.18),transparent_45%)]" />
          <Image
            src={displayImage}
            alt={product.name || "Product Specimen"}
            fill
            placeholder={product.imageLqip ? "blur" : "empty"}
            blurDataURL={product.imageLqip}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 relative z-[2] transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Live Display or Focal Badge */}
          {product.displayStatus ? (
            <span className="absolute left-4 top-4 z-[3] border border-[var(--accent)]/60 bg-[#fbf5ea]/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[var(--accent)] font-semibold">
              {product.displayStatus}
            </span>
          ) : isFeatured ? (
            <span className="absolute left-4 top-4 z-[3] border border-[var(--accent)]/60 bg-[#fbf5ea]/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[var(--accent)] font-semibold">
              Featured Specimen
            </span>
          ) : null}

          {/* Monospace Reference Code */}
          <span className="hc-mono absolute bottom-3 right-4 z-[3] text-[9px] tracking-[0.18em] text-[var(--text-secondary)]">
            {product.catalogReference || product.model || `HC-${(product.brand || 'SPEC').toUpperCase().slice(0, 3)}`}
          </span>
        </div>

        {/* Product Brand & Model Header */}
        <div className="px-1.5">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              {product.brandName || product.brand}
            </span>
            <span className="hc-mono text-[9px] text-[var(--text-secondary)]">
              {product.model || product.catalogReference || "SPEC-STD"}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="m-0 mt-1.5 text-base sm:text-[17px] font-medium leading-snug text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {(product.shortDescription || product.description) && (
            <p className="m-0 mt-2 line-clamp-2 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)] font-light">
              {product.shortDescription || product.description}
            </p>
          )}

          {/* Finishes Badges if Available */}
          {product.finishes && product.finishes.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {product.finishes.slice(0, 3).map((f: string, fi: number) => (
                <span key={fi} className="hc-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] border border-[var(--border)] px-2 py-0.5 bg-white/[0.02]">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Action Bar */}
      <div className="mt-5 pt-3 px-1.5 border-t border-[var(--border)] flex items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={isShortlisted}
          onClick={(e) => onToggleShortlist(product, e)}
          className={`shortlist-control hc-focus inline-flex min-h-[36px] items-center gap-2 border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.14em] font-medium transition-all ${
            isShortlisted 
              ? "border-[var(--accent)] bg-[#c8a96e] text-[#090909] font-bold" 
              : "border-white/[0.22] text-[var(--text-primary)] hover:border-[var(--accent)]"
          }`}
        >
          {isShortlisted ? (
            <Check className="w-3 h-3 text-[#090909] stroke-[3]" />
          ) : (
            <Plus className="w-3 h-3 text-[var(--accent)] shortlist-icon" />
          )}
          <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
        </button>

        <span className="hc-focus architecture-rule inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
          <span>Specifications</span>
          <ArrowRight className="w-3 h-3 text-[var(--accent)] transition-transform duration-180 group-hover:translate-x-1" />
        </span>
      </div>
    </motion.article>
  );
}

