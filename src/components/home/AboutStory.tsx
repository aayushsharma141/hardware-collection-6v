"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { generateWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";

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
 * Years and brand count follow the owner's stated positioning: 10+ years and
 * 20+ authorized brands. "20+" is deliberately a floor rather than an exact
 * figure — CANONICAL_BRANDS currently holds 22, so the claim stays true as the
 * roster moves. AUTHORIZED_BRAND_COUNT in BrandTrustStrip is the exact number
 * where one is needed. Spelling is "Authorized" throughout, matching the rest
 * of the site rather than the British form used in the brief.
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
    title: "10+ Years of Local Trust",
    body: "Over a decade of hardware experience, built in Jamshedpur.",
  },
  {
    id: "brands",
    index: "02",
    title: "20+ Authorized Brands",
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
      <div className="relative block lg:hidden px-6 pt-[96px] pb-[72px]">
        <p className="hc-mono t-eyebrow text-brass-ink mb-4">
          OUR LEGACY
        </p>
        <h2 className="hc-serif t-h2 font-light text-[var(--text-primary)] mb-7">
          Hardware that
          <br />
          <span className="text-[var(--text-secondary)]">completes the space.</span>
        </h2>

        {/* Stat pair */}
        <div className="grid grid-cols-2 border border-[var(--border)] divide-x divide-white/10 mb-8 rounded-xl overflow-hidden bg-[var(--surface-raised)]">
          <Stat value="10+" label="Years of Trust" />
          <Stat value="20+" label="Authorized Brands" />
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--border)] mb-8 rounded-2xl bg-[var(--surface-raised)]">
          <img
            src={SHOWROOM_IMAGE}
            alt={SHOWROOM_IMAGE_ALT}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.05) saturate(1.03)" }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Two ~50-word paragraphs stood here, listing the audience and then
            the catalogue almost item by item. The stat pair above already
            states the years, the pillars below already name the audience, and
            the categories are their own chapter — so this keeps the claim and
            drops the inventory. */}
        <div className="space-y-4 t-body text-[var(--text-secondary)] font-light">
          <p>
            Architectural hardware, digital locks and modular kitchen and
            wardrobe systems — chosen in Sakchi for homeowners, architects
            and contractors alike.
          </p>
          <p>
            Door and glass fittings, bathroom accessories, sinks and joinery
            hardware, selected as one range for modern residential and
            commercial spaces.
          </p>
        </div>

        <div className="mt-10 border-l-2 border-[#C8A96E] pl-5">
          <h3 className="hc-serif t-h3 text-[var(--text-primary)] mb-3">
            Authorized brands. Genuine products. Expert guidance.
          </h3>
          <p className="t-body-sm text-[var(--text-secondary)] font-light">
            What sets us apart is not the number of brands on our shelves
            — it is help choosing the right one.
          </p>
        </div>

        {/* Mobile Pillars list */}
        {/* Typography-first, no icons: the number is set as part of the
            composition and a hairline separates each pillar, so the list reads
            as an editorial index rather than a feature grid. */}
        <div className="mt-12 border-t border-[var(--border)]">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="flex gap-5 items-baseline border-b border-[var(--border)] py-6"
            >
              <span className="hc-mono t-meta font-semibold text-brass-ink shrink-0">
                {pillar.index}
              </span>
              <div className="min-w-0">
                <h3 className="hc-serif t-h4 text-[var(--text-primary)] mb-1.5">
                  {pillar.title}
                </h3>
                <p className="t-body-sm text-[var(--text-secondary)] font-light">
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
              <p className="hc-mono text-brass-ink font-semibold tracking-[0.25em] text-xs uppercase mb-3">
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
                20+ Authorized Brands
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
              <div className="mt-16 xl:mt-24 relative pl-8 max-w-2xl">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E] origin-top"
                />
                <h3 className="hc-serif text-3xl xl:text-4xl text-[var(--text-primary)] leading-tight mb-4">
                  Authorized brands. Genuine products. Expert guidance.
                </h3>
                <p className="text-base xl:text-lg text-[var(--text-secondary)] font-light leading-relaxed">
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-md">
                <img
                  src={SHOWROOM_IMAGE}
                  alt={SHOWROOM_IMAGE_ALT}
                  className="w-full h-full object-cover"
                  style={{
                    filter: "contrast(1.06) saturate(1.03)",
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Standing stat — the one number that carries the section */}
                <div className="absolute bottom-6 left-6 bg-[#fbf5ea]/95 backdrop-blur-md border border-[var(--border)] px-7 py-5 rounded-2xl shadow-lg">
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
                    20+
                  </span>
                  <span className="hc-mono text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">
                    Authorized Brands
                  </span>
                </div>
                <div className="px-7 py-5">
                  <p className="hc-mono text-[11px] tracking-[0.25em] text-brass-ink uppercase font-semibold mb-2.5">
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
          <div className="mt-32 xl:mt-40 relative pt-16">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--border)] origin-left"
            />
            <div className="grid grid-cols-4 gap-12">
              {PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.id}
                  className="relative pl-8 pt-4"
                >
                  {idx !== 0 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                      className="absolute left-0 top-0 bottom-0 w-[1px] bg-[var(--border)] origin-top hidden lg:block"
                    />
                  )}
                  <p className="hc-mono text-xs font-semibold text-brass-ink tracking-[0.2em] mb-4">
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
            src="/cinema/showroom/exterior-2.webp"
            alt="Showroom Location Entrance"
            className="w-full h-full object-cover opacity-[0.08] filter sepia-[0.45] contrast-110 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-raised)] via-transparent to-[var(--surface-raised)] opacity-90" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col xl:flex-row xl:items-start justify-between gap-12">
          <div className="max-w-2xl">
            <p className="hc-mono text-brass-ink font-bold tracking-[0.25em] text-[11px] sm:text-xs uppercase mb-4">
              VISIT SAKCHI SHOWROOM
            </p>
            <p className="hc-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-light leading-tight">
              Visit Hardware Collection, Sakchi — and discover the details that
              make a space feel complete.
            </p>
            <p className="mt-6 text-sm lg:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-lg">
              Authorized partner for leading architectural hardware, security and kitchen brands. Open Monday to Sunday, 10:00 AM – 8:00 PM.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0 w-full xl:w-auto xl:min-w-[320px]">
            <MagneticButton>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--text-primary)] text-[var(--surface-raised)] font-medium text-xs tracking-[0.2em] uppercase hover:bg-[var(--text-secondary)] transition-colors duration-200 w-full rounded"
              >
                GET DIRECTIONS
              </a>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs lg:text-sm tracking-widest uppercase hover:bg-[var(--text-primary)] hover:text-[var(--surface-raised)] transition-colors duration-200 w-full rounded"
              >
                EXPLORE COLLECTIONS &rarr;
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={generateWhatsAppUrl("general-enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#C8A96E]/60 text-brass-ink font-semibold text-[13px] lg:text-sm tracking-widest uppercase hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] transition-colors duration-200 w-full sm:w-auto rounded"
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


