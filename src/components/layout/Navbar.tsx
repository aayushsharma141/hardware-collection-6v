"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useConsultationStore } from "@/components/consultation/store";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
import { useGSAP, gsap, DURATION, EASE, prefersReducedMotion } from "@/lib/animations";

interface NavbarProps {
  primaryPhone?: string;
  whatsappNumber?: string;
  defaultWhatsappMessage?: string;
  /** Optional announcement bar text from Sanity (e.g. "Showroom closed Sundays"). Hides if empty. */
  announcementBar?: string;
  /** Nav links from Sanity. Falls back to NAV_LINKS if not provided. */
  mainMenu?: Array<{ label: string; path: string }>;
}

import { MobileMenu } from "./MobileMenu";

export interface NavLinkItem {
  name: string;
  href: string;
  id: string;
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

/** Default nav links — only used when Sanity navigation doc has no mainMenu */
const NAV_LINKS_FALLBACK: NavLinkItem[] = [
  { name: "Collections", href: "/collections", id: "collections" },
  { name: "Brands & Catalogues", href: "/catalogues", id: "catalogues" },
];

export default function Navbar({
  primaryPhone = "+91 98351 90738",
  announcementBar,
  mainMenu,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const { openDrawer } = useConsultationStore();
  const shouldReduceMotion = useReducedMotion();
  const navbarRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: DURATION.HERO, ease: EASE.LUXURY, delay: 0.1 }
    );
  }, { scope: navbarRef });

  // Suppress rendering inside Sanity Studio CMS
  const isStudio = pathname?.startsWith("/studio");

  // Use Sanity nav if populated, else fall back to hardcoded links
  const navLinks: NavLinkItem[] =
    mainMenu && mainMenu.length > 0
      ? mainMenu.map((item) => ({
        name: item.label.replace(/catalogs/i, "Catalogues").replace(/catalogues/i, "Catalogues"),
        href: item.path,
        id: item.path.replace(/^\//, "").replace(/\//g, "-") || "home",
      }))
      : NAV_LINKS_FALLBACK;


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
      // /collections is the only collections route; categories are in-page sections.
      return pathname === "/collections";
    }
    if (link.id === "brands") {
      return pathname === "/catalogues" || pathname === "/catalogs";
    }
    if (link.id === "catalogues" || link.id === "catalog") {
      return pathname === "/catalogues" || pathname === "/catalogs";
    }
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    setMobileMenuOpen(false);
    if ((link.id === "catalog" || link.id === "catalogues" || link.id === "brands") && (pathname === "/catalogues" || pathname === "/catalogs")) {
      if (link.href.includes("#")) {
        const hash = link.href.split("#")[1];
        const el = document.getElementById(hash);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${hash}`);
          return;
        }
      }
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/catalogues");
    } else if (link.id === "collections" && pathname === "/collections") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/collections");
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <>
      <AnimatePresence>
        {announcementBar && !isScrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-[#8b1a42] text-white text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-center py-2 px-4"
            style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
          >
            {announcementBar}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Tactile Glass Header ─────────────────────── */}
      <header
        ref={navbarRef}
        role="banner"
        className={`navbar-island fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-[top,padding] duration-300 ease-out ${isScrolled ? "top-2 md:top-3 px-3 md:px-8" : "top-3 md:top-5 px-3 md:px-8"
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
          className={`absolute inset-x-0 -top-3 md:-top-5 h-[130px] md:h-[150px] bg-gradient-to-b from-[var(--surface)]/85 via-[var(--surface)]/45 to-transparent transition-opacity duration-300 ease-out ${isOverHero ? "opacity-100" : "opacity-0"
            }`}
        />

        <div
          className={`pointer-events-auto relative w-full max-w-[1920px] 2xl:max-w-[2200px] rounded border transition-[height,background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out ${isScrolled ? "h-[58px] md:h-[64px]" : "h-[64px] md:h-[76px]"
            } ${barMaterial}`}
        >
          {/* Strict Balanced 3-Zone Desktop Grid & 2-Zone Mobile Layout */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 lg:gap-0 lg:grid-cols-[auto_1fr_auto] items-center h-full px-4 sm:px-6 md:px-8">

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
              {navLinks.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    /* 16px regular from xl up: the size the nav has shipped at
                       (a global font reset was overriding these classes) and
                       what --nav-brand-size was balanced against. 14px between
                       lg and xl, where 16px pushed the CTA out of the bar. */
                    className={`relative px-2.5 xl:px-4 py-1.5 text-sm xl:text-base leading-6 uppercase tracking-[0.12em] xl:tracking-[0.18em] rounded select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] whitespace-nowrap shrink-0 ${isActive
                        ? "text-[#8b1a42] font-medium"
                        : "text-[#8b1a42] font-normal hover:text-[#6b1432] hover:bg-[#8b1a42]/[0.06]"
                      }`}
                    style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={shouldReduceMotion ? undefined : "active-nav-capsule"}
                        className="absolute inset-0 rounded bg-[#8b1a42]/[0.06] border border-[#8b1a42]/[0.10] -z-10"
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
                className="hidden lg:inline-flex items-center justify-center gap-2 h-11 min-h-[44px] px-3.5 xl:px-4 rounded bg-[#f7f0e2]/80 border border-[#1a1017]/[0.08] hover:border-[#8b1a42]/25 hover:bg-[#f7f0e2]/80 text-[11px] xl:text-[12px] font-medium uppercase tracking-[0.12em] text-[#3d2e38] hover:text-[#1a1017] whitespace-nowrap shrink-0 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                aria-label={`Call Hardware Collection at ${primaryPhone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#8b1a42] shrink-0" />
                <span className="hidden 2xl:inline leading-none whitespace-nowrap">{primaryPhone}</span>
              </a>

              {/* Desktop Inquire CTA Button */}
              <button
                onClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
                className="hidden lg:inline-flex items-center justify-center gap-1.5 h-11 min-h-[44px] px-4 xl:px-5 rounded bg-[#8b1a42] hover:bg-[#6b1432] text-white text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.14em] leading-none whitespace-nowrap shrink-0 shadow-[0_4px_14px_rgba(139,26,66,0.20)] hover:shadow-[0_6px_20px_rgba(139,26,66,0.30)] active:scale-[0.98] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1a42] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4] text-white transition-transform duration-[220ms] ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </button>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] bg-transparent text-[var(--text-primary)] hover:text-[var(--color-wine)] active:scale-[0.96] transition-all duration-200 focus-visible:outline-none"
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


      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuButtonRef={menuButtonRef}
        navLinks={navLinks}
        isLinkActive={isLinkActive}
        handleNavClick={handleNavClick}
        handleLogoClick={handleLogoClick}
        primaryPhone={primaryPhone}
        cleanPhone={cleanPhone}
        onConsultClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
      />

    </>
  );
}


