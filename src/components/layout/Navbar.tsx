"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
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
  { name: "Brands & Catalogs", href: "/catalogs", id: "catalog" },
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
          name: item.label,
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


