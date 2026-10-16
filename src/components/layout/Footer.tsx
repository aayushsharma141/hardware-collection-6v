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
  SHOWROOM_SOCIAL_FALLBACKS,
  type ShowroomSocialLink,
} from "@/lib/config";
import type { SiteSettings } from "@/types/catalog";

// Social icons as inline SVGs for reliability & exact vector geometry
function SocialIcon({ platform }: { platform: string }) {
  const norm = platform.toLowerCase();
  if (norm.includes("linkedin")) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }
  if (norm.includes("pinterest")) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    );
  }
  if (norm.includes("instagram")) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (norm.includes("facebook")) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (norm.includes("youtube")) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export interface FooterProps {
  settings?: SiteSettings | null;
  brands?: unknown;
  showroomGroups?: unknown;
  socialLinks?: ShowroomSocialLink[];
}

export default function Footer({ settings, socialLinks: customSocialLinks }: FooterProps = {}) {
  const pathname = usePathname();

  // Priority: explicit prop -> CMS socialLinks array -> CMS explicit fields -> fallback defaults
  const resolvedSocialLinks = React.useMemo(() => {
    if (customSocialLinks && customSocialLinks.length > 0) {
      return customSocialLinks;
    }

    if (settings?.socialLinks && settings.socialLinks.length > 0) {
      return settings.socialLinks;
    }

    const fromFields: ShowroomSocialLink[] = [];
    if (settings?.linkedinUrl) fromFields.push({ platform: "LinkedIn", url: settings.linkedinUrl });
    if (settings?.pinterestUrl) fromFields.push({ platform: "Pinterest", url: settings.pinterestUrl });
    if (settings?.instagramUrl) fromFields.push({ platform: "Instagram", url: settings.instagramUrl });
    if (settings?.facebookUrl) fromFields.push({ platform: "Facebook", url: settings.facebookUrl });

    if (fromFields.length > 0) {
      return fromFields;
    }

    return SHOWROOM_SOCIAL_FALLBACKS;
  }, [customSocialLinks, settings]);

  // Suppress rendering inside Sanity Studio CMS
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const showroomPhoneHref = settings?.secondaryPhone
    ? `tel:${settings.secondaryPhone.replace(/\s+/g, "")}`
    : SHOWROOM_SECONDARY_PHONE_HREF;
  const showroomPhoneDisplay = settings?.secondaryPhone || SHOWROOM_SECONDARY_PHONE_DISPLAY;

  const primaryPhoneHref = settings?.primaryPhone
    ? `tel:${settings.primaryPhone.replace(/\s+/g, "")}`
    : SHOWROOM_PHONE_HREF;
  const primaryPhoneDisplay = settings?.primaryPhone || SHOWROOM_PHONE_DISPLAY;

  return (
    <footer
      role="contentinfo"
      className="w-full bg-[var(--surface)] border-t border-[var(--border)] pt-10 pb-8 px-5 lg:px-16 text-[var(--text-primary)] relative z-10"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Top Grid matching Reference Mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-10 border-b border-[var(--border)]">
          {/* Column 1: Brand Info & Socials (col-span-2 lg:col-span-4) */}
          <div className="col-span-2 lg:col-span-4 space-y-3.5">
            <Link href="/" aria-label="Hardware Collection home" className="inline-block">
              <BrandLockup layout="stacked" fontSize="14px" />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-xs">
              Architectural hardware, digital security and kitchen systems showroom in Sakchi, Jamshedpur.
            </p>
            <p className="hc-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--color-brass-ink)] pt-0.5">
              10+ Years · 20+ Authorised Brands Partner
            </p>

            {resolvedSocialLinks.length > 0 && (
              <div className="pt-2">
                <p className="hc-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)] mb-2.5">
                  Follow Showroom
                </p>
                <div className="flex items-center gap-2.5 flex-wrap" aria-label="Showroom social media channels">
                  {resolvedSocialLinks.map((social) => (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Hardware Collection on ${social.platform}`}
                      title={`${social.platform} — Hardware Collection`}
                      className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-wine)] hover:border-[var(--color-wine)] hover:bg-[var(--surface-raised)] transition-[color,border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wine)] focus-visible:ring-offset-2"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}
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
                href={showroomPhoneHref}
                className="text-[11.5px] font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] block transition-colors"
              >
                Hardware Collection Showroom : {showroomPhoneDisplay}
              </a>
              <a
                href={primaryPhoneHref}
                className="text-[11.5px] font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] block transition-colors"
              >
                Mukesh Khandelwal : {primaryPhoneDisplay}
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
