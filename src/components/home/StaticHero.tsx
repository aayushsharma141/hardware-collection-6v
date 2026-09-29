import React from "react";
import Image from "next/image";
import Link from "next/link";
import { generateWhatsAppUrl } from "@/lib/config";

interface HeroCta {
  label?: string | null;
  /** GROQ alias for the CTA's `destination`; empty means "open WhatsApp". */
  url?: string | null;
}

interface StaticHeroProps {
  eyebrow?: string | null;
  headline?: string | null;
  description?: string | null;
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta | null;
  imageDesktopUrl?: string | null;
  imageMobileUrl?: string | null;
}

// Used only while a field is missing from the CMS document (or Sanity is
// unreachable), so the first viewport is never blank.
const FALLBACK = {
  eyebrow: "ARCHITECTURAL HARDWARE EXPERTS · 10+ YEARS",
  headline: "The Art of\nthe Finish.",
  description:
    "Premium architectural hardware and modular solutions, curated for contemporary spaces, at our Sakchi showroom in Jamshedpur.",
  image: "/cinema/hero/HC-01-HERO-01.png",
  primary: { label: "Explore Collections", url: "/collections" },
} as const;

function ctaHref(cta: HeroCta | null | undefined, fallback: string): string {
  return cta?.url?.trim() || fallback;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * CH01 — the first viewport, driven entirely by the `homePage` document.
 * A single full-bleed photograph (separate mobile crop when supplied) under a
 * scrim, with the headline and up to two calls to action.
 */
export default function StaticHero({
  eyebrow,
  headline,
  description,
  primaryCta,
  secondaryCta,
  imageDesktopUrl,
  imageMobileUrl,
}: StaticHeroProps) {
  const desktop = imageDesktopUrl || imageMobileUrl || FALLBACK.image;
  const mobile = imageMobileUrl || desktop;

  const primaryLabel = primaryCta?.label?.trim() || FALLBACK.primary.label;
  const primaryHref = ctaHref(primaryCta, primaryCta?.label ? generateWhatsAppUrl("general-enquiry") : FALLBACK.primary.url);
  const secondaryLabel = secondaryCta?.label?.trim();
  const secondaryHref = ctaHref(secondaryCta, generateWhatsAppUrl("showroom-visit"));

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate flex min-h-[100dvh] items-end overflow-hidden bg-[#1a1017] text-white lg:items-center"
    >
      <Image
        src={mobile}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center lg:hidden"
      />
      <Image
        src={desktop}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 hidden object-cover object-center lg:block"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1a1017]/90 via-[#1a1017]/45 to-[#1a1017]/20 lg:bg-gradient-to-r lg:from-[#1a1017]/85 lg:via-[#1a1017]/45 lg:to-transparent"
      />

      <div className="mx-auto w-full max-w-[1360px] px-6 pb-16 pt-32 lg:px-12 lg:pb-0">
        <div className="max-w-2xl">
          <p className="hc-mono mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#c8a96e]">
            {eyebrow || FALLBACK.eyebrow}
          </p>
          <h1
            id="home-hero-heading"
            className="hc-serif whitespace-pre-line text-5xl font-light leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl"
          >
            {headline || FALLBACK.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg">
            {description || FALLBACK.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink
              href={primaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8b1a42] px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#a3204e] hc-focus"
            >
              {primaryLabel}
            </CtaLink>
            {secondaryLabel && (
              <CtaLink
                href={secondaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10 hc-focus"
              >
                {secondaryLabel}
              </CtaLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
