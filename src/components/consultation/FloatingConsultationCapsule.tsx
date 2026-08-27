"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useConsultationStore } from "./store";
import { AnimatePresence, motion } from "motion/react";

export function FloatingConsultationCapsule() {
  const { openDrawer } = useConsultationStore();
  const [isVisible, setIsVisible] = useState(false);

  // Show after scrolling past header/hero, but hide once user reaches reference library or footer
  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      
      // Hide once the reference library / catalog section enters view
      const refSection = document.getElementById("reference-library-section") || document.getElementById("official-catalogs");
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
          className="fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <button
            onClick={() =>
              openDrawer({
                source: "collections",
                intent: "consultation",
              })
            }
            className="group relative flex items-center gap-3 bg-[#0E0C0C]/90 hover:bg-[#161414] border border-white/[0.14] hover:border-[#C8A96E]/60 text-white rounded-full px-6 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
          >
            <div className="w-2 h-2 rounded-full bg-[#C8A96E] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.16em] font-medium text-zinc-200 group-hover:text-white transition-colors">
              Need help choosing? <span className="text-[#C8A96E] font-semibold">Consult a specialist</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8A96E] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
