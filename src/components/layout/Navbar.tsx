"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useConsultationStore } from "@/components/consultation/store";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";

interface NavbarProps {
  primaryPhone?: string;
  whatsappNumber?: string;
  defaultWhatsappMessage?: string;
}

interface NavLinkItem {
  name: string;
  href: string;
  id: "collections" | "catalog";
}

/**
 * Distance from the top of the viewport to the resting bar's bottom edge
 * (top-5 + h-76px at the widest breakpoint). Everything above this line is
 * covered by the bar, so it is the depth at which a hero stops being "behind"
 * it and the glass has to come back.
 */
const NAV_BAND_PX = 96;

/**
 * The hero measurement has to land before the browser paints the hydrated
 * tree, or the bar shows its glass for a frame and then dissolves. `useEffect`
 * is the server-safe half of the pair; only the client ever runs the layout
 * one, which is where the measurement happens.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV_LINKS: NavLinkItem[] = [
  { name: "Collections", href: "/collections", id: "collections" },
  { name: "Brands & Catalogs", href: "/catalogs", id: "catalog" },
];

export default function Navbar({
  primaryPhone = "+91 98351 90738",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [currentHash, setCurrentHash] = useState("");
  const pathname = usePathname();
  const { openDrawer } = useConsultationStore();
  const shouldReduceMotion = useReducedMotion();

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

  /**
   * One scroll listener drives both bar states.
   *
   * `isScrolled` is density &mdash; the bar shrinks once the page has moved.
   * `isOverHero` is material: while the bar sits on top of a page's hero it
   * drops its fill, border, blur and shadow entirely, because a cream capsule
   * over a cream cinematic composition reads as a chip pasted across the
   * frame rather than as chrome. Past the hero the glass island returns.
   *
   * A hero opts in with `data-nav-hero`; a page without one keeps the solid
   * bar, which is also the server-rendered default so the first paint is
   * always legible. The hero's bottom edge is measured once in document
   * space, so the scroll handler stays pure arithmetic with no layout reads.
   */
  useIsomorphicLayoutEffect(() => {
    let heroBottom = 0;

    const measureHero = () => {
      heroBottom = 0;
      document.querySelectorAll("[data-nav-hero]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        // The desktop and mobile heroes are both mounted with one of them
        // display:none. The hidden one measures zero and drops out here.
        if (rect.height === 0) return;
        heroBottom = Math.max(heroBottom, rect.bottom + window.scrollY);
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsOverHero(window.scrollY + NAV_BAND_PX < heroBottom);
    };

    const handleResize = () => {
      measureHero();
      handleScroll();
    };

    measureHero();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  /**
   * The drawer is a modal: it covers the page, traps the pointer behind a
   * backdrop and locks body scroll. It previously did none of the keyboard
   * half of that &mdash; Tab walked straight out of the open drawer and into the
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

  // Height tracks density; fill, border, blur and shadow track the hero. The
  // two shadows are one declaration because Tailwind resolves a second
  // `shadow-*` class by replacing the first, which had been quietly dropping
  // the inset highlight.
  const barMaterial = isOverHero
    ? "border-transparent bg-transparent shadow-none"
    : isScrolled
      ? "border-[#1a1017]/[0.08] bg-[#fbf5ea]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(26,16,23,0.09),inset_0_1px_0_rgba(255,255,255,0.65)]"
      : "border-[#1a1017]/[0.08] bg-[#fbf5ea]/85 backdrop-blur-md shadow-[0_4px_20px_rgba(26,16,23,0.04),inset_0_1px_0_rgba(255,255,255,0.65)]";

  const isLinkActive = (link: NavLinkItem) => {
    if (link.id === "collections") {
      // Category detail pages (/collections/kitchen) belong to Collections too.
      return pathname === "/collections" || Boolean(pathname?.startsWith("/collections/"));
    }
    if (link.id === "catalog") {
      return pathname === "/catalogs";
    }
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    setMobileMenuOpen(false);
    if (link.id === "catalog" && pathname === "/catalogs") {
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
      {/* ── Floating Tactile Glass Header ─────────────────────── */}
      <header
        role="banner"
        className={`navbar-island fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-[top,padding] duration-300 ease-out ${
          isScrolled ? "top-2 md:top-3 px-3 md:px-8" : "top-3 md:top-5 px-3 md:px-8"
        }`}
        style={{
          fontFamily: "var(--font-dmsans), 'DM Sans', -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Dropping the capsule also drops what guaranteed the mark's contrast.
            The desktop hero is a photograph at 20% over cream so it stays
            light, but the mobile one runs its image nearly un-scrimmed at the
            top &mdash; exactly where the bar sits. This full-bleed wash rides
            under the bar in the transparent state instead: legibility without
            an edge for the eye to read as chrome. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 -top-3 md:-top-5 h-[130px] md:h-[150px] bg-gradient-to-b from-[var(--surface)]/85 via-[var(--surface)]/45 to-transparent transition-opacity duration-300 ease-out ${
            isOverHero ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`pointer-events-auto relative w-full max-w-[1920px] 2xl:max-w-[2200px] rounded-full border transition-[height,background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out ${
            isScrolled ? "h-[58px] md:h-[64px]" : "h-[64px] md:h-[76px]"
          } ${barMaterial}`}
        >
          {/* Strict Balanced 3-Zone Desktop Grid & 2-Zone Mobile Layout */}
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[auto_1fr_auto] items-center h-full px-4 sm:px-6 md:px-8">
            
            {/* ── Column 1: Brand Lockup (Left-Aligned) ─────────── */}
            <div className="flex items-center justify-start shrink-0">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="navbar-brand group inline-block max-w-full py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] rounded-md transition-opacity duration-300 select-none"
                aria-label="Hardware Collection, home"
              >
                <BrandLockup
                  layout="inline"
                  /* --nav-brand-size (globals.css) is ~1.4x the previous mark
                     at full desktop width. It steps down with the bar on
                     scroll but stays above the old resting size, so the logo
                     remains the strongest anchor in the compact state. */
                  fontSize={`calc(var(--nav-brand-size) * ${isScrolled ? "0.88" : "1"})`}
                  emblemSizes="(max-width: 768px) 64px, 128px"
                  animateEntrance
                  priority
                />
              </Link>
            </div>

            {/* ── Column 2: Exact Center Nav Links ────────────────── */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center justify-center gap-1 xl:gap-3 px-1 xl:px-4"
            >
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`relative px-2.5 xl:px-4 py-1.5 text-[11.5px] xl:text-[12.5px] uppercase tracking-[0.14em] xl:tracking-[0.18em] rounded-full select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] whitespace-nowrap shrink-0 ${
                      isActive
                        ? "text-[#8b1a42] font-bold"
                        : "text-[#8b1a42] font-semibold hover:text-[#6b1432] hover:bg-[#8b1a42]/[0.06]"
                    }`}
                    style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={shouldReduceMotion ? undefined : "active-nav-capsule"}
                        className="absolute inset-0 rounded-full bg-[#8b1a42]/[0.06] border border-[#8b1a42]/[0.10] -z-10"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 420,
                                damping: 32,
                              }
                        }
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Column 3: Contact & CTAs (Right-Aligned) ───────── */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 md:gap-4 shrink-0">
              {/* Desktop Phone Contact Pill */}
              <a
                href={`tel:${cleanPhone}`}
                className="hidden lg:inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-3.5 xl:px-4 rounded-full bg-[#f7f0e2]/80 border border-[#1a1017]/[0.08] hover:border-[#8b1a42]/25 hover:bg-[#f7f0e2]/80 text-[11px] xl:text-[12px] font-medium uppercase tracking-[0.12em] text-[#3d2e38] hover:text-[#1a1017] whitespace-nowrap shrink-0 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                aria-label={`Call Hardware Collection at ${primaryPhone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#8b1a42] shrink-0" />
                <span className="hidden 2xl:inline leading-none whitespace-nowrap">{primaryPhone}</span>
              </a>

              {/* Desktop Inquire CTA Button */}
              <button
                onClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
                className="hidden lg:inline-flex items-center justify-center gap-1.5 h-11 min-h-[44px] px-4 xl:px-5 rounded-full bg-[#8b1a42] hover:bg-[#6b1432] text-white text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.14em] leading-none whitespace-nowrap shrink-0 shadow-[0_4px_14px_rgba(139,26,66,0.20)] hover:shadow-[0_6px_20px_rgba(139,26,66,0.30)] active:scale-[0.98] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1a42] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4] text-white transition-transform duration-[220ms] ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </button>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#f7f0e2]/80 border border-[#1a1017]/[0.08] text-[#1a1017] hover:text-[#8b1a42] hover:bg-[#ece4d6] active:scale-[0.96] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42]"
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


      {/* â”€â”€ Dedicated Mobile Liquid Glass Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              className="fixed inset-0 bg-[var(--surface)]/80 backdrop-blur-xl -z-10"
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
              className="relative w-full max-w-sm mx-auto rounded-3xl p-6 bg-[#fbf5ea]/95 backdrop-blur-xl border border-[#1a1017]/[0.08] shadow-[0_16px_48px_rgba(26,16,23,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] overflow-hidden"
            >

              {/* Modal Top Header (Redirects to Home) */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="min-w-0 flex-1" style={{ containerType: "inline-size" }}>
                  <Link
                    href="/"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleLogoClick(e);
                    }}
                    className="group inline-block max-w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1a42] rounded-lg p-1"
                    aria-label="Hardware Collection, home"
                  >
                    <BrandLockup
                      layout="inline"
                      fontSize="clamp(14.5px, 6cqw, 22px)"
                      emblemSizes="112px"
                    />
                  </Link>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#f7f0e2] border border-[#1a1017]/[0.08] flex items-center justify-center text-[#7a6872] hover:text-[#1a1017] transition-colors"
                  aria-label="Close Navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links (Collections, Brands & Catalogs) */}
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

              {/* Showroom Direct Actions: Call Showroom & WhatsApp Inquire */}
              <div className="pt-3 space-y-2.5">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#f7f0e2] hover:bg-[#ece4d6] border border-[#1a1017]/[0.08] text-[#3d2e38] font-medium text-xs tracking-wider transition-premium btn-tactile"
                  style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                >
                  <Phone className="w-3.5 h-3.5 text-[#8b1a42]" />
                  <span>Call Showroom ({primaryPhone})</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDrawer({ source: "navbar", intent: "consultation" });
                  }}
                  className="flex w-full items-center justify-center gap-2 py-3 rounded-full bg-[#8b1a42] hover:bg-[#6b1432] text-white font-bold text-xs uppercase tracking-[0.14em] shadow-[0_4px_16px_rgba(139,26,66,0.22)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.35)] btn-tactile transition-premium"
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


