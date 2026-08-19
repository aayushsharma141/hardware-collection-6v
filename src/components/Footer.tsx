"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowUpRight, MapPin, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { AtmosphericLayer } from "@/components/visual/AtmosphericLayer";

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
    whatsappNumber?: string;
    defaultWhatsappMessage?: string;
    googleMapsUrl?: string;
  };
  brands?: BrandItem[];
}

const SPECIMEN_CATEGORIES = [
  { name: "Door Hardware & Locks", slug: "doors" },
  { name: "Modular Kitchen Systems", slug: "kitchen" },
  { name: "Biometric & Digital Locks", slug: "smart" },
  { name: "Luxury Bathroom Fittings", slug: "bath" },
  { name: "Wardrobe & Sliding Systems", slug: "wardrobe" },
  { name: "Architectural Glass Hardware", slug: "architectural" },
];

const FALLBACK_BRANDS = [
  { name: "Häfele", slug: "hafele" },
  { name: "Dorset", slug: "dorset" },
  { name: "Labacha", slug: "labacha" },
  { name: "Hettich", slug: "hettich" },
  { name: "Godrej", slug: "godrej" },
  { name: "Kich", slug: "kich" },
];

export default function Footer({ settings, brands }: FooterProps) {
  const address =
    settings?.showroomAddress ||
    "1/18, Kashidih, Near Baradwari Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001";
  const hours = settings?.showroomHours || "10:00 AM – 8:00 PM, Mon–Sun";
  const primaryPhone = settings?.primaryPhone || "+91 98351 90738";
  const whatsappNumber = settings?.whatsappNumber || "919835190738";
  const defaultWhatsappMessage =
    settings?.defaultWhatsappMessage ||
    "Hi Hardware Collection, I would like to connect with your consultation desk regarding architectural hardware.";
  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://maps.google.com/?q=Hardware+Collection+1/18+Kashidih+Sakchi+Jamshedpur+Jharkhand";

  const cleanPhone = primaryPhone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

  return (
    <footer
      role="contentinfo"
      className="w-full relative px-4 sm:px-6 md:px-8 pb-8 pt-10 overflow-hidden"
    >
      <AtmosphericLayer preset="footer" />

      {/* ── Floating Architectural Liquid Glass Container ──────── */}
      <div className="max-w-[1360px] mx-auto relative rounded-[24px] md:rounded-[32px] bg-[#0E0C0C]/75 backdrop-blur-2xl [-webkit-backdrop-filter:blur(28px)_saturate(160%)] border border-white/[0.11] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_40px_rgba(200,169,110,0.025),0_24px_72px_rgba(0,0,0,0.55),0_4px_20px_rgba(200,169,110,0.06)] p-7 sm:p-9 md:p-12 overflow-hidden">
        {/* Internal ambient shimmer */}
        <div
          className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="liquid-glass-reflection absolute -inset-full opacity-60" />
          {/* Top-edge specular highlight — primary glass surface indicator */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          {/* Subtle inner top glow */}
          <div
            className="absolute top-0 inset-x-0 h-28"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.028) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── 4-Column Architectural Grid ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Col 1: Brand Identity & Heritage (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-md transition-opacity duration-300"
              aria-label="Hardware Collection Home"
            >
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png"
                  alt="Hardware Collection Logo"
                  fill
                  sizes="36px"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <span
                className="font-cormorant font-normal text-2xl tracking-[0.06em] text-white/95 group-hover:text-white transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Hardware Collection
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-[#aaa49a] max-w-sm">
              Authorized architectural hardware, digital security locks, and modular kitchen
              systems showroom in Sakchi, Jamshedpur.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#e8e3d9] tracking-wider uppercase text-[10.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
                20+ Years in Sakchi
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#aaa49a] tracking-wider uppercase text-[10.5px]">
                <ShieldCheck className="w-3 h-3 text-[#C8A96E]" />
                Authorized Dealership
              </span>
            </div>
          </div>

          {/* Col 2: Specimen Categories (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-[11px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
            >
              Specimens
            </h4>
            <nav aria-label="Specimen Categories">
              <ul className="space-y-2.5">
                {SPECIMEN_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/collections?category=${cat.slug}`}
                      className="text-xs uppercase tracking-[0.14em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5"
                      style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                    >
                      <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
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
              className="text-[11px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
            >
              Partners
            </h4>
            <nav aria-label="Authorized Brand Partners">
              <ul className="space-y-2.5">
                {brands && brands.length > 0
                  ? brands.map((brand) => {
                      const brandSlug =
                        typeof brand.slug === "object"
                          ? brand.slug?.current
                          : brand.slug || brand.name.toLowerCase();
                      return (
                        <li key={brand._id || brand.name}>
                          <Link
                            href={`/collections?brand=${brandSlug}`}
                            className="text-xs uppercase tracking-[0.14em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5"
                            style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                          >
                            <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
                            <span>{brand.name}</span>
                          </Link>
                        </li>
                      );
                    })
                  : FALLBACK_BRANDS.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          href={`/collections?brand=${brand.slug}`}
                          className="text-xs uppercase tracking-[0.14em] font-medium text-[#aaa49a] hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E] rounded-sm py-0.5"
                          style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                        >
                          <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#C8A96E] transition-colors" />
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
              className="text-[11px] font-semibold text-[#C8A96E] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
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

            {/* CTAs with identical liquid-glass pill geometry */}
            <div className="pt-2 flex flex-col gap-2.5">
              {/* Primary Inquire Pill */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between bg-white/95 hover:bg-white text-[#0E0C0C] text-[11px] font-semibold uppercase tracking-[0.14em] px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,255,255,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                aria-label="Inquire with Hardware Collection consultation desk on WhatsApp"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Inquire</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#0E0C0C]" />
              </a>

              {/* Driving Directions Glass Pill */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] text-xs font-medium text-white/90 hover:text-white transition-all duration-200 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                aria-label="Get driving directions to Hardware Collection on Google Maps"
              >
                <span>Driving Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96E] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Phone Desk Link */}
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.1em] text-[#aaa49a] hover:text-white transition-colors duration-200 py-1"
                style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
                aria-label={`Call consultation desk at ${primaryPhone}`}
              >
                <Phone className="w-3 h-3 text-[#C8A96E]" />
                <span>Call {primaryPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Sub-Footer Bar ──────────────────────────────────── */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-[#78716c] uppercase tracking-wider">
          <p style={{ fontFamily: "var(--font-dmsans), sans-serif" }}>
            © {new Date().getFullYear()} Hardware Collection (Mukesh Khandelwal). All Rights
            Reserved.
          </p>
          <div
            className="flex items-center gap-4 text-[10.5px]"
            style={{ fontFamily: "var(--font-dmsans), sans-serif" }}
          >
            <span>Sakchi, Jamshedpur</span>
            <span>·</span>
            <span>Authorized Dealerships</span>
            <span>·</span>
            <Link
              href="/collections"
              className="text-[#aaa49a] hover:text-[#C8A96E] transition-colors"
            >
              Digital Catalog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
