"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { buildWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";

/**
 * AboutStory â€” Chapter 06.5 "Our Legacy"
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

const TOP_BRANDS = "HÃ„FELE Â· BLUM Â· DORSET Â· LABACHA Â· TATTVA";

const PILLARS = [
  {
    id: "trust",
    index: "01",
    title: "10+ Years of Local Trust",
    body: "Over a decade of hardware experience, built in Jamshedpur.",
  },
  {
    id: "brands",
    index: "02",
    title: "Leading Authorized Brands",
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
      className="relative z-10 bg-[var(--surface)] border-t border-[var(--border)] scroll-mt-24 overflow-hidden"
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

      {/* ── Mobile Layout (< lg) ────────────────────────────────────────── */}
      <div className="relative block lg:hidden px-6 py-16">
        <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase mb-3">
          OUR LEGACY
        </p>
        <h2 className="hc-serif text-4xl sm:text-5xl font-light text-[var(--text-primary)] leading-[1.05] mb-6">
          Hardware that
          <br />
          <span className="text-[var(--text-secondary)]">completes the space.</span>
        </h2>

        {/* Stat pair */}
        <div className="grid grid-cols-2 border border-[var(--border)] divide-x divide-white/10 mb-8 rounded-xl overflow-hidden bg-[var(--surface-raised)]">
          <Stat value="10+" label="Years of Trust" />
          <Stat value="100%" label="Authorized Sourcing" />
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--border)] mb-8 rounded-2xl bg-[var(--surface-raised)]">
          <img
            src={SHOWROOM_IMAGE}
            alt={SHOWROOM_IMAGE_ALT}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.08) saturate(0.85) brightness(0.92)" }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-4 text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed">
          <p>
            Hardware Collection is a trusted destination for premium architectural
            hardware, modular kitchen solutions and home hardware in Sakchi,
            Jamshedpur. For more than a decade we have helped homeowners,
            architects, interior designers, builders and contractors find hardware
            that brings together function, durability and design.
          </p>
          <p>
            From door hardware and digital locks to modular kitchen fittings,
            wardrobe systems, furniture hardware, glass fittings, bathroom
            accessories, sinks and architectural fittings &mdash; our showroom brings
            together a carefully selected range for modern residential and
            commercial spaces.
          </p>
        </div>

        <div className="mt-8 border-l-2 border-[#C8A96E] pl-5">
          <h3 className="hc-serif text-2xl text-[var(--text-primary)] leading-snug mb-3">
            Authorized brands. Genuine products. Expert guidance.
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
            What sets us apart is not the number of brands on our shelves &mdash; it is
            the experience of choosing the right solution. Our team helps you
            compare options, understand applications and decide with confidence.
          </p>
        </div>

        {/* Mobile Pillars list */}
        <div className="mt-10 pt-8 border-t border-[var(--border)] space-y-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.id} className="flex gap-4 items-start">
              <span className="hc-mono text-xs font-semibold text-[#c8a96e] shrink-0 pt-0.5">
                {pillar.index}
              </span>
              <div>
                <p className="text-base text-[var(--text-primary)] font-medium mb-1">
                  {pillar.title}
                </p>
                <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop Layout (>= lg) ────────────────────────────────────────── */}
      <div className="relative hidden lg:block max-w-[1320px] mx-auto px-8 lg:px-12 py-24 xl:py-32">
        <div className="grid grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Left — editorial narrative */}
          <div className="col-span-7 pr-4">
            <FadeIn>
              <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase mb-3">
                OUR LEGACY
              </p>
              <h2 className="hc-serif text-6xl xl:text-7xl 2xl:text-8xl font-light text-[var(--text-primary)] leading-[0.95] tracking-[-0.01em] mb-8">
                Hardware that
                <br />
                <span className="text-[var(--text-secondary)]">completes the space.</span>
              </h2>
              <p className="hc-mono text-xs tracking-[0.2em] uppercase font-medium text-[var(--text-secondary)] mb-10">
                10+ Years of Trust
                <span className="text-[var(--accent)] mx-3">·</span>
                Authorized Brands
                <span className="text-[var(--accent)] mx-3">·</span>
                One Destination
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-6 text-lg xl:text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
                <p>
                  Hardware Collection is a trusted destination for premium
                  architectural hardware, modular kitchen solutions and home
                  hardware in Sakchi, Jamshedpur. For more than a decade we
                  have helped homeowners, architects, interior designers, builders
                  and contractors find hardware that brings together function,
                  durability and design.
                </p>
                <p>
                  From door hardware and digital locks to modular kitchen fittings,
                  wardrobe systems, furniture hardware, glass fittings, bathroom
                  accessories, sinks and architectural fittings &mdash; our showroom
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
              <div className="mt-12 border-l-2 border-[#C8A96E] pl-6 max-w-2xl">
                <h3 className="hc-serif text-3xl xl:text-4xl text-[var(--text-primary)] leading-tight mb-3">
                  Authorized brands. Genuine products. Expert guidance.
                </h3>
                <p className="text-base xl:text-lg text-[var(--text-secondary)] font-light leading-relaxed">
                  What sets Hardware Collection apart is not simply the number of
                  brands on our shelves &mdash; it is the experience of choosing the
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-md">
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
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Standing stat — the one number that carries the section */}
                <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-[var(--border)] px-7 py-5 rounded-2xl shadow-lg">
                  <p className="hc-serif text-5xl text-[var(--accent)] leading-none mb-1.5 font-normal">
                    10+
                  </p>
                  <p className="hc-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">
                    Years of Experience
                  </p>
                </div>
              </div>

              <div className="mt-6 border border-[var(--border)] divide-y divide-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface-raised)]">
                <div className="px-7 py-5 flex items-baseline gap-4">
                  <span className="hc-serif text-4xl text-[var(--accent)] leading-none tabular-nums font-normal">
                    100%
                  </span>
                  <span className="hc-mono text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">
                    Authorized Sourcing
                  </span>
                </div>
                <div className="px-7 py-5">
                  <p className="hc-mono text-[10px] tracking-[0.25em] text-[#c8a96e] uppercase font-semibold mb-2.5">
                    Top Brand Partners
                  </p>
                  <p className="hc-mono text-xs tracking-[0.16em] text-[var(--text-secondary)] uppercase leading-relaxed font-medium">
                    {TOP_BRANDS}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── Why Hardware Collection ────────────────────────────────────────── */}
        <FadeIn delay={0.1}>
          <div className="mt-24 xl:mt-32 border-t border-[var(--border)] pt-14">
            <div className="grid grid-cols-4 gap-10">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border-l border-[var(--border)] pl-6 first:border-l-0 first:pl-0"
                >
                  <p className="hc-mono text-xs font-semibold text-[#c8a96e] tracking-[0.2em] mb-3">
                    {pillar.index}
                  </p>
                  <p className="text-lg xl:text-xl text-[var(--text-primary)] font-medium leading-snug mb-2">
                    {pillar.title}
                  </p>
                  <p className="text-sm xl:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Unified Visit Us Frame ────────────────────────────────────────── */}
      <div className="relative border-t border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute inset-0 bg-[var(--surface-raised)]">
          <img
            src="/cinema/showroom/exterior-2.png"
            alt="Showroom Location Entrance"
            className="w-full h-full object-cover opacity-20 filter contrast-110 brightness-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
          <div className="max-w-3xl">
            <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase mb-4">
              VISIT SAKCHI SHOWROOM
            </p>
            <p className="hc-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-light leading-tight">
              Visit Hardware Collection, Sakchi &mdash; and discover the details that
              make a space feel complete.
            </p>
            <p className="mt-5 text-base lg:text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
              Authorized partner for leading architectural hardware, security and kitchen brands. Open Monday to Sunday, 10:00 AM – 8:00 PM.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 shrink-0">
            <MagneticButton>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold text-xs lg:text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-200 w-full sm:w-auto rounded shadow-sm"
              >
                GET DIRECTIONS &rarr;
              </a>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs lg:text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200 w-full sm:w-auto rounded"
              >
                EXPLORE COLLECTIONS &rarr;
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={buildWhatsAppUrl(WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#C8A96E]/50 text-[#c8a96e] font-semibold text-xs lg:text-sm tracking-widest uppercase hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors duration-200 w-full sm:w-auto rounded"
              >
                TALK TO AN EXPERT &rarr;
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
      <p className="hc-serif text-3xl text-[var(--accent)] leading-none mb-1.5">
        {value}
      </p>
      <p className="hc-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
        {label}
      </p>
    </div>
  );
}


