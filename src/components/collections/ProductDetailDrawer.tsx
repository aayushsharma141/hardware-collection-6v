"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, ProductSpecification, getSlugString } from "@/types/catalog";
import { useConsultationStore } from "@/components/consultation/store";

export interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
  shortlist: Product[];
  onToggleShortlist: (product: Product) => void;
  displayImage: string;
}

export default function ProductDetailDrawer({
  product,
  onClose,
  shortlist,
  onToggleShortlist,
  displayImage,
}: ProductDetailDrawerProps) {
  const { openDrawer } = useConsultationStore();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Keyboard navigation & Focus Trap inside lookbook drawer
  useEffect(() => {
    if (!product) return;

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  const isShortlisted = product
    ? shortlist.some((p) => (p._id || p.id) === (product._id || product.id))
    : false;

  return (
    <AnimatePresence>
      {product && (
        <div 
          className="fixed inset-0 z-50 flex justify-end" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="drawer-title"
        >
          {/* Dark glass backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--surface)]/75 backdrop-blur-md" 
            onClick={onClose}
            aria-hidden="true"
          />
        
          {/* Lookbook Drawer Panel */}
          <motion.div 
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#fdf8f0] h-full overflow-y-auto border-l border-[#1a1017]/[0.10] flex flex-col shadow-2xl z-10 focus:outline-none"
            tabIndex={-1}
          >
            {/* Sticky Architectural Drawer Header */}
            <div className="sticky top-0 flex items-center justify-between p-5 sm:p-6 bg-[#fdf8f0]/95 backdrop-blur-xl border-b border-[var(--border)] z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b1a42]" />
                <span className="font-dmsans text-[10.5px] uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
                  Hardware Collection • Sakchi • Authorized Dealer
                </span>
              </div>
              <button 
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close product specifications"
                className="w-8 h-8 rounded-full bg-[#1a1017]/[0.05] border border-[var(--border)] flex items-center justify-center text-[#7a6872] hover:text-[#8b1a42] hover:bg-[#1a1017]/[0.10] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Lookbook Content */}
            <div className="flex-1 p-6 sm:p-8 space-y-8">
            
              {/* Large Specimen Display Image */}
              <div className="relative w-full aspect-[16/11] bg-[var(--surface-raised)] border border-white/[0.12] rounded-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(200,169,110,.25),transparent_50%)]" />
                <Image
                  src={displayImage}
                  alt={product.name || "Product Image"}
                  fill
                  placeholder={product.imageLqip ? "blur" : "empty"}
                  blurDataURL={product.imageLqip}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6 relative z-[2] opacity-90"
                />
              </div>

              {/* Product Metadata & Title */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-dmsans text-xs font-bold text-[var(--accent)] uppercase tracking-[0.16em]">
                    {product.brandName || product.brand}
                  </span>
                  {(product.catalogReference || product.model) && (
                    <span className="font-mono text-[11px] text-[#6E6A62] bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.06]">
                      Ref: {product.catalogReference || product.model}
                    </span>
                  )}
                </div>

                <h2 
                  id="drawer-title" 
                  className="font-cormorant text-3xl sm:text-4xl text-[var(--text-primary)] font-normal mb-4 leading-tight uppercase"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {product.name}
                </h2>
              
                {(product.shortDescription || product.description) && (
                  <p className="font-dmsans text-sm text-[#A39E93] leading-relaxed mb-6 font-light">
                    {product.shortDescription || product.description}
                  </p>
                )}
              </div>

              {/* Technical Specifications Table */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="font-dmsans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                    Verified Technical Specifications
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specifications.map((spec: ProductSpecification, idx: number) => (
                      <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                        <dt className="text-[10px] uppercase font-dmsans tracking-wider text-[#6E6A62] mb-1">{spec.key}</dt>
                        <dd className="font-dmsans text-xs font-medium text-[var(--text-primary)]">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Showroom Physical Display Callout & Direct Actions */}
              <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
                  <div>
                    <h4 className="font-dmsans text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                      Available for Physical Inspection
                    </h4>
                    <p className="font-dmsans text-xs text-[#A39E93] font-light">
                      Experience the live tactile finish and mechanics at our Sakchi, Jamshedpur showroom.
                    </p>
                  </div>
                </div>
              
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => openDrawer({
                      source: "product_drawer",
                      intent: "enquiry",
                      product: {
                        slug: getSlugString(product.slug) || product.id || product._id || "",
                        name: product.name,
                      },
                      category: product.category ? {
                        slug: product.category,
                        name: product.category,
                      } : undefined,
                      brand: (product.brandName || product.brand) ? {
                        slug: product.brandName || product.brand || "",
                        name: product.brandName || product.brand || "",
                      } : undefined
                    })}
                    className="flex-1 text-center py-3.5 px-5 bg-[#8b1a42] hover:bg-[#6b1432] text-white font-dmsans font-bold uppercase tracking-widest text-xs rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Consult an Expert</span>
                  </button>
                
                  <button
                    onClick={() => onToggleShortlist(product)}
                    className={`px-5 py-3.5 rounded-full font-dmsans text-xs font-semibold uppercase tracking-wider transition-all border ${
                      isShortlisted
                        ? 'bg-white/[0.1] border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-white/[0.04] border-white/[0.1] text-[var(--text-primary)] hover:bg-white/[0.08]'
                    }`}
                  >
                    {isShortlisted
                      ? "In Shortlist ✓"
                      : "Add to Shortlist"}
                  </button>
                </div>
              </div>

              {/* Official Files / Downloads */}
              {product.officialFiles && product.officialFiles.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                  <h3 className="font-dmsans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Official Documents
                  </h3>
                  <div className="flex flex-col gap-2">
                    {product.officialFiles.map((fileUrl, idx) => (
                      <a
                        key={idx}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-fit"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#1a1017]/[0.05] border border-white/[0.1] flex items-center justify-center">
                          <span className="text-[8px]">&darr;</span>
                        </span>
                        Download Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


