"use client";

import React from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import {
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_PHONE_HREF,
  generateWhatsAppUrl,
} from "@/lib/config";
// Social icons as inline SVGs for reliability

export interface FooterProps {
  settings?: unknown;
  brands?: unknown;
  showroomGroups?: unknown;
}

export default function Footer(_props?: FooterProps) {
  const pathname = usePathname();

  // Suppress rendering inside Sanity Studio CMS
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer
      role="contentinfo"
      className="w-full bg-[var(--surface)] border-t border-[var(--border)] pt-10 pb-8 px-5 lg:px-16 text-[var(--text-primary)] relative z-10"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Grid matching Reference Mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-10 border-b border-[var(--border)]">
          {/* Column 1: Brand Info (col-span-2 lg:col-span-4) */}
          <div className="col-span-2 lg:col-span-4 space-y-3">
            <Link href="/" aria-label="Hardware Collection home" className="inline-block">
              <BrandLockup layout="stacked" fontSize="14px" />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-xs">
              Architectural hardware, digital security and kitchen systems showroom in Sakchi, Jamshedpur.
            </p>
            <p className="hc-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--color-brass-ink)] pt-0.5">
              20+ Years · Authorized Brands
            </p>
          </div>

          {/* Column 2: Explore (col-span-1 lg:col-span-3) */}
          <div className="col-span-1 lg:col-span-3 space-y-2.5">
            <h4 className="hc-mono text-[10.5px] uppercase tracking-[0.22em] font-semibold text-[var(--text-secondary)]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-primary)]">
              <li>
                <Link
                  href="/collections"
                  className="hover:text-[var(--color-wine)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Collections</span>
                  <span className="text-[10px]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogues"
                  className="hover:text-[var(--color-wine)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Brands & Catalogues</span>
                  <span className="text-[10px]">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (col-span-1 lg:col-span-2) */}
          <div className="col-span-1 lg:col-span-2 space-y-2.5">
            <h4 className="hc-mono text-[10.5px] uppercase tracking-[0.22em] font-semibold text-[var(--text-secondary)]">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-primary)]">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--color-wine)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Privacy Policy</span>
                  <span className="text-[10px]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[var(--color-wine)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Terms & Conditions</span>
                  <span className="text-[10px]">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (col-span-2 lg:col-span-3) */}
          <div className="col-span-2 lg:col-span-3 space-y-2.5">
            <h4 className="hc-mono text-[10.5px] uppercase tracking-[0.22em] font-semibold text-[var(--text-secondary)]">
              Contact
            </h4>
            <a
              href={SHOWROOM_PHONE_HREF}
              className="text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] block transition-colors"
            >
              {SHOWROOM_PHONE_DISPLAY}
            </a>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={generateWhatsAppUrl("footer-contact")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[var(--color-wine)] text-white text-[10.5px] font-semibold uppercase tracking-[0.14em] hover:bg-[var(--color-wine-deep)] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={SHOWROOM_PHONE_HREF}
                className="px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] text-[10.5px] font-semibold uppercase tracking-[0.14em] hover:border-[var(--text-primary)] transition-colors"
              >
                Call
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-secondary)] font-light">
          <p>© 2026 Hardware Collection (Mukesh Khandelwal). All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[10.5px] uppercase tracking-wider text-[var(--text-secondary)]">Follow us</span>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
