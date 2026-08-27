"use client";

import React from "react";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/types/catalog";

export interface ShortlistPillProps {
  shortlist: Product[];
  shortlistToast: string | null;
  whatsappLink: string;
  onClear: () => void;
}

export default function ShortlistPill({
  shortlist,
  shortlistToast,
  whatsappLink,
  onClear,
}: ShortlistPillProps) {
  return (
    <>
      {/* ── Shortlist Full Toast (replaces blocking alert) ── */}
      <AnimatePresence>
        {shortlistToast && (
          <motion.div
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#1c1b1c] border border-[#3a3026] text-[#c8a96e] font-body text-xs uppercase tracking-wider px-5 py-3 shadow-2xl pointer-events-none"
          >
            {shortlistToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Consultation Shortlist Pill ── */}
      {shortlist.length > 0 && (
        <aside aria-label="Consultation Shortlist">
          <motion.div
            layout
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-4 sm:right-8 z-40 max-w-sm sm:max-w-md w-auto"
          >
            <div className="bg-[#141212]/95 border border-[#C8A96E]/40 rounded-full p-2 pl-4 pr-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8A96E] animate-pulse" />
                <span className="font-dmsans text-xs text-white font-medium whitespace-nowrap">
                  <span className="text-[#C8A96E] font-bold">{shortlist.length}</span> {shortlist.length === 1 ? 'Item' : 'Items'} for Consultation
                </span>
              </div>

              {/* Action: WhatsApp Pre-filled Specialist */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C8A96E] hover:bg-white text-[#0E0C0C] font-dmsans text-[11px] font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                <span>WhatsApp Expert</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>

              {/* Clear shortlist button */}
              <button
                onClick={onClear}
                className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#A39E93] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Clear shortlist"
                title="Clear shortlist"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </aside>
      )}
    </>
  );
}
