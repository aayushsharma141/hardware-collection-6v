"use client";

import React, { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, Maximize, ShieldAlert, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { buildWhatsAppUrl } from "@/lib/config";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

interface CatalogViewerModalProps {
  brand: any;
  onClose: () => void;
}

export default function CatalogViewerModal({ brand, onClose }: CatalogViewerModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Security layer: disable right-click, keyboard shortcuts, text selection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      
      // Prevent Print (Ctrl+P, Cmd+P), Save (Ctrl+S, Cmd+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        console.warn("Catalog DRM: print/save shortcut intercepted.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    lockScroll(); // BUG-05 fix: centralized scroll lock
    
    // Simulate loading the pre-rendered images
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] bg-[#0e0e0f] text-[#e5e2e3] flex flex-col select-none"
    >
      
      {/* Viewer Header */}
      <header className="h-16 bg-[#131314] border-b border-[#262626] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} aria-label="Close Official Catalog" className="text-[#998f81] hover:text-[#e5e2e3] transition-colors p-2 -ml-2">
            <X className="w-6 h-6" />
          </button>
          <div className="w-px h-6 bg-[#262626]"></div>
          <span id="modal-title" className="font-display tracking-widest uppercase text-sm text-[#e5e2e3]">
            {brand.name} Official Catalog
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[#998f81]">
            <button aria-label="Zoom out" className="hover:text-[#e5e2e3] transition-colors"><ZoomOut className="w-4 h-4" /></button>
            <span className="font-body text-xs" aria-label="Current Zoom Level">100%</span>
            <button aria-label="Zoom in" className="hover:text-[#e5e2e3] transition-colors"><ZoomIn className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-[#262626]"></div>
            <button aria-label="Maximize viewer" className="hover:text-[#e5e2e3] transition-colors"><Maximize className="w-4 h-4" /></button>
          </div>
          
          <a
            href={buildWhatsAppUrl(`Hi Hardware Collection, I am viewing the ${brand.name} catalog and need a specific product.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e5c487] text-[#131314] px-4 py-2 font-body font-bold text-[10px] uppercase tracking-wider hover:bg-white transition-colors"
          >
            WhatsApp Specialist
          </a>
        </div>
      </header>

      {/* Viewer Body (Friction Layer) */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Anti-screenshot Watermark overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap items-center justify-center opacity-5 gap-20 p-10 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="font-display text-4xl -rotate-45 text-white">HARDWARE COLLECTION</span>
          ))}
        </div>

        {/* Protection Warning */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1c1b1c] border border-[#262626] px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
          <ShieldAlert className="w-4 h-4 text-[#e5c487]" />
          <span className="font-body text-[10px] text-[#998f81] uppercase tracking-wider">
            View-Only Mode • Casual-Copy Friction Layer Active
          </span>
        </div>

        {/* Viewer Area (Option B: Pre-rendered pages state) */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-[#0e0e0f]">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center h-full text-[#998f81]">
              <div className="w-8 h-8 border-2 border-[#262626] border-t-[#e5c487] rounded-full animate-spin mb-4"></div>
              <span className="font-body text-xs uppercase tracking-widest">Loading Secure Viewer...</span>
            </div>
          ) : (
            <div className="w-full max-w-4xl min-h-[800px] relative flex flex-col items-center justify-center">
              <div className="bg-[#1c1b1c] border border-[#262626] p-16 text-center max-w-2xl w-full">
                <FileText className="w-16 h-16 text-[#444] mx-auto mb-8" />
                <h2 className="font-display text-3xl text-[#e5e2e3] mb-4 uppercase tracking-widest">
                  Assets Pending
                </h2>
                <p className="font-body text-sm text-[#d0c5b5] leading-relaxed mb-8">
                  The official pre-rendered catalog pages for <strong>{brand.name}</strong> have not been uploaded yet. This viewer is structurally complete and will serve the Option B image-based architecture once assets are provided.
                </p>
                <div className="inline-block bg-[#131314] px-6 py-3 font-body text-xs text-[#998f81] uppercase tracking-wider border border-[#262626]">
                  Awaiting Input: Brand Distributor PDFs
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Viewer Footer (Pagination) */}
        <footer className="h-16 bg-[#131314] border-t border-[#262626] flex items-center justify-center shrink-0 z-30 relative">
          <div className="flex items-center gap-6">
            <button aria-label="Previous page" disabled className="w-8 h-8 rounded-full border border-[#262626] flex items-center justify-center text-[#998f81] opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-body text-xs text-[#d0c5b5]">
              Page <span className="text-[#e5e2e3]">-</span> of -
            </span>
            <button aria-label="Next page" disabled className="w-8 h-8 rounded-full border border-[#262626] flex items-center justify-center text-[#998f81] opacity-50 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </main>
    </motion.div>
  );
}
