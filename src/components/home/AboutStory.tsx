"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { generateWhatsAppUrl, SHOWROOM_MAP_URL, SHOWROOM_HOURS_FALLBACK, SHOWROOM_YEARS_OF_TRUST, SHOWROOM_BRAND_COUNT } from "@/lib/config";

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

export default function AboutStory({
  id = "about",
  showroomHours,
  legacyYearsOfTrust,
  legacyBrandsCount,
}: {
  id?: string;
  showroomHours?: string;
  legacyYearsOfTrust?: number;
  legacyBrandsCount?: number;
  legacyShowroomImageUrl?: string;
}) {
  const displayPillars = PILLARS.map((p) => ({ _key: p.id, title: p.title, description: p.body }));
  const displayYears = legacyYearsOfTrust ? `${legacyYearsOfTrust}+` : `${SHOWROOM_YEARS_OF_TRUST}+`;
  const displayBrandsCount = legacyBrandsCount ? `${legacyBrandsCount}+` : `${SHOWROOM_BRAND_COUNT}+`;

  return (
    <section
      id={id}
      data-chapter="6.5"
      className="relative z-10 overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] scroll-mt-24"
    >
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-8 lg:px-16 lg:pt-20 lg:pb-12">
        <FadeIn>
          <div className="mb-10 flex items-center gap-3">
            <span className="h-[1px] w-6 bg-[var(--color-wine)]/30" />
            <span className="hc-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-wine)] sm:text-xs">
              Our Legacy
            </span>
          </div>
        </FadeIn>

        <div className="mb-12 grid grid-cols-1 items-start gap-16 lg:mb-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <h2 className="hc-serif text-5xl font-light leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
                Hardware that
                <br />
                completes
                <br />
                the space.
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>
              <p className="mb-8 text-xl font-light leading-[1.6] text-[var(--text-primary)] sm:text-2xl lg:text-3xl">
                Hardware Collection is a trusted destination for premium architectural hardware, modular kitchen solutions
                and home hardware in Sakchi, Jamshedpur.
              </p>
              <p className="mb-12 text-base font-light leading-[1.7] text-[var(--text-secondary)] sm:text-lg lg:text-xl">
                From door hardware and digital locks to modular kitchen fittings, wardrobe systems, furniture hardware,
                and bathroom accessories — our showroom brings together a carefully selected range for modern residential
                and commercial spaces. With a wide choice of materials, finishes, sizes and applications, we help you
                find hardware that complements the character of a space rather than simply filling a functional
                requirement.
              </p>

              <div className="flex gap-16 border-t border-[var(--border)] pt-8">
                <div>
                  <p className="hc-serif mb-3 text-5xl font-light leading-none text-[var(--text-primary)]">
                    {displayYears}
                  </p>
                  <p className="hc-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    Years of Experience
                  </p>
                </div>
                <div>
                  <p className="hc-serif mb-3 text-5xl font-light leading-none text-[var(--text-primary)]">
                    {displayBrandsCount}
                  </p>
                  <p className="hc-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    Authorized Brands
                  </p>
                  <p className="hc-mono mt-4 hidden max-w-[200px] text-[10px] uppercase leading-relaxed tracking-widest text-[var(--text-secondary)] lg:block">
                    {TOP_BRANDS}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Pillars in a single horizontal line */}
        <div className="hide-scrollbar -mx-6 flex snap-x snap-mandatory flex-nowrap gap-6 overflow-x-auto px-6 pb-8 lg:mx-0 lg:gap-8 lg:px-0">
          {displayPillars.map((pillar, idx) => (
            <FadeIn
              key={pillar._key}
              delay={0.3 + idx * 0.1}
              className="min-w-[280px] shrink-0 snap-start sm:min-w-[320px] md:min-w-0 md:flex-1"
            >
              <div className="group h-full border-t border-[var(--border)] pt-6 transition-colors duration-300 hover:border-[var(--text-primary)]">
                <p className="hc-mono mb-4 text-[10px] font-semibold tracking-[0.2em] text-[var(--color-wine)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  0{idx + 1}
                </p>
                <h3 className="mb-3 text-lg font-light text-[var(--text-primary)] lg:text-xl">{pillar.title}</h3>
                <p className="text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                  {pillar.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Unified Visit Us Frame ────────────────────────────────────────── */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center px-6 pt-12 pb-12 text-center lg:px-12 lg:pt-16 lg:pb-16">
          <FadeIn>
            <p className="hc-mono mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-wine)] sm:text-xs">
              Visit Sakchi Showroom
            </p>
            <h3 className="hc-serif mb-8 text-4xl font-light leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Discover the details that make a space feel complete.
            </h3>
            <p className="mx-auto mb-16 max-w-lg text-sm font-light leading-relaxed text-[var(--text-secondary)] lg:text-base">
              Authorized partner for leading architectural hardware, security and kitchen brands.
              <br />
              <br />
              <span className="text-[var(--text-primary)]">{showroomHours || SHOWROOM_HOURS_FALLBACK}</span>
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
              <MagneticButton>
                <Link
                  href="/collections"
                  className="inline-flex h-12 w-full items-center justify-center rounded-none bg-[var(--text-primary)] px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--surface)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--color-wine)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 active:scale-[0.97] sm:w-auto"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </MagneticButton>
              <MagneticButton className="hidden w-full sm:block sm:w-auto">
                <a
                  href={SHOWROOM_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center rounded-none border border-[var(--border)] px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 active:scale-[0.97] sm:w-auto"
                >
                  GET DIRECTIONS
                </a>
              </MagneticButton>
              <MagneticButton className="group relative hidden w-full sm:block sm:w-auto">
                <a
                  href={generateWhatsAppUrl("general-enquiry")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center rounded-none border border-transparent px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 active:scale-[0.97] sm:w-auto"
                >
                  <span className="relative">
                    TALK TO AN EXPERT
                    <span className="absolute -bottom-1 left-0 right-0 origin-left scale-x-0 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 h-[1px]"></span>
                  </span>
                </a>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
