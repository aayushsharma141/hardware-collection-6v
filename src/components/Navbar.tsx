"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  primaryPhone?: string;
  whatsappNumber?: string;
  defaultWhatsappMessage?: string;
}

export default function Navbar({ primaryPhone = "+91 98351 90738", whatsappNumber = "919835190738", defaultWhatsappMessage = "Hi Hardware Collection, I'd like to discuss these products:" }: NavbarProps) {
  const [, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-bg-surface)]/95 backdrop-blur-2xl border-b border-black/5">
      <div className="h-20 max-w-[1320px] mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png"
            alt="Hardware Collection Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-tight text-[var(--color-text-main)]">
              Hardware Collection
            </span>
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Sakchi, Jamshedpur
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-xs uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-sm ${
                  isActive
                    ? "text-[var(--color-text-main)] font-semibold border-b border-[var(--color-text-main)] pb-1"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] text-xs font-body uppercase tracking-wider transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[var(--color-text-main)]" />
            <span>{primaryPhone}</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary uppercase tracking-widest text-xs px-6 py-2.5 rounded-none flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Inquire
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[var(--color-text-main)] hover:text-black"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden bg-[var(--color-bg-surface)] border-b border-black/5 px-6 py-6 space-y-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-3 font-body text-xs tracking-widest uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 rounded-sm ${
                    pathname === link.href ? "text-[var(--color-text-main)] font-bold" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-black/5 flex flex-col gap-3">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-3 bg-[var(--color-bg-surface-2)] text-[var(--color-text-main)] font-body text-xs uppercase tracking-widest border border-black/5"
              >
                <Phone className="w-4 h-4 text-[var(--color-text-main)]" />
                Call {primaryPhone}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[var(--color-text-main)] text-white font-body font-bold text-xs uppercase tracking-widest"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp Inquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
