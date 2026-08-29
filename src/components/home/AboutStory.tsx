"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { buildWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";
import { AUTHORIZED_BRAND_COUNT } from "@/components/BrandTrustStrip";

/**
 * AboutStory — Chapter 06.5 "Our Legacy"
 * Visual tension: LOW / EDITORIAL BREATH
 *
 * Sits inside the showroom chapter, between "Live Demonstrations" (scene 02)
 * and "Visit Us" (scene 03). Both neighbours are full-bleed 100dvh photo
 * scenes, so this one deliberately does the opposite: solid near-black ground,
 * typographic hierarchy, no pinning, no parallax. It is where the scroll slows
 * down long enough to say who the business is before asking anyone to visit.
 *
 * The years figure follows the brand direction given by the owner. The brand
 * count is no longer written here: it is derived from the roster in
 * BrandTrustStrip, which is what resolves this section saying "20+ Authorised
 * Brands" while the conversion chapter said "23 Authorized Brands".
 */

const SHOWROOM_IMAGE =
  "/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg";

const SHOWROOM_IMAGE_ALT =
  "Cabinet handles and pulls in brass, matte black and ivory finishes displayed on the Hardware Collection showroom wall";

const TOP_BRANDS = "HÄFELE · BLUM · DORSET · LABACHA · TATTVA";

const PILLARS = [
  {
    id: "trust",
    index: "01",
    title: "20+ Years of Local Trust",
    body: "Two decades of hardware experience, built in Jamshedpur.",
  },
  {
    id: "brands",
    index: "02",
    title: `${AUTHORIZED_BRAND_COUNT} Authorized Brands`,
    body: "Genuine products, sourced through official partnerships.",
  },
  {
    id: "selection",
    index: "03",
    title: "Expert Selection",
    body: "Guidance for homeowners, architects, designers and contractors.",
  },
  {
    id: "showroom",
    index: "04",
    title: "Premium Showroom",
    body: "See, compare and handle every finish before you decide.",
  },
];

const WA_MESSAGE =
  "Hi Hardware Collection, I would like to speak to an expert about hardware for my project.";

/**
 * `id` is a prop because the home page renders two mutually exclusive trees
 * (mobile / desktop) and both carry this section — two elements with the same
 * anchor id would be invalid markup.
 */
export default function AboutStory({ id = "about" }: { id?: string }) {
  return (
    <section
      id={id}
      data-chapter="6.5"
      className="relative z-10 bg-[#0A0A0C] border-t border-zinc-900 scroll-mt-24 overflow-hidden"
    >
      {/* Ambient brass wash — keeps the section tied to the chapter it sits in */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 85% 0%, rgba(200,169,110,0.10) 0%, transparent 55%)",
        }}
      />

      {/* ── Mobile Layout (< lg) ─────────────────────────────────── */}
      <div className="relative block lg:hidden px-6 py-16">
        <p className="hc-mono text-[#C8A96E] font-medium tracking-[0.22em] text-[10px] uppercase mb-3">
          OUR LEGACY
        </p>
        <h2 className="hc-serif text-[30px] sm:text-4xl font-normal text-[#e8e3d9] leading-[1.05] mb-5">
          Hardware that
          <br />
          <span className="text-zinc-500">completes the space.</span>
        </h2>

        {/* Stat pair */}
        <div className="grid grid-cols-2 border border-white/10 divide-x divide-white/10 mb-7">
          <Stat value="20+" label="Years of Trust" />
          <Stat value={String(AUTHORIZED_BRAND_COUNT)} label="Authorized Brands" />
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 mb-7 bg-[#0A0A0C]">
          <img
            src={SHOWROOM_IMAGE}
            alt={SHOWROOM_IMAGE_ALT}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.08) saturate(0.85) brightness(0.92)" }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-4 text-sm text-zinc-300 font-light leading-relaxed">
          <p>
            Hardware Collection is a trusted destination for premium architectural
            hardware, modular kitchen solutions and home hardware in Sakchi,
            Jamshedpur. For more than two decades we have helped homeowners,
            architects, interior designers, builders and contractors find hardware
            that brings together function, durability and design.
          </p>
          <p>
            From door hardware and digital locks to modular kitchen fittings,
            wardrobe systems, furniture hardware, glass fittings, bathroom
            accessories, sinks and architectural fittings — our showroom brings
            together a carefully selected range for modern residential and
            commercial spaces.
          </p>
        </div>

        <div className="mt-7 border-l border-[#C8A96E]/40 pl-4">
          <h3 className="hc-serif text-xl text-[#e8e3d9] leading-snug mb-2">
            Authorized brands. Genuine products. Expert guidance.
          </h3>
          <p className="text-[13px] text-zinc-400 font-light leading-relaxed">
            What sets us apart is not the number of brands on our shelves — it is
            the experience of choosing the right solution. Our team helps you
            compare options, understand applications and decide with confidence.
          </p>
        </div>

        {/* Brand partners */}
        <div className="mt-7 border border-white/10 px-4 py-4">
          <p className="hc-mono text-[9px] tracking-[0.25em] text-zinc-600 uppercase mb-2">
            Top Brand Partners
          </p>
          <p className="hc-mono text-[11px] tracking-[0.16em] text-zinc-400 uppercase leading-relaxed">
            {TOP_BRANDS}
          </p>
        </div>

        {/* Why Hardware Collection */}
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.id}>
              <p className="hc-mono text-[10px] text-zinc-700 tracking-widest mb-1.5">
                {pillar.index}
              </p>
              <p className="text-[13px] text-[#e8e3d9] font-medium leading-snug mb-1">
                {pillar.title}
              </p>
              <p className="text-[11.5px] text-zinc-500 font-light leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>


      </div>

      {/* ── Desktop Layout (≥ lg) ────────────────────────────────── */}
      <div className="relative hidden lg:block container mx-auto px-6 lg:px-16 py-28 xl:py-36">
        <div className="grid grid-cols-12 gap-16 xl:gap-20 items-start">
          {/* Left — editorial copy */}
          <div className="col-span-7">
            <FadeIn>
              <p className="hc-mono text-[#C8A96E] font-medium tracking-[0.22em] text-[10px] uppercase mb-5">
                OUR LEGACY
              </p>
              {/* Sized so "completes the space." holds one line at every
                  desktop width — it breaks to three lines at 60px on a 1024
                  column. */}
              <h2 className="hc-serif text-5xl xl:text-6xl 2xl:text-7xl font-normal text-[#e8e3d9] leading-[1.0] tracking-[0.015em] mb-7">
                Hardware that
                <br />
                <span className="text-zinc-500">completes the space.</span>
              </h2>
              <p className="hc-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-9">
                20+ Years of Trust
                <span className="text-[#C8A96E] mx-2.5">·</span>
                {AUTHORIZED_BRAND_COUNT} Authorized Brands
                <span className="text-[#C8A96E] mx-2.5">·</span>
                One Destination
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-5 text-base text-[#d1ccc4] font-light leading-relaxed max-w-xl">
                <p>
                  Hardware Collection is a trusted destination for premium
                  architectural hardware, modular kitchen solutions and home
                  hardware in Sakchi, Jamshedpur. For more than two decades we
                  have helped homeowners, architects, interior designers, builders
                  and contractors find hardware that brings together function,
                  durability and design.
                </p>
                <p>
                  From door hardware and digital locks to modular kitchen fittings,
                  wardrobe systems, furniture hardware, glass fittings, bathroom
                  accessories, sinks and architectural fittings — our showroom
                  brings together a carefully selected range for modern residential
                  and commercial spaces.
                </p>
                <p>
                  Our portfolio spans timeless, refined designs through to
                  contemporary, minimal and statement-making finishes. With a wide
                  choice of materials, finishes, sizes and applications, we help
                  you find hardware that complements the character of a space
                  rather than simply filling a functional requirement.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mt-10 border-l border-[#C8A96E]/40 pl-6 max-w-xl">
                <h3 className="hc-serif text-3xl text-[#e8e3d9] leading-tight mb-3">
                  Authorized brands. Genuine products. Expert guidance.
                </h3>
                <p className="text-[15px] text-zinc-400 font-light leading-relaxed">
                  What sets Hardware Collection apart is not simply the number of
                  brands on our shelves — it is the experience of choosing the
                  right solution. Whether you are building a new home, renovating a
                  kitchen, specifying hardware for a project or upgrading security,
                  our team helps you compare options, understand applications and
                  decide with confidence.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right — showroom photography + standing proof */}
          <div className="col-span-5">
            <FadeIn delay={0.08} direction="left">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#0A0A0C]">
                <img
                  src={SHOWROOM_IMAGE}
                  alt={SHOWROOM_IMAGE_ALT}
                  className="w-full h-full object-cover"
                  style={{
                    filter: "contrast(1.12) saturate(0.8) brightness(0.9)",
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Standing stat — the one number that carries the section */}
                <div className="absolute bottom-6 left-6 bg-black/55 backdrop-blur-md border border-white/10 px-6 py-4">
                  <p className="hc-serif text-4xl text-[#C8A96E] leading-none mb-1.5">
                    20+
                  </p>
                  <p className="hc-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                    Years of Experience
                  </p>
                </div>
              </div>

              <div className="mt-5 border border-white/10 divide-y divide-white/10">
                <div className="px-6 py-5 flex items-baseline gap-4">
                  <span className="hc-serif text-3xl text-[#C8A96E] leading-none tabular-nums">
                    {AUTHORIZED_BRAND_COUNT}
                  </span>
                  <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    Authorized Brands
                  </span>
                </div>
                <div className="px-6 py-5">
                  <p className="hc-mono text-[9px] tracking-[0.25em] text-zinc-600 uppercase mb-2.5">
                    Top Brand Partners
                  </p>
                  <p className="hc-mono text-[11px] tracking-[0.16em] text-zinc-400 uppercase leading-relaxed">
                    {TOP_BRANDS}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Why Hardware Collection ─────────────────────────────── */}
        <FadeIn delay={0.1}>
          <div className="mt-24 xl:mt-28 border-t border-zinc-900 pt-12">
            <div className="grid grid-cols-4 gap-10">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border-l border-zinc-900 pl-6 first:border-l-0 first:pl-0"
                >
                  <p className="hc-mono text-[10px] text-zinc-700 tracking-[0.2em] mb-3">
                    {pillar.index}
                  </p>
                  <p className="text-[15px] text-[#e8e3d9] font-medium leading-snug mb-2">
                    {pillar.title}
                  </p>
                  <p className="text-[13px] text-zinc-500 font-light leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>


      </div>

      {/* ── Unified Visit Us Frame ──────────────────────────────── */}
      <div className="relative border-t border-zinc-900 bg-zinc-950 overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute inset-0 bg-[#0A0A0C]">
          <img
            src="/cinema/showroom/exterior-2.png"
            alt="Showroom Location Entrance"
            className="w-full h-full object-cover opacity-20 filter contrast-110 brightness-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-16 py-16 lg:py-24 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <p className="hc-mono text-[#c8a96e] font-medium tracking-[0.22em] text-[10px] uppercase mb-4">
              VISIT SAKCHI SHOWROOM
            </p>
            <p className="hc-serif text-[28px] lg:text-[34px] text-[#e8e3d9] font-light leading-snug">
              Visit Hardware Collection, Sakchi — and discover the details that
              make a space feel complete.
            </p>
            <p className="mt-5 text-[14px] text-zinc-400 font-light leading-relaxed max-w-xl">
              Authorized partner for {AUTHORIZED_BRAND_COUNT} architectural hardware, security and kitchen brands. Open Monday to Sunday, 10:00 AM – 8:00 PM.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 shrink-0">
            <MagneticButton>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3.5 lg:py-4 bg-white text-black font-medium text-xs lg:text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-200 w-full sm:w-auto"
              >
                GET DIRECTIONS →
              </a>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3.5 lg:py-4 border border-zinc-600 text-white font-medium text-xs lg:text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200 w-full sm:w-auto"
              >
                EXPLORE COLLECTIONS →
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={buildWhatsAppUrl(WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3.5 lg:py-4 border border-[#C8A96E]/40 text-[#C8A96E] font-medium text-xs lg:text-sm tracking-widest uppercase hover:bg-[#C8A96E] hover:text-black transition-colors duration-200 w-full sm:w-auto"
              >
                TALK TO AN EXPERT →
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-4">
      <p className="hc-serif text-3xl text-[#C8A96E] leading-none mb-1.5">
        {value}
      </p>
      <p className="hc-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}
