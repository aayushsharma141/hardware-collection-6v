"use client";

import React from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import {
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_PHONE_HREF,
  SHOWROOM_SECONDARY_PHONE_DISPLAY,
  SHOWROOM_SECONDARY_PHONE_HREF,
} from "@/lib/config";
// Social icons as inline SVGs for reliability

export interface FooterProps {
  settings?: unknown;
  brands?: unknown;
  showroomGroups?: unknown;
}

export default function Footer({}: FooterProps = {}) {
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
              10+ Years · 20+ Authorised Brands Partner
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

            <div className="space-y-2 pt-1">
              <a
                href={SHOWROOM_SECONDARY_PHONE_HREF}
                className="text-[11.5px] font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] block transition-colors"
              >
                Hardware Collection Showroom : {SHOWROOM_SECONDARY_PHONE_DISPLAY}
              </a>
              <a
                href={SHOWROOM_PHONE_HREF}
                className="text-[11.5px] font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] block transition-colors"
              >
                Mukesh Khandelwal : {SHOWROOM_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-secondary)] font-light">
          <p>© 2026 Hardware Collection (Mukesh Khandelwal). All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/919835190738?text=Hi%2C%20I%E2%80%99m%20interested%20in%20Hardware%20Collection%E2%80%99s%20collections."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.14em] text-[10px]"
            >
              <span>WhatsApp Concierge</span>
              <span aria-hidden="true">↗</span>
            </a>
            <span className="text-[var(--border)]">•</span>
            <a
              href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.14em] text-[10px]"
            >
              <span>Showroom Directions</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
