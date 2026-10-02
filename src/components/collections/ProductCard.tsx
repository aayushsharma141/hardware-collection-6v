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
  const isFeatured = index === 0;

  // Grid spans for a 4-column grid
  const spanClass = isFeatured
    ? "md:col-span-2 lg:col-span-2"
    : "md:col-span-1 lg:col-span-1";

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
          isFeatured ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]"
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

        </div>
      </div>

      {/* Interactive Action Bar */}
      <div className="mt-5 pt-3 px-1.5 border-t border-[var(--border)] flex items-center justify-between gap-3">
        <span className="hc-focus architecture-rule inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
          <span>VIEW</span>
          <ArrowRight className="w-3 h-3 text-[var(--text-secondary)] transition-transform duration-180 group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
        </span>

        {isShortlisted && (
          <span className="hc-mono text-[9px] uppercase tracking-[0.15em] text-[var(--accent)] flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            In Selection
          </span>
        )}
      </div>
    </motion.article>
  );
}

