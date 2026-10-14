"use client";

import React, { useEffect, useRef } from "react";
import { useConsultationStore } from "./store";
import { ConsultationForm } from "./ConsultationForm";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
// We use motion/react assuming framer-motion v12/13 style. The package.json has "motion": "^13.1.0"

export function ConsultationDrawer() {
  const { isOpen, closeDrawer } = useConsultationStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  // BUG-05 fix: centralized scroll-lock (reference-counted — safe with concurrent drawers)
  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Centered Popup Box */}
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative w-full max-w-xl max-h-[90vh] bg-[#fbf5ea] rounded-2xl md:rounded-3xl border border-[#1a1017]/[0.10] shadow-[0_25px_70px_rgba(26,16,23,0.25),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Book a Showroom Consultation"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#fbf5ea]/95 backdrop-blur-xl border-b border-[var(--border)] flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b1a42]" />
                <span className="text-[11px] text-[var(--accent)] tracking-[0.2em] uppercase font-semibold font-dmsans">
                  HARDWARE COLLECTION · SAKCHI
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-[#1a1017]/[0.05] border border-[#1a1017]/[0.08] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[#8b1a42] transition-all focus:outline-none cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <ConsultationForm onSuccess={closeDrawer} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

