"use client";

import { buildWhatsAppUrl, SHOWROOM_MAP_URL, SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY } from "@/lib/config";

/**
 * MobileConversionBar — Persistent fixed bottom bar on mobile/tablet.
 * Hidden on desktop (lg+). Sourced entirely from /lib/config.ts.
 *
 * Layout:
 *   [ ☎ CALL ]  [ ● WHATSAPP ]  [ ◎ VISIT ]
 *
 * WhatsApp is the primary action (brass/black).
 * Call and Visit are secondary (transparent/white).
 *
 * Safe-area: the bar itself grows to accommodate iPhone bottom notch.
 * The body padding-bottom is set in globals.css to match.
 *
 * Hides automatically when the mobile nav drawer is open (Navbar sets
 * html[data-drawer-open] as the signal — handled in globals.css).
 */
export default function MobileConversionBar() {
  const waUrl = buildWhatsAppUrl();

  return (
    <div
      className="mobile-conversion-bar fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        // Total height = 56px bar + device safe area (iPhone notch)
        height: "calc(var(--mobile-bar-height) + env(safe-area-inset-bottom, 0px))",
      }}
      role="navigation"
      aria-label="Quick contact actions"
    >
      {/* Frosted separator */}
      <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800" aria-hidden="true" />

      {/* Button row — constrained to --mobile-bar-height, safe area is padding below */}
      <div
        className="relative flex items-stretch w-full"
        style={{
          height: "var(--mobile-bar-height)",
        }}
      >
        {/* Call */}
        <a
          href={SHOWROOM_PHONE_HREF}
          aria-label={`Call showroom: ${SHOWROOM_PHONE_DISPLAY}`}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white active:bg-white/5 transition-colors duration-150 min-h-[44px]"
        >
          <PhoneIcon />
          <span className="text-[11px] tracking-widest uppercase font-medium">Call</span>
        </a>

        {/* Divider */}
        <div className="w-px bg-zinc-800 self-stretch my-2" aria-hidden="true" />

        {/* WhatsApp — primary */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp the showroom"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-[#C8A96E] text-[#090909] active:brightness-90 transition-all duration-150 min-h-[44px]"
        >
          <WhatsAppIcon />
          <span className="text-[11px] tracking-widest uppercase font-semibold">WhatsApp</span>
        </a>

        {/* Divider */}
        <div className="w-px bg-zinc-800 self-stretch my-2" aria-hidden="true" />

        {/* Visit */}
        <a
          href={SHOWROOM_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get directions to showroom"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-white active:bg-white/5 transition-colors duration-150 min-h-[44px]"
        >
          <MapIcon />
          <span className="text-[11px] tracking-widest uppercase font-medium">Visit</span>
        </a>
      </div>

      {/* Safe-area spacer below the buttons (iPhone notch) */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} aria-hidden="true" />
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.06 6.06l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.847L.057 23.882c-.084.303.195.582.498.498l6.162-1.553A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 0 1-5.012-1.374l-.36-.213-3.713.936.991-3.626-.233-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
