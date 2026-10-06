"use client";

import React from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import {
  Phone,
  ArrowUpRight,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  DoorClosed,
  UtensilsCrossed,
  Hand,
  Armchair,
  Bath,
  Lock,
  PanelsTopLeft,
  ChevronRight,
} from "lucide-react";
import { AtmosphericLayer } from "@/components/home/AtmosphericLayer";
import { showroomHref } from "@/lib/collections/showroom";
import {
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_SECONDARY_PHONE_DISPLAY,
  SHOWROOM_HOURS_FALLBACK,
  SHOWROOM_ADDRESS,
  SHOWROOM_YEARS_OF_TRUST,
} from "@/lib/config";


interface BrandItem {
  _id?: string;
  name: string;
  slug?: { current?: string } | string;
  authorizedStatus?: string;
}

interface FooterProps {
  settings?: {
    showroomAddress?: string;
    showroomHours?: string;
    primaryPhone?: string;
    secondaryPhone?: string;
    whatsappNumber?: string;
    defaultWhatsappMessage?: string;
    googleMapsUrl?: string;
    email?: string;
    authorizedBrandRefs?: { brandName: string; slug: string; logoUrl?: string }[];
  };
  brands?: BrandItem[];
  /**
   * The showroom groups that have products (see `getShowroomGroups`). Only these
   * are linked: a group with nothing in it has no section to land on. Without
   * it the footer offers a single link to the catalogue.
   */
  showroomGroups?: { id: string; title: string }[];
}

/**
 * The catalogue's showroom groups, as in-page links. There are no per-category
 * pages, so these go to anchors on /collections. Titles and ids come from the
 * one mapping in `@/lib/collections/showroom`; only the icons live here.
 */
const SHOWROOM_ICONS: Record<string, typeof DoorClosed> = {
  door: DoorClosed,
  "smart-security": Lock,
  kitchen: UtensilsCrossed,
  "wardrobe-furniture": Hand,
  "bathroom-hardware": Bath,
  glass: PanelsTopLeft,
  "furniture-fittings": Armchair,
};

function toShowroomLinks(groups: { id: string; title: string }[] | undefined) {
  const links = (groups ?? []).map((group) => ({
    name: group.title,
    href: showroomHref(group.id),
    icon: SHOWROOM_ICONS[group.id] ?? DoorClosed,
  }));
  return links.length > 0
    ? links
    : [{ name: "Browse the showroom", href: "/collections", icon: DoorClosed }];
}

const FALLBACK_BRANDS = [
  { name: "HAFELE", slug: "hafele" },
  { name: "BLUM", slug: "blum" },
  { name: "DORSET", slug: "dorset" },
  { name: "LABACHA", slug: "labacha" },
  { name: "GODREJ", slug: "godrej" },
  { name: "PANS", slug: "pans" },
  { name: "GEZE", slug: "geze" },
];

export default function Footer({ settings, brands, showroomGroups }: FooterProps) {
  const pathname = usePathname();

  // Suppress rendering inside Sanity Studio CMS
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const address = settings?.showroomAddress || SHOWROOM_ADDRESS;
  const primaryPhone = settings?.primaryPhone || SHOWROOM_PHONE_DISPLAY;
  const secondaryPhone = settings?.secondaryPhone || SHOWROOM_SECONDARY_PHONE_DISPLAY;
  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur";

  const cleanPrimaryPhone = primaryPhone.replace(/\s+/g, "");
  const cleanSecondaryPhone = secondaryPhone.replace(/\s+/g, "");

  return (
    <footer
      role="contentinfo"
      className="w-full relative px-3 md:px-8 pb-6 sm:pb-8 pt-8 sm:pt-10 overflow-hidden bg-[#fbf5ea]"
      style={{
        fontFamily: "var(--font-dmsans), 'DM Sans', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <AtmosphericLayer preset="footer" />

      {/* Floating Architectural Card */}
      <div className="w-full max-w-[1920px] mx-auto relative rounded-[28px] md:rounded-[36px] bg-[#f8f1e4] backdrop-blur-2xl border border-[#1a1017]/[0.08] shadow-[0_8px_40px_rgba(26,16,23,0.06)] px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 overflow-hidden">
        {/* Top 4-Column Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-14 pb-12 border-b border-[#1a1017]/[0.08]">
          
          {/* Col 1: Brand Identity & Trust Pills (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              aria-label="Hardware Collection, home"
              className="group inline-block max-w-full py-1 rounded-lg select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42]"
            >
              <BrandLockup layout="stacked" fontSize="33px" />
            </Link>

            <p className="text-sm text-[#5a4854] leading-relaxed max-w-sm">
              Authorized architectural hardware, digital security locks, and modular kitchen
              systems showroom in Sakchi, Jamshedpur.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-none bg-[var(--surface-raised)] border border-[var(--border)]">
                <div className="w-8 h-8 rounded-none bg-[var(--color-brass)]/15 flex items-center justify-center text-[var(--color-wine)] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    {SHOWROOM_YEARS_OF_TRUST}+ YEARS IN SAKCHI
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">Trusted by thousands of happy customers.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-none bg-[var(--surface-raised)] border border-[var(--border)]">
                <div className="w-8 h-8 rounded-none bg-[var(--color-brass)]/15 flex items-center justify-center text-[var(--color-wine)] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    AUTHORIZED DEALERSHIP
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">Genuine products from leading brands.</p>
                </div>
              </div>
            </div>

            {/* Follow Us - Hidden until official URLs are confirmed */}
            {/*
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#8b1a42] uppercase tracking-[0.18em] block mb-3">
                FOLLOW US
              </span>
              ...
            </div>
            */}
          </div>

          {/* Col 2: Collections with Category Icons (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11.5px] font-semibold text-[#8b1a42] tracking-[0.2em] uppercase">
              COLLECTIONS
            </h4>
            <nav aria-label="Showroom collections">
              <ul className="space-y-1.5">
                {toShowroomLinks(showroomGroups).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        className="w-full min-h-11 text-[13px] text-[#2e232b] hover:text-[#8b1a42] hover:bg-[#fbf5ea] px-2.5 py-2 rounded-none transition-colors flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#c8a96e] group-hover:text-[#8b1a42] transition-colors" />
                          <span className="font-normal">{cat.name}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#7a6872] group-hover:text-[#8b1a42] transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Col 3: Brands (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11.5px] font-semibold text-[#8b1a42] tracking-[0.2em] uppercase">
              BRANDS
            </h4>
            <nav aria-label="Authorized Brand Partners">
              <ul className="space-y-1.5">
                {Array.from(new Map(
                  (settings?.authorizedBrandRefs?.length ? settings.authorizedBrandRefs : (brands?.length ? brands : FALLBACK_BRANDS)).map((brand) => {
                    const b = brand as { slug?: string | { current?: string }; id?: string; name?: string; brandName?: string };
                    const slug = (typeof b.slug === 'string' ? b.slug : b.slug?.current) || b.id || b.name;
                    return [slug, brand];
                  })
                ).values()).slice(0, 6).map((brand) => {
                  const b = brand as { slug?: string | { current?: string }; id?: string; name?: string; brandName?: string };
                  const name = b.name || b.brandName;
                  const slug = (typeof b.slug === 'string' ? b.slug : b.slug?.current) || b.id || b.name;
                  return (
                  <li key={slug}>
                    <Link
                      href={`/catalogs?brand=${slug}`}
                      className="w-full text-[12.5px] uppercase tracking-[0.14em] font-medium text-[#2e232b] hover:text-[#8b1a42] hover:bg-[#fbf5ea] px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between group text-left"
                    >
                      <span>{name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#7a6872] group-hover:text-[#8b1a42] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                )})}
              </ul>
            </nav>
          </div>

          {/* Col 4: Showroom & Contact (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11.5px] font-semibold text-[#8b1a42] tracking-[0.2em] uppercase">
              SHOWROOM & CONTACT
            </h4>

            {/* Address & Directions */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-none bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--color-wine)]/40 hover:bg-[var(--surface-raised)] transition-all group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-none bg-[var(--color-brass)]/15 group-hover:bg-[var(--color-wine)] group-hover:text-white transition-colors flex items-center justify-center text-[var(--color-wine)] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <address className="not-italic text-xs text-[#2e232b] leading-relaxed whitespace-pre-line group-hover:text-[var(--color-wine)] transition-colors">
                  {address}
                </address>
                <div className="mt-2 text-[10.5px] font-bold text-[var(--color-wine)] tracking-[0.16em] uppercase flex items-center gap-1">
                  DRIVING DIRECTIONS
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>

            {/* Hours Box */}
            <div className="flex items-start gap-3 p-3.5 rounded-none bg-[var(--surface-raised)] border border-[var(--border)]">
              <div className="w-8 h-8 rounded-none bg-[var(--color-brass)]/15 flex items-center justify-center text-[var(--color-wine)] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#2e232b] leading-relaxed whitespace-pre-line">
                {settings?.showroomHours || SHOWROOM_HOURS_FALLBACK}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <div className="pt-2 space-y-2">
                <a
                  href={`tel:${cleanPrimaryPhone}`}
                  aria-label={`Call Mukesh Khandelwal at ${primaryPhone}`}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-none bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--color-wine)]/40 transition-all group active:scale-[0.98]"
                >
                  <span className="text-xs font-medium text-[#2e232b] group-hover:text-[var(--color-wine)] transition-colors">
                    Call Mukesh Khandelwal
                  </span>
                  <span className="px-2.5 py-1.5 rounded-none bg-[var(--color-wine)] text-white text-[11px] font-bold tracking-wider group-hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0 shadow-sm">
                    <Phone className="w-3 h-3 text-[var(--color-brass)]" />
                    <span>CALL {primaryPhone}</span>
                  </span>
                </a>

                <a
                  href={`tel:${cleanSecondaryPhone}`}
                  aria-label={`Enquire Showroom at ${secondaryPhone}`}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-none bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--color-wine)]/40 transition-all group active:scale-[0.98]"
                >
                  <span className="text-xs font-medium text-[#2e232b] group-hover:text-[var(--color-wine)] transition-colors">
                    Enquire Showroom
                  </span>
                  <span className="px-2.5 py-1.5 rounded-none bg-[var(--color-wine)] text-white text-[11px] font-bold tracking-wider group-hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0 shadow-sm">
                    <Phone className="w-3 h-3 text-[var(--color-brass)]" />
                    <span>CALL {secondaryPhone}</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#7a6872]">
          <p>
            © 2026 Hardware Collection (Mukesh Khandelwal). All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Link href="/privacy" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-[#1a1017]/20">|</span>
            <Link href="/terms" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Terms & Conditions
            </Link>
            <span aria-hidden="true" className="text-[#1a1017]/20">|</span>
            <Link href="/collections" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Collections
            </Link>
            <span aria-hidden="true" className="text-[#1a1017]/20">·</span>
            <Link href="/#brands" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Brands
            </Link>
            <span aria-hidden="true" className="text-[#1a1017]/20">·</span>
            <Link href="/catalogs" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Catalog
            </Link>
            <span aria-hidden="true" className="text-[#1a1017]/20">·</span>
            <Link href="/#showroom" className="min-h-[44px] py-2 px-2 inline-flex items-center hover:text-[#8b1a42] transition-colors">
              Sakchi Showroom
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
