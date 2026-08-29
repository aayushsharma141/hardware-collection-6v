"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useConsultationStore } from "./consultation/store";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

interface NavbarProps {
  primaryPhone?: string;
  whatsappNumber?: string;
  defaultWhatsappMessage?: string;
}

interface NavLinkItem {
  name: string;
  href: string;
  id: "collections" | "brands" | "catalog";
}

const NAV_LINKS: NavLinkItem[] = [
  { name: "Collections", href: "/collections", id: "collections" },
  { name: "Brands", href: "/#brands", id: "brands" },
  { name: "Catalog", href: "/catalogs", id: "catalog" },
];

export default function Navbar({
  primaryPhone = "+91 98351 90738",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  const { openDrawer } = useConsultationStore();

  // Suppress rendering inside Sanity Studio CMS
  const isStudio = pathname?.startsWith("/studio");

  // Track active URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Scroll listener for density transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  /**
   * The drawer is a modal: it covers the page, traps the pointer behind a
   * backdrop and locks body scroll. It previously did none of the keyboard
   * half of that — Tab walked straight out of the open drawer and into the
   * page behind it, and closing left focus wherever it had wandered.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === "Escape") {
        setMobileMenuOpen(false);
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
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Move focus into the drawer on open, and hand it back to the trigger on
  // close. `wasOpenRef` keeps the close branch from firing on first paint,
  // where it would pull focus to the menu button on every page load.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (mobileMenuOpen) {
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
  }, [mobileMenuOpen]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      lockScroll();
      document.documentElement.setAttribute("data-drawer-open", "true");
    } else {
      unlockScroll();
      document.documentElement.removeAttribute("data-drawer-open");
    }
    return () => {
      unlockScroll();
      document.documentElement.removeAttribute("data-drawer-open");
    };
  }, [mobileMenuOpen]);

  if (isStudio) {
    return null;
  }

  const cleanPhone = primaryPhone.replace(/\s+/g, "");

  const isLinkActive = (link: NavLinkItem) => {
    if (link.id === "collections") {
      return (
        pathname === "/collections" &&
        !currentHash.includes("reference-library") &&
        !currentHash.includes("official-catalogs")
      );
    }
    if (link.id === "catalog") {
      return (
        pathname === "/collections" &&
        (currentHash.includes("reference-library") || currentHash.includes("official-catalogs"))
      );
    }
    if (link.id === "brands") {
      return pathname === "/" && currentHash.includes("brands");
    }
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    setMobileMenuOpen(false);
    if (link.id === "brands" && pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("brands");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#brands");
        setCurrentHash("#brands");
      }
    } else if (link.id === "catalog" && pathname === "/catalogs") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/catalogs");
      setCurrentHash("");
    } else if (link.id === "collections" && pathname === "/collections") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/collections");
      setCurrentHash("");
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setCurrentHash("");
    }
  };

  return (
    <>
      {/* ── Floating Liquid Glass Header ───────────────────────── */}
      <header
        role="banner"
        className={`navbar-island fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-400 ease-out ${
          isScrolled ? "top-2 md:top-3 px-3 md:px-8" : "top-3 md:top-5 px-3 md:px-8"
        }`}
        style={{
          fontFamily: "var(--font-dmsans), 'DM Sans', -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          className={`pointer-events-auto relative w-full max-w-[1920px] 2xl:max-w-[2200px] rounded-full transition-all duration-400 ${
            isScrolled
              ? "h-[56px] md:h-[60px] bg-[#0E0C0C]/95 border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
              : "h-[58px] md:h-[66px] bg-[#0E0C0C]/75 border-white/[0.10] shadow-[0_16px_45px_rgba(0,0,0,0.40)]"
          } backdrop-blur-2xl [-webkit-backdrop-filter:blur(24px)_saturate(140%)] border [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)]`}
        >
          {/* Subtle ambient specular shimmer */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10"
            aria-hidden="true"
          >
            <div className="liquid-glass-reflection absolute -inset-full opacity-50" />
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Strict Balanced 3-Zone Desktop Grid & 2-Zone Mobile Layout.
              The switch happens at lg, not md: between 768px and 1023px the
              three centred links needed ~308px inside a 231px column, so the
              brand lockup overlapped "Collections" and "Catalog" ran under the
              phone pill. lg is also where the page itself swaps its mobile and
              desktop trees, so the header and the content now agree on where
              desktop begins. The centre column is sized to its content rather
              than to an equal third: at 1024px exactly, a third was still a few
              px short of the links and put "Catalog" under the phone pill. */}
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center h-full px-4 sm:px-6 md:px-8">
            
            {/* ── Column 1: Brand Lockup (Left-Aligned) ────────── */}
            <div
              className="flex items-center justify-start min-w-0"
              style={{ containerType: "inline-size" }}
            >
              <Link
                href="/"
                onClick={handleLogoClick}
                className="group inline-block max-w-full py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-md transition-opacity duration-300 select-none"
                aria-label="Hardware Collection — The Jewelry of Fittings, home"
              >
                <BrandLockup
                  layout="inline"
                  fontSize="clamp(11px, 5.4cqw, 22px)"
                  emblemSizes="96px"
                  priority
                />
              </Link>
            </div>

            {/* ── Column 2: Exact Center Nav Links ──────────────── */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center justify-center gap-6 xl:gap-11"
            >
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`relative py-2 text-[12.5px] lg:text-[13px] uppercase tracking-[0.18em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm select-none ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-[#aaa49a] font-medium hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-glow"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C8A96E] rounded-full shadow-[0_0_8px_rgba(200,169,110,0.85)]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Column 3: Contact & CTAs (Right-Aligned) ───────── */}
            <div className="flex items-center justify-end gap-3 sm:gap-3.5 md:gap-4">
              {/* Desktop Phone Contact Pill */}
              <a
                href={`tel:${cleanPhone}`}
                className="hidden lg:inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-white/[0.04] border border-white/[0.10] hover:border-white/20 hover:bg-white/[0.08] text-[12px] font-medium uppercase tracking-[0.12em] text-[#d4cec5] hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                aria-label={`Call Hardware Collection at ${primaryPhone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#C8A96E] shrink-0" />
                <span className="leading-none">{primaryPhone}</span>
              </a>

              {/* Desktop Inquire CTA Button */}
              <button
                onClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
                className="hidden lg:inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] text-[12px] font-bold uppercase tracking-[0.14em] leading-none shadow-[0_4px_16px_rgba(200,169,110,0.25)] hover:shadow-[0_6px_22px_rgba(200,169,110,0.4)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0E0C0C]" />
              </button>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.12] text-white/90 hover:text-white hover:bg-white/[0.12] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-modal"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Dedicated Mobile Liquid Glass Modal ────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
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
              className="fixed inset-0 bg-black/75 backdrop-blur-xl -z-10"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Floating Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              ref={dialogRef}
              className="relative w-full max-w-sm mx-auto bg-[#0E0C0C]/95 border border-white/[0.14] rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden"
            >
              {/* Ambient reflection */}
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-10"
                aria-hidden="true"
              >
                <div className="liquid-glass-reflection absolute -inset-full opacity-40" />
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/40 to-transparent" />
              </div>

              {/* Modal Top Header (Redirects to Home) */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="min-w-0 flex-1" style={{ containerType: "inline-size" }}>
                  <Link
                    href="/"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleLogoClick(e);
                    }}
                    className="group inline-block max-w-full select-none"
                    aria-label="Hardware Collection — The Jewelry of Fittings, home"
                  >
                    <BrandLockup
                      layout="inline"
                      fontSize="clamp(11px, 5.4cqw, 19px)"
                      emblemSizes="80px"
                    />
                  </Link>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Close Navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links (Collections, Brands, Catalog) */}
              <nav className="flex flex-col py-4 space-y-1" aria-label="Mobile Navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link);
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`flex items-center justify-between py-3 px-3.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-[#aaa49a] hover:text-white hover:bg-white/[0.04]"
                      }`}
                      style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                    >
                      <span className="text-[13px] uppercase tracking-[0.18em]">
                        {link.name}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] shadow-[0_0_6px_rgba(200,169,110,0.8)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="h-[1px] bg-white/[0.08] my-1" />

              {/* Showroom Direct Actions: Call Showroom & WhatsApp Inquire */}
              <div className="pt-3 space-y-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-white/90 font-medium text-xs tracking-wider transition-colors"
                  style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8A96E]" />
                  <span>Call Showroom ({primaryPhone})</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDrawer({ source: "navbar", intent: "consultation" });
                  }}
                  className="flex w-full items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.14em] shadow-[0_4px_16px_rgba(200,169,110,0.25)] hover:shadow-[0_6px_22px_rgba(200,169,110,0.4)] active:scale-[0.99] transition-all"
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
    </>
  );
}
