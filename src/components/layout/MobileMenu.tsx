"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SHOWROOM_HOURS_FALLBACK } from "@/lib/config";
import { useAudioStore } from "@/components/audio/audioStore";
import type { NavLinkItem } from "./Navbar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  navLinks: NavLinkItem[];
  isLinkActive: (link: NavLinkItem) => boolean;
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => void;
  handleLogoClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  primaryPhone?: string;
  cleanPhone?: string;
  onConsultClick: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  menuButtonRef,
  navLinks,
  isLinkActive,
  handleNavClick,
  onConsultClick,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const toggleAudio = useAudioStore((s) => s.toggle);
  const shouldReduceMotion = useReducedMotion();

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

  // Ensure "Showroom Home" is present at the top of mobile navigation
  const menuItems: NavLinkItem[] = [
    ...(!navLinks.some((l) => l.href === "/" || l.id === "home")
      ? [
          {
            id: "home",
            name: "Showroom Home",
            href: "/",
          },
        ]
      : []),
    ...navLinks,
  ];

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id="mobile-nav-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={dialogRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.15 }
              : {
                  height: {
                    type: "spring",
                    stiffness: 380,
                    damping: 38,
                    mass: 0.85,
                  },
                  opacity: {
                    duration: 0.22,
                    ease: [0.19, 1, 0.22, 1],
                  },
                }
          }
          className="lg:hidden overflow-hidden min-h-0 flex flex-col will-change-[height,opacity]"
          style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
        >
          {/* Mechanical laser divider line */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            style={{ originX: 0 }}
            className="mx-6 h-px bg-[#1a1017]/08 shrink-0"
          />

          {/* Inner minimalist container */}
          <div className="flex flex-col justify-between overflow-y-auto px-6 pt-4 pb-6 max-h-[calc(100dvh-100px)] gap-5">
            {/* Primary Editorial Navigation with Mechanical Tumbler Slide */}
            <nav className="flex flex-col" aria-label="Mobile Navigation">
              {menuItems.map((link, idx) => {
                const isActive = isLinkActive(link);
                return (
                  <div key={link.id} className="relative">
                    <motion.div
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -18 }
                      }
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, x: 0 }
                      }
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -10 }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.15 }
                          : {
                              type: "spring",
                              stiffness: 440,
                              damping: 34,
                              mass: 0.6,
                              delay: 0.05 + idx * 0.045,
                            }
                      }
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className="group flex items-center justify-between py-3.5 transition-colors select-none"
                      >
                        <div className="flex items-baseline gap-3.5 min-w-0">
                          <span className="hc-mono text-[10px] tracking-widest text-[#7a6872]/60 font-medium transition-colors group-hover:text-[#8b1a42]">
                            0{idx + 1}
                          </span>
                          <span
                            className={`font-cormorant text-2xl sm:text-3xl tracking-tight transition-all duration-200 ${
                              isActive
                                ? "text-[#8b1a42] font-medium translate-x-1"
                                : "text-[#1a1017] group-hover:text-[#8b1a42] group-hover:translate-x-1 font-normal"
                            }`}
                            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                          >
                            {link.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#8b1a42]/10 text-[#8b1a42] border border-[#8b1a42]/20 shadow-[0_1px_4px_rgba(139,26,66,0.08)]">
                              Current
                            </span>
                          ) : (
                            <ArrowUpRight className="w-4 h-4 stroke-[1.5] text-[#7a6872]/40 transition-all duration-200 group-hover:text-[#8b1a42] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:stroke-[2]" />
                          )}
                        </div>
                      </Link>
                    </motion.div>

                    {/* Precision mechanical guide divider */}
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { scaleX: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { scaleX: 0 }}
                      transition={{
                        duration: 0.38,
                        delay: 0.07 + idx * 0.045,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      style={{ originX: 0 }}
                      className="h-px bg-[#1a1017]/06 w-full"
                    />
                  </div>
                );
              })}
            </nav>

            {/* Minimalist Showroom Ambiance / Sound Control */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : {
                      type: "spring",
                      stiffness: 400,
                      damping: 34,
                      mass: 0.7,
                      delay: 0.2,
                    }
              }
              className="flex items-center justify-between py-3 px-3.5 rounded-2xl bg-white/45 border border-white/70 shadow-[0_1px_6px_rgba(26,16,23,0.02)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[#7a6872] font-semibold">
                  Showroom Ambience
                </span>
              </div>

              <button
                type="button"
                onClick={toggleAudio}
                aria-label={isPlaying ? "Mute background audio" : "Play background audio"}
                aria-pressed={isPlaying}
                className={`flex items-center gap-2 h-7 px-3 rounded-full border transition-all duration-200 active:scale-[0.94] ${
                  isPlaying
                    ? "bg-[#8b1a42]/10 border-[#8b1a42]/25 text-[#8b1a42]"
                    : "bg-white/60 border-black/5 text-[#7a6872] hover:text-[#1a1017]"
                }`}
              >
                {isPlaying ? (
                  <>
                    <span className="flex items-end gap-[2px] h-2.5 w-2.5 pb-[1px]" aria-hidden="true">
                      <span className="w-[1.5px] rounded-full bg-[#8b1a42] animate-eq-1" />
                      <span className="w-[1.5px] rounded-full bg-[#8b1a42] animate-eq-2" />
                      <span className="w-[1.5px] rounded-full bg-[#8b1a42] animate-eq-3" />
                    </span>
                    <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.14em]">
                      Sound On
                    </span>
                    <Volume2 className="w-3 h-3 text-[#8b1a42]" />
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7a6872]/40" />
                    <span className="font-manrope text-[10px] font-medium uppercase tracking-[0.14em]">
                      Sound Off
                    </span>
                    <VolumeX className="w-3 h-3 text-[#7a6872]" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Bottom Actions without Phone Number */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 14 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : {
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                      mass: 0.7,
                      delay: 0.24,
                    }
              }
              className="flex flex-col gap-2.5 pt-1"
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConsultClick();
                }}
                className="flex w-full items-center justify-center gap-2 h-11 rounded-full bg-gradient-to-b from-[#9b1f4c] via-[#8b1a42] to-[#781537] text-white font-bold text-xs uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(139,26,66,0.24)] active:scale-[0.97] transition-all"
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              <div className="flex items-center justify-between text-xs text-[#7a6872]/70 px-1 pt-1 select-none">
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium hc-mono">
                  Sakchi, Jamshedpur
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] hc-mono">
                  {SHOWROOM_HOURS_FALLBACK}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
