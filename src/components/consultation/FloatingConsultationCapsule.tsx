"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useConsultationStore } from "./store";
import { AnimatePresence, motion } from "motion/react";

export function FloatingConsultationCapsule({ hasShortlist = false }: { hasShortlist?: boolean }) {
  const { openDrawer } = useConsultationStore();
  const [isVisible, setIsVisible] = useState(false);

  // Show after scrolling past header/hero, but hide once user reaches reference library or footer
  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      
      // Hide once the reference library, catalogue section, or bottom consultation section enters view
      const refSection =
        document.getElementById("collections-bottom-cta") ||
        document.getElementById("reference-library-section") ||
        document.getElementById("official-catalogues");
      let isPastReferenceSection = false;
      
      if (refSection) {
        const rect = refSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 60) {
          isPastReferenceSection = true;
        }
      }
      
      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
          isPastReferenceSection = true;
        }
      }

      setIsVisible(scrollY > 300 && !isPastReferenceSection);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateVisibility();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className={`fixed left-1/2 -translate-x-1/2 z-40 pointer-events-auto hidden sm:block ${hasShortlist ? "bottom-20 lg:bottom-10" : "bottom-6 lg:bottom-10"}`}
        >
          <button
            onClick={() =>
              openDrawer({
                source: "collections",
                intent: "consultation",
              })
            }
            className="group relative flex items-center gap-3 bg-[var(--color-pearl)]/95 hover:bg-[var(--color-pearl)] border border-[var(--color-ink)]/[0.12] hover:border-[var(--color-wine)]/60 rounded px-6 py-3.5 shadow-[0_18px_40px_rgba(26,16,23,0.14)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-wine)]"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-wine)] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.16em] font-medium text-[var(--color-charcoal)] group-hover:text-[var(--color-ink)] transition-colors">
              Need help choosing? <span className="text-[var(--color-wine)] font-semibold">Consult a specialist</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-wine)] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

