"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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

export default function Navbar({
  primaryPhone = "+91 98351 90738",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openDrawer } = useConsultationStore();

  // Scroll listener for subtle density change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
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

  // Handle ESC key to close mobile drawer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Body scroll lock + conversion bar hide signal when mobile menu is open.
  // Uses the shared ref-counted scrollLock utility so concurrent modal/drawer
  // locks don't clobber each other.
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
  ];

  const cleanPhone = primaryPhone.replace(/\s+/g, "");

  return (
    <>
      {/* ── Floating Liquid Glass Header ───────────────────────── */}
      <header
        role="banner"
        className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-out ${
          isScrolled ? "top-2 md:top-4 px-2 md:px-8" : "top-3 md:top-6 px-3 md:px-8"
        }`}
      >
        <div
          className={`pointer-events-auto relative w-full max-w-[1920px] 2xl:max-w-[2200px] rounded-full transition-all duration-500 ${
            isScrolled
              ? "h-[48px] md:h-[62px] bg-[#0E0C0C]/95 border-white/[0.15] shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              : "h-[52px] md:h-[70px] bg-[#0E0C0C]/70 border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          } backdrop-blur-2xl [-webkit-backdrop-filter:blur(24px)_saturate(140%)] border [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)]`}
        >
          {/* Subtle moving ambient light reflection */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10"
            aria-hidden="true"
          >
            <div className="liquid-glass-reflection absolute -inset-full opacity-60" />
            {/* Fine top highlight glow */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>

          {/* 3-Zone Desktop Grid / 2-Zone Mobile Layout */}
          <div className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center h-full px-4 sm:px-6 md:px-8">
            {/* ── Zone 1: Brand Lockup (Left) ────────────────────── */}
            <div className="flex items-center justify-start">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-md transition-opacity duration-300"
                aria-label="Hardware Collection Home"
              >
                <div className="relative w-8 h-8 md:w-9 md:h-9 shrink-0">
                  <Image
                    src="/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png"
                    alt="Hardware Collection Logo"
                    fill
                    sizes="36px"
                    priority
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <span
                  className="font-cormorant font-normal text-lg sm:text-xl md:text-[22px] tracking-[0.06em] text-white/95 group-hover:text-white transition-colors whitespace-nowrap"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Hardware Collection
                </span>
              </Link>
            </div>

            {/* ── Zone 2: Navigation Links (Center) ──────────────── */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center justify-center gap-8 lg:gap-10"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1.5 text-[11.5px] uppercase tracking-[0.16em] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-[#aaa49a] hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-glow"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C8A96E] rounded-full shadow-[0_0_8px_rgba(200,169,110,0.7)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Zone 3: Contact & CTA (Right) ───────────────────── */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-5">
              {/* Desktop Phone Contact - Architectural Bordered Module */}
              <a
                href={`tel:${cleanPhone}`}
                className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#c0b8ac] hover:text-white transition-all duration-300 py-1.5 px-3 rounded-md bg-white/[0.04] border border-white/[0.09] hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                aria-label={`Call Hardware Collection at ${primaryPhone}`}
              >
                <Phone className="w-3 h-3 text-[#C8A96E]" />
                <span className="font-medium text-white/90 group-hover:text-white transition-colors">
                  {primaryPhone}
                </span>
              </a>

              {/* Desktop Inquire CTA -> Opens Drawer */}
              <button
                onClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
                className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] text-[11px] font-bold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(200,169,110,0.25)] hover:shadow-[0_6px_22px_rgba(200,169,110,0.4)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0C0C]"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
              >
                <span>Inquire</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0E0C0C]" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.12] text-white/90 hover:text-white hover:bg-white/[0.12] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
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
            className="fixed inset-0 z-50 md:hidden flex flex-col justify-start px-4 pt-20 pb-8 pointer-events-auto"
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

              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 shrink-0">
                    <Image
                      src="/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png"
                      alt="Hardware Collection Logo"
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </div>
                  <span
                    className="font-cormorant text-lg text-white font-normal tracking-[0.05em]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Hardware Collection
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Close Navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col py-4 space-y-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-3.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-[#aaa49a] hover:text-white hover:bg-white/[0.04]"
                      }`}
                      style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                    >
                      <span className="text-xs uppercase tracking-[0.18em]">
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
