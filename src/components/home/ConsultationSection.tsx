"use client";

import React from "react";
import Image from "next/image";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { urlForImage } from "@/content/sanity/lib/image";
import {
  SHOWROOM_PHONE_HREF,
  SHOWROOM_MAP_URL,
  generateWhatsAppUrl,
} from "@/lib/config";

interface ConsultationSectionProps {
  id?: string;
  heading?: string;
  description?: string;
  showMap?: boolean;
  image?: unknown;
}

export function ConsultationSection({
  id = "consultation",
  showMap = true,
  image,
}: ConsultationSectionProps) {
  const imageUrl = image ? urlForImage(image).url() : "/cinema/consultation/consultation-editorial-v2.jpg";

  return (
    <section
      id={id}
      className="w-full relative overflow-hidden bg-[var(--surface)] border-t border-[var(--border)] scroll-mt-20 font-dmsans"
    >
      {/* ── DESKTOP VIEW (lg:grid): Clean 50/50 Split-Screen Composition ──── */}
      <div className="hidden lg:grid lg:grid-cols-2 w-full min-h-[480px] items-stretch">
        {/* Left 50%: Editorial Luxury Panel with Full-Height Image */}
        <div className="relative w-full h-full overflow-hidden flex flex-col justify-center p-10 lg:p-12 xl:p-16 select-none">
          <Image
            src={imageUrl}
            alt="Luxury Architectural Interior with Bronze Door Handle"
            fill
            sizes="50vw"
            priority
            className="object-cover object-[85%_center]"
          />

          {/* Top Left: Eyebrow + Headline + Short Copy */}
          <div className="relative z-10 max-w-[500px]">
            {/* Eyebrow */}
            <div className="flex items-start gap-3 mb-10">
              <span className="w-6 h-[1px] bg-[var(--border)] shrink-0 mt-2" aria-hidden="true" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--text-primary)] font-semibold">
                  Private Consultation
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-medium mt-1">
                  Sakchi, Jamshedpur
                </span>
              </div>
            </div>

            {/* Large Editorial Headline: Roman + Italic Gold */}
            <h2
              className="font-cormorant text-[clamp(40px,4vw,56px)] font-normal tracking-tight text-[var(--text-primary)] leading-[1.05] mb-4"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Let&apos;s Plan
              <br />
              <span className="italic text-[var(--color-brass)]">Your Space.</span>
            </h2>

            {/* Supporting Copy */}
            <p className="text-[16px] xl:text-[17px] text-[var(--text-secondary)] font-normal leading-relaxed max-w-[400px]">
              Meet our experts at our Sakchi showroom and get the right solution for your project.
            </p>
          </div>

          {/* Bottom Left: Statistics — Perfectly Aligned with Form Submit CTA */}
          <div className="relative z-10 mt-12 lg:mt-16 xl:mt-20">
            <div className="flex items-end gap-6 max-w-[400px]">
              <div>
                <p
                  className="font-cormorant text-4xl lg:text-5xl font-normal text-[var(--text-primary)] leading-none drop-shadow-sm"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  10+
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold mt-2 font-dmsans drop-shadow-sm">
                  Years of Experience
                </p>
              </div>

              <div className="w-[1px] h-8 bg-[var(--border)] self-center shrink-0" aria-hidden="true" />

              <div>
                <p
                  className="font-cormorant text-4xl lg:text-5xl font-normal text-[var(--text-primary)] leading-none tabular-nums drop-shadow-sm"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  20+
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold mt-2 font-dmsans leading-tight drop-shadow-sm">
                  Authorised<br />Brands
                </p>
              </div>

              <div className="w-[1px] h-8 bg-[var(--border)] self-center shrink-0" aria-hidden="true" />

              <div>
                <p
                  className="font-cormorant text-3xl lg:text-4xl font-normal text-[var(--text-primary)] leading-none tracking-wide drop-shadow-sm"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  SAKCHI
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold mt-2 font-dmsans drop-shadow-sm">
                  Showroom Location
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 50%: Clean Warm Ivory Consultation Form Container — Borderless split */}
        <div className="w-full h-full bg-[var(--surface)] flex flex-col justify-center p-8 lg:p-12 xl:p-16 border-l border-[var(--border)]">
          <div className="w-full flex flex-col">
            <ConsultationForm inline={true} />
          </div>
        </div>
      </div>

      {/* ── MOBILE VIEW (lg:hidden): Ordered Stack ──────────────────────── */}
      <div className="block lg:hidden w-full bg-[var(--surface)]">
        {/* 1. Image / Editorial photograph */}
        <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden">
          <Image
            src={imageUrl}
            alt="Luxury Architectural Interior with Bronze Door Handle"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/20" />
        </div>

        {/* 2. Headline & Editorial Copy */}
        <div className="px-6 sm:px-10 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[var(--border)]" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-primary)] font-semibold">
              Private Consultation · Sakchi
            </span>
          </div>

          <h2
            className="font-cormorant text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)] leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Let&apos;s Plan
            <br />
            <span className="italic text-[var(--color-brass)]">Your Space.</span>
          </h2>

          <p className="text-[14px] text-[var(--text-secondary)] font-normal leading-relaxed max-w-md mb-6">
            Meet our experts at our Sakchi showroom and get the right solution for your project.
          </p>

          {/* 3. Stats Row */}
          <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-y border-[var(--border)] py-6 mb-8 text-center">
            <div className="flex flex-col items-center justify-start px-2">
              <p
                className="font-cormorant text-3xl sm:text-4xl font-normal text-[var(--text-primary)] leading-none mb-2"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                10+
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-secondary)] font-medium leading-tight">
                Years in<br />Sakchi
              </p>
            </div>

            <div className="flex flex-col items-center justify-start px-2">
              <p
                className="font-cormorant text-3xl sm:text-4xl font-normal text-[var(--text-primary)] leading-none tabular-nums mb-2"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                20+
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-secondary)] font-medium leading-tight">
                Authorized<br />Brands
              </p>
            </div>

            <div className="flex flex-col items-center justify-start px-2">
              <p
                className="font-cormorant text-3xl sm:text-4xl font-normal text-[var(--text-primary)] leading-none mb-2"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                HQ
              </p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-secondary)] font-medium leading-tight">
                Flagship<br />Showroom
              </p>
            </div>
          </div>

          {/* 4. Contact Actions */}
          <div className="flex flex-col gap-3 mb-8">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-12 bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20 rounded-none text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors hover:bg-[#25D366]/20"
            >
              Chat on WhatsApp
            </a>
            <div className="flex gap-3">
              <a
                href={SHOWROOM_PHONE_HREF}
                className="flex items-center justify-center flex-1 h-12 border border-[var(--border)] text-[var(--text-primary)] rounded-none text-[11px] uppercase tracking-[0.15em] font-medium transition-colors hover:border-[var(--text-primary)]"
              >
                Call Now
              </a>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-1 h-12 border border-[var(--border)] text-[var(--text-primary)] rounded-none text-[11px] uppercase tracking-[0.15em] font-medium transition-colors hover:border-[var(--text-primary)]"
              >
                Directions
              </a>
            </div>
          </div>
        </div>

        {/* 5. Consultation Form */}
        <div className="px-6 sm:px-10 pb-12 pt-2">
          <div className="w-full max-w-md mx-auto">
            <ConsultationForm inline={true} />
          </div>
        </div>
      </div>

      {/* Showroom Map — clean full-width section beneath consultation section */}
      {showMap && (
        <div className="w-full border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="container mx-auto px-6 lg:px-16 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass)] font-semibold">
                  Flagship Showroom
                </p>
                <h3
                  className="font-cormorant text-2xl sm:text-3xl text-[var(--text-primary)] font-normal"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Visit Us in Sakchi, Jamshedpur
                </h3>
              </div>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider text-[var(--color-wine)] hover:underline font-semibold inline-flex items-center gap-1.5"
              >
                <span>Get Directions</span>
              </a>
            </div>
            <div className="relative w-full rounded-none overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm h-[200px] sm:h-[280px]">
              <iframe
                title="Hardware Collection Sakchi Showroom Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.674844391696!2d86.20150000000001!3d22.8028401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e3035e707e07%3A0x8f8ee13c908afec6!2sHardware%20Collection%20-%20Best%20Dorset%20Lock%20Dealer%20%7C%20Hafele%20Hardware%20%7C%20Modular%20Kitchen%20%7C%20Labacha%20Dealer%20in%20Jamshedpur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
