"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Phone, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SHOWROOM_HOURS_FALLBACK } from "@/lib/config";
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
        <motion.div
          id="mobile-nav-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={dialogRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-between bg-[var(--surface)] text-[var(--text-primary)] px-6 pt-5 pb-8 overflow-y-auto"
          style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-[var(--border)]">
            <div className="min-w-0 flex-1">
              <Link
                href="/"
                onClick={(e) => {
                  onClose();
                  handleLogoClick(e);
                }}
                className="group inline-block max-w-full select-none focus-visible:outline-none"
                aria-label="Hardware Collection, home"
              >
                <BrandLockup
                  layout="inline"
                  fontSize="clamp(16px, 5vw, 22px)"
                  emblemSizes="112px"
                  animateEntrance
                />
              </Link>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--color-wine)] transition-colors focus-visible:outline-none"
              aria-label="Close Navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Large Architectural Navigation Links */}
          <nav className="flex flex-col py-8 space-y-2" aria-label="Mobile Navigation">
            {navLinks.map((link, idx) => {
              const isActive = isLinkActive(link);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-baseline justify-between py-2 transition-colors duration-200 group ${
                    isActive
                      ? "text-[var(--color-wine)] font-normal"
                      : "text-[var(--text-primary)] hover:text-[var(--color-wine)]"
                  }`}
                >
                  <span
                    className="font-cormorant text-4xl sm:text-5xl font-light tracking-tight"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {link.name}
                  </span>
                  <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    0{idx + 1}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Direct Showroom Actions */}
          <div className="space-y-4 pt-6 border-t border-[var(--border)]">
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2.5 h-12 rounded-none bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs uppercase tracking-[0.16em] active:scale-[0.98] transition-all"
              >
                <Phone className="w-4 h-4 text-[var(--color-wine)]" />
                <span>Call Showroom ({primaryPhone})</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onConsultClick();
                }}
                className="flex w-full items-center justify-center gap-2 h-12 rounded-none bg-[var(--color-wine)] hover:brightness-110 text-white font-bold text-xs uppercase tracking-[0.16em] active:scale-[0.98] transition-all"
              >
                <span>Consult Specialist</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <p className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] text-center pt-2">
              Sakchi, Jamshedpur · {SHOWROOM_HOURS_FALLBACK}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
