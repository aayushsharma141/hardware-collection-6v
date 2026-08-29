"use client";

import React from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight, MapPin, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { AtmosphericLayer } from "@/components/visual/AtmosphericLayer";
import {
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_SECONDARY_PHONE_DISPLAY,
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
  };
  brands?: BrandItem[];
}

const SPECIMEN_CATEGORIES = [
  { name: "Door Hardware & Locks", slug: "door-hardware" },
  { name: "Handles & Knobs", slug: "handles-knobs" },
  { name: "Modular Kitchen Systems", slug: "kitchen-wardrobes" },
  { name: "Biometric & Digital Locks", slug: "door-hardware" },
  { name: "Luxury Bathroom Suites", slug: "bathroom" },
  { name: "Furniture Hardware", slug: "furniture-hardware" },
];

const FALLBACK_BRANDS = [
  { name: "Häfele", slug: "hafele" },
  { name: "Dorset", slug: "dorset" },
  { name: "Labacha", slug: "labacha" },
  { name: "Hettich", slug: "hettich" },
  { name: "Godrej", slug: "godrej" },
  { name: "Blum", slug: "blum" },
  { name: "Geze", slug: "geze" },
  { name: "Yale", slug: "yale" },
  { name: "Kich", slug: "kich" },
];

export default function Footer({ settings, brands }: FooterProps) {
  const pathname = usePathname();

  // Suppress rendering inside Sanity Studio CMS
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const address =
    settings?.showroomAddress ||
    "1/18, Kashidih, Near Baradwari Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001";
  const hours = settings?.showroomHours || "10:00 AM – 8:00 PM, Mon–Sun";
  const primaryPhone = settings?.primaryPhone || SHOWROOM_PHONE_DISPLAY;
  const secondaryPhone = settings?.secondaryPhone || SHOWROOM_SECONDARY_PHONE_DISPLAY;
  const whatsappNumber = settings?.whatsappNumber || "919835190738";
  const defaultWhatsappMessage =
    settings?.defaultWhatsappMessage ||
    "Hi Hardware Collection, I would like to connect with your consultation desk regarding architectural hardware.";
  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://maps.google.com/?q=Hardware+Collection+1/18+Kashidih+Sakchi+Jamshedpur+Jharkhand";

  const cleanPrimaryPhone = primaryPhone.replace(/\s+/g, "");
  const cleanSecondaryPhone = secondaryPhone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

  return (
    <footer
      role="contentinfo"
      className="w-full relative px-3 md:px-8 pb-6 sm:pb-8 pt-8 sm:pt-10 overflow-hidden"
      style={{
        fontFamily: "var(--font-dmsans), 'DM Sans', -apple-system, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <AtmosphericLayer preset="footer" />

      {/* ── Floating Architectural Liquid Glass Container ──────── */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto relative rounded-[28px] md:rounded-[36px] bg-[#0E0C0C]/85 backdrop-blur-2xl [-webkit-backdrop-filter:blur(24px)_saturate(140%)] border border-white/[0.10] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_40px_rgba(200,169,110,0.02),0_20px_50px_rgba(0,0,0,0.55)] px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 overflow-hidden">
        {/* Internal ambient shimmer & specular highlight */}
        <div
          className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="liquid-glass-reflection absolute -inset-full opacity-50" />
          {/* Top-edge specular highlight */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          {/* Subtle inner top glow */}
          <div
            className="absolute top-0 inset-x-0 h-28"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.025) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── 4-Column Architectural Grid ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 pb-12 border-b border-white/[0.08]">
          {/* Col 1: Brand Identity & Heritage (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* The container query sizes the mark off this column's own width, so
                it fills the space it has without ever outgrowing it. */}
            <div style={{ containerType: "inline-size" }}>
              <Link
                href="/"
                aria-label="Hardware Collection — The Jewelry of Fittings, home"
                className="group inline-block max-w-full py-1 rounded-lg select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0C0C]"
              >
                <BrandLockup layout="stacked" fontSize="clamp(20px, 9cqw, 32px)" />
              </Link>
            </div>

            <p className="text-[13px] sm:text-sm leading-relaxed text-[#aaa49a] max-w-sm">
              Authorized architectural hardware, digital security locks, and modular kitchen
              systems showroom in Sakchi, Jamshedpur.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.10] text-[#d4cec5] tracking-[0.12em] uppercase text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
                20+ Years in Sakchi
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.10] text-[#d4cec5] tracking-[0.12em] uppercase text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96E]" />
                Authorized Dealership
              </span>
            </div>
          </div>

          {/* Col 2: Specimen Categories (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-[11.5px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
            >
              Collections
            </h4>
            <nav aria-label="Specimen Categories">
              <ul className="space-y-2.5">
                {SPECIMEN_CATEGORIES.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={`/collections?category=${cat.slug}`}
                      className="text-[12.5px] uppercase tracking-[0.16em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5 select-none"
                      style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3: Authorized Brand Partners (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4
              className="text-[11.5px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
            >
              Brands
            </h4>
            <nav aria-label="Authorized Brand Partners">
              <ul className="space-y-2.5">
                {brands && brands.length > 0
                  ? brands.slice(0, 7).map((brand) => {
                      const brandSlug =
                        typeof brand.slug === "object"
                          ? brand.slug?.current
                          : brand.slug || brand.name.toLowerCase();
                      return (
                        <li key={brand._id || brand.name}>
                          <Link
                            href={`/collections?brand=${brandSlug}`}
                            className="text-[12.5px] uppercase tracking-[0.16em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5 select-none"
                            style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
                            <span>{brand.name}</span>
                          </Link>
                        </li>
                      );
                    })
                  : FALLBACK_BRANDS.slice(0, 7).map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/collections?brand=${brand.slug}`}
                          className="text-[12.5px] uppercase tracking-[0.16em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5 select-none"
                          style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
                          <span>{brand.name}</span>
                        </Link>
                      </li>
                    ))}
              </ul>
            </nav>
          </div>

          {/* Col 4: Showroom & Consultation (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-[11.5px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
            >
              Showroom & Contact
            </h4>

            <address className="not-italic text-xs text-[#aaa49a] leading-relaxed flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#C8A96E] shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{address}</span>
            </address>

            <div className="flex items-center gap-2 text-xs text-[#aaa49a]">
              <Clock className="w-3.5 h-3.5 text-[#C8A96E] shrink-0" />
              <span>{hours}</span>
            </div>

            {/* Direct CTAs & Phone Numbers */}
            <div className="pt-2 flex flex-col gap-2.5">
              {/* WhatsApp Inquire */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between bg-white/95 hover:bg-white text-[#0E0C0C] text-[12px] font-bold uppercase tracking-[0.14em] px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,255,255,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                aria-label="Inquire with Hardware Collection consultation desk on WhatsApp"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Inquire</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0E0C0C]" />
              </a>

              {/* Driving Directions */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.10] hover:border-white/20 text-[12px] font-medium uppercase tracking-[0.12em] text-[#d4cec5] hover:text-white transition-all duration-200 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] select-none"
                style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                aria-label="Get driving directions to Hardware Collection on Google Maps"
              >
                <span>Driving Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96E] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Phone Desk Links */}
              <div className="pt-1 flex flex-col gap-1.5">
                <a
                  href={`tel:${cleanPrimaryPhone}`}
                  className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.1em] text-[#aaa49a] hover:text-white transition-colors duration-200 py-0.5"
                  style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                  aria-label={`Call consultation desk at ${primaryPhone}`}
                >
                  <Phone className="w-3 h-3 text-[#C8A96E]" />
                  <span>Call {primaryPhone}</span>
                </a>

                <a
                  href={`tel:${cleanSecondaryPhone}`}
                  className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.1em] text-[#aaa49a] hover:text-white transition-colors duration-200 py-0.5"
                  style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
                  aria-label={`Call consultation desk at ${secondaryPhone}`}
                >
                  <Phone className="w-3 h-3 text-[#C8A96E]" />
                  <span>Call {secondaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sub-Footer Bar ──────────────────────────────────── */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] sm:text-[11.5px] text-[#78716c] uppercase tracking-[0.14em]">
          <p style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} Hardware Collection (Mukesh Khandelwal). All Rights
            Reserved.
          </p>
          <div
            className="flex items-center gap-3 sm:gap-4 text-[10.5px] sm:text-[11px]"
            style={{ fontFamily: "var(--font-dmsans), 'DM Sans', sans-serif" }}
          >
            <Link
              href="/collections"
              className="text-[#aaa49a] hover:text-[#C8A96E] transition-colors"
            >
              Collections
            </Link>
            <span>·</span>
            <Link
              href="/#brands"
              className="text-[#aaa49a] hover:text-[#C8A96E] transition-colors"
            >
              Brands
            </Link>
            <span>·</span>
            <Link
              href="/catalogs"
              className="text-[#aaa49a] hover:text-[#C8A96E] transition-colors"
            >
              Catalog
            </Link>
            <span>·</span>
            <Link
              href="/#showroom"
              className="text-[#aaa49a] hover:text-[#C8A96E] transition-colors"
            >
              Sakchi Showroom
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
