"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Phone, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { NavLinkItem } from "./Navbar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  navLinks: NavLinkItem[];
  isLinkActive: (link: NavLinkItem) => boolean;
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => void;
  handleLogoClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  primaryPhone: string;
  cleanPhone: string;
  onConsultClick: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  menuButtonRef,
  navLinks,
  isLinkActive,
  handleNavClick,
  handleLogoClick,
  primaryPhone,
  cleanPhone,
  onConsultClick,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => {
        dialogRef.current
          ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
          ?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuButtonRef.current?.focus();
    }
  }, [isOpen, menuButtonRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="mobile-nav-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 lg:hidden flex flex-col justify-start px-4 pt-20 pb-8 pointer-events-auto"
          style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
        >
          {/* Dark glass backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[var(--surface)]/80 backdrop-blur-xl -z-10"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            ref={dialogRef}
            className="relative w-full max-w-sm mx-auto rounded-3xl p-6 bg-[#fbf5ea]/95 backdrop-blur-xl border border-[#1a1017]/[0.08] shadow-[0_16px_48px_rgba(26,16,23,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] overflow-hidden"
          >
            {/* Modal Top Header (Redirects to Home) */}
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
              <div className="min-w-0 flex-1" style={{ containerType: "inline-size" }}>
                <Link
                  href="/"
                  onClick={(e) => {
                    onClose();
                    handleLogoClick(e);
                  }}
                  className="group inline-block max-w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1a42] rounded p-1"
                  aria-label="Hardware Collection, home"
                >
                  <BrandLockup
                    layout="inline"
                    fontSize="clamp(14.5px, 6cqw, 22px)"
                    emblemSizes="112px"
                    animateEntrance
                  />
                </Link>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded bg-[#f7f0e2] border border-[#1a1017]/[0.08] flex items-center justify-center text-[#7a6872] hover:text-[#1a1017] transition-colors"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col py-4 space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`flex items-center justify-between py-3 px-3.5 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-[#f0dade] text-[#8b1a42] font-semibold"
                        : "text-[#7a6872] hover:text-[#1a1017] hover:bg-[#f7f0e2]"
                    }`}
                    style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                  >
                    <span className="text-[13px] uppercase tracking-[0.18em]">
                      {link.name}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b1a42] shadow-[0_0_6px_rgba(139,26,66,0.55)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="h-[1px] bg-white/[0.08] my-1" />

            {/* Showroom Direct Actions */}
            <div className="pt-3 space-y-2.5">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2.5 py-3 rounded bg-[#f7f0e2] hover:bg-[#ece4d6] border border-[#1a1017]/[0.08] text-[#3d2e38] font-medium text-xs tracking-wider transition-premium btn-tactile"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
              >
                <Phone className="w-3.5 h-3.5 text-[#8b1a42]" />
                <span>Call Showroom ({primaryPhone})</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onConsultClick();
                }}
                className="flex w-full items-center justify-center gap-2 py-3 rounded bg-[#8b1a42] hover:bg-[#6b1432] text-white font-bold text-xs uppercase tracking-[0.14em] shadow-[0_4px_16px_rgba(139,26,66,0.22)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.35)] btn-tactile transition-premium"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
              >
                <span>Consult Specialist</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
