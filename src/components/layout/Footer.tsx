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
  UserCheck,
  Package,
  Headphones,
  MessageCircle,
  DoorClosed,
  GripHorizontal,
  UtensilsCrossed,
  Fingerprint,
  Bath,
  Layers,
  ChevronRight,
} from "lucide-react";
import { AtmosphericLayer } from "@/components/visual/AtmosphericLayer";
import {
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_SECONDARY_PHONE_DISPLAY,
} from "@/lib/config";
import { useConsultationStore } from "@/components/consultation/store";

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
  { name: "Door Hardware & Locks", slug: "entrance", icon: DoorClosed },
  { name: "Handles & Knobs", slug: "main-door-handles", icon: GripHorizontal },
  { name: "Modular Kitchen Systems", slug: "kitchen", icon: UtensilsCrossed },
  { name: "Biometric & Digital Locks", slug: "digital-locks", icon: Fingerprint },
  { name: "Luxury Bathroom Suites", slug: "bathroom", icon: Bath },
  { name: "Furniture Hardware", slug: "wardrobe", icon: Layers },
];

const FALLBACK_BRANDS = [
  { name: "HAFELE", slug: "hafele" },
  { name: "BLUM", slug: "blum" },
  { name: "DORSET", slug: "dorset" },
  { name: "LABACHA", slug: "labacha" },
  { name: "GODREJ", slug: "godrej" },
  { name: "PANS", slug: "pans" },
  { name: "GEZE", slug: "geze" },
];

const TRUST_PILLARS_FOOTER = [
  {
    title: "PREMIUM QUALITY",
    subtitle: "Curated from world-class brands",
    icon: Award,
  },
  {
    title: "EXPERT GUIDANCE",
    subtitle: "Personalized consultation",
    icon: UserCheck,
  },
  {
    title: "COMPLETE SOLUTIONS",
    subtitle: "For every space and every need",
    icon: Package,
  },
  {
    title: "RELIABLE SUPPORT",
    subtitle: "Before & after your purchase",
    icon: Headphones,
  },
];

export default function Footer({ settings, brands }: FooterProps) {
  const pathname = usePathname();
  const { openDrawer } = useConsultationStore();

  // Suppress rendering inside Sanity Studio CMS
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const rawAddress =
    settings?.showroomAddress ||
    "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001";
  const address = rawAddress
    .replace(/Near\s+Baradwari\s+/gi, "Near ")
    .replace(/Baradwari\s*,?\s*/gi, "");
  const primaryPhone = settings?.primaryPhone || SHOWROOM_PHONE_DISPLAY;
  const secondaryPhone = settings?.secondaryPhone || SHOWROOM_SECONDARY_PHONE_DISPLAY;
  const whatsappNumber = settings?.whatsappNumber || "919835190738";
  const defaultWhatsappMessage =
    settings?.defaultWhatsappMessage ||
    "Hi Hardware Collection, I would like to connect with your consultation desk regarding architectural hardware.";
  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9";

  const cleanPrimaryPhone = primaryPhone.replace(/\s+/g, "");
  const cleanSecondaryPhone = secondaryPhone.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

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
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fbf5ea] border border-[#1a1017]/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 flex items-center justify-center text-[#8b1a42] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1017]">
                    10+ YEARS IN SAKCHI
                  </h5>
                  <p className="text-xs text-[#7a6872]">Trusted by thousands of happy customers.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fbf5ea] border border-[#1a1017]/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 flex items-center justify-center text-[#8b1a42] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1017]">
                    AUTHORIZED DEALERSHIP
                  </h5>
                  <p className="text-xs text-[#7a6872]">Genuine products from leading brands.</p>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#8b1a42] uppercase tracking-[0.18em] block mb-3">
                FOLLOW US
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Hardware Collection on Instagram"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#fbf5ea] border border-[#1a1017]/[0.10] flex items-center justify-center text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Hardware Collection on Facebook"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#fbf5ea] border border-[#1a1017]/[0.10] flex items-center justify-center text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Hardware Collection on Pinterest"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#fbf5ea] border border-[#1a1017]/[0.10] flex items-center justify-center text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 12-5.373 12-12 0-6.628-5.393-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch Hardware Collection on YouTube"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#fbf5ea] border border-[#1a1017]/[0.10] flex items-center justify-center text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Collections with Category Icons (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11.5px] font-semibold text-[#8b1a42] tracking-[0.2em] uppercase">
              COLLECTIONS
            </h4>
            <nav aria-label="Specimen Categories">
              <ul className="space-y-1.5">
                {SPECIMEN_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.name}>
                      <Link
                        href={`/collections/${cat.slug}`}
                        className="w-full text-[13px] text-[#2e232b] hover:text-[#8b1a42] hover:bg-[#fbf5ea] px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between group"
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
                {FALLBACK_BRANDS.map((brand) => (
                  <li key={brand.slug}>
                    <Link
                      href={`/catalogs?brand=${brand.slug}`}
                      className="w-full text-[12.5px] uppercase tracking-[0.14em] font-medium text-[#2e232b] hover:text-[#8b1a42] hover:bg-[#fbf5ea] px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between group text-left"
                    >
                      <span>{brand.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#7a6872] group-hover:text-[#8b1a42] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 4: Showroom & Contact (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11.5px] font-semibold text-[#8b1a42] tracking-[0.2em] uppercase">
              SHOWROOM & CONTACT
            </h4>

            {/* Address */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fbf5ea] border border-[#1a1017]/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 flex items-center justify-center text-[#8b1a42] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <address className="not-italic text-xs text-[#2e232b] leading-relaxed whitespace-pre-line">
                {address}
              </address>
            </div>

            {/* Hours Box */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbf5ea] border border-[#1a1017]/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-[#c8a96e]/15 flex items-center justify-center text-[#8b1a42] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8b1a42]">
                    SUNDAY TO MONDAY
                  </p>
                  <p className="text-xs text-[#2e232b]">10:00 AM – 8:00 PM</p>
                </div>
                <div className="pt-1 border-t border-[#1a1017]/[0.08]">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8b1a42]">
                    TUESDAY
                  </p>
                  <p className="text-xs text-[#2e232b]">10:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#8b1a42] text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-between hover:bg-[#6b1432] transition-colors shadow-md group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP INQUIRE</span>
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#f0dfbc] hover:bg-[#e6d0a4] text-[#1a1017] text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-between transition-colors shadow-sm group"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8b1a42]" />
                  <span>DRIVING DIRECTIONS</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#8b1a42] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="pt-2 space-y-1.5">
                <a
                  href={`tel:${cleanPrimaryPhone}`}
                  className="flex items-center gap-2 text-xs text-[#5a4854] hover:text-[#8b1a42] transition-colors py-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c8a96e]" />
                  <span className="font-semibold uppercase tracking-wider">CALL {primaryPhone}</span>
                </a>
                <a
                  href={`tel:${cleanSecondaryPhone}`}
                  className="flex items-center gap-2 text-xs text-[#5a4854] hover:text-[#8b1a42] transition-colors py-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c8a96e]" />
                  <span className="font-semibold uppercase tracking-wider">CALL {secondaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip (4 Pillars with Sketch) */}
        <div className="py-8 border-b border-[#1a1017]/[0.08] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
          {/* Sketch / Brand Mark */}
          <div className="hidden lg:flex items-center justify-center p-3 rounded-xl bg-[#fbf5ea] border border-[#1a1017]/[0.06] text-center">
            <div>
              <p className="hc-serif text-lg font-normal tracking-wide text-[#8b1a42]">
                Hardware Collection
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a6872] mt-0.5">
                Sakchi Flagship Showroom
              </p>
            </div>
          </div>

          {/* 4 Trust Indicators */}
          {TRUST_PILLARS_FOOTER.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#c8a96e]/10 flex items-center justify-center text-[#c8a96e] group-hover:bg-[#8b1a42]/10 group-hover:text-[#8b1a42] transition-colors shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h6 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1017]">
                    {pillar.title}
                  </h6>
                  <p className="text-xs text-[#7a6872] leading-tight mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
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
