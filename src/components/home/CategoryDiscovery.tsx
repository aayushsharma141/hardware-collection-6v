"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { resolveFamilies, type FeaturedCategory } from "./families";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 1
    }
  }
};

interface CategoryDiscoveryProps {
  categories?: FeaturedCategory[];
  /** Showroom groups that have products; families for any other group are left out. */
  populatedGroupIds?: string[];
}

export default function CategoryDiscovery({ categories, populatedGroupIds }: CategoryDiscoveryProps) {
  const activeFamilies = resolveFamilies(categories, populatedGroupIds);
  if (activeFamilies.length === 0) return null;

  // The portrait frame was drawn for five narrow columns. Across fewer, wider
  // columns the same ratio would stand over a thousand pixels tall, so the frame
  // widens as the set shrinks.
  const frameRatio =
    activeFamilies.length >= 4
      ? "aspect-[5/7]"
      : activeFamilies.length === 3
        ? "aspect-[4/5]"
        : "aspect-[4/3]";

  return (
    <section id="categories" className="bg-[var(--surface)] text-[var(--text-primary)] py-16 lg:py-24 border-t border-[var(--border)]">
      {/* Desktop Version */}
      <div className="hidden lg:block px-12 xl:px-16">
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-8">
          <div>
            <p className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-brass-ink">
              Showroom families
            </p>
            <h2 className="hc-serif mt-3 text-6xl xl:text-7xl 2xl:text-8xl leading-[0.95] font-light tracking-[-0.01em] text-[var(--text-primary)]">
              Where to begin
            </h2>
          </div>
          <div className="flex flex-col items-end gap-6 max-w-[420px]">
            <p className="text-right text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] font-light">
              A considered route through architectural hardware, security, bath, kitchen systems and the joinery details that finish a room.
            </p>
            <a
              href="/collections"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--accent)] text-white text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[var(--accent-light)] min-w-[200px]"
            >
              Explore All Collections
            </a>
          </div>
        </div>

        <motion.div 
          className="mt-10 grid gap-[1px] bg-[var(--border)] rounded-none overflow-hidden shadow-sm"
          style={{
            // One column per family, the focal one a little wider.
            gridTemplateColumns: activeFamilies.map((f) => (f.isFocal ? "1.28fr" : "1fr")).join(" "),
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {activeFamilies.map((cat) => (
            <motion.article
              variants={itemVariants}
              key={cat.id || cat.name}
              className={`threshold-card group/card bg-[var(--surface-raised)] pb-6 flex flex-col justify-between ${
                cat.isFocal ? "relative z-10" : ""
              }`}
            >
              <div className={`threshold-image relative ${frameRatio} overflow-hidden bg-neutral-900`}>
                {cat.image ? (
                  <Image
                    alt={`${cat.name} showroom family`}
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.03]"
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    src={cat.image}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
                  </div>
                )}
                {/* Scrim under the index: the brass numerals lose contrast on
                    brightly lit photography (card 05's shelving). */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent pointer-events-none"
                />
                <span className="absolute left-4 top-4 hc-mono text-xs tracking-[0.18em] font-semibold text-[var(--accent)]">
                  {cat.index}
                </span>
                {cat.isFocal && (
                  <span className="absolute right-4 top-4 border border-[var(--accent)]/[0.5] px-2.5 py-1 hc-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--accent)] bg-[var(--surface)]/80 backdrop-blur-sm rounded-none">
                    Focal family
                  </span>
                )}
              </div>

              <div
                className={`border-t ${
                  cat.isFocal ? "border-[var(--accent)]" : "border-[var(--border)]"
                } bg-[var(--surface)] px-5 xl:px-6 pt-6 pb-5 flex-1 flex flex-col justify-between`}
              >
                <div>
                  <h3
                    className={`hc-serif leading-[0.95] text-[var(--text-primary)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1 ${
                      cat.isFocal ? "text-[34px] xl:text-[38px]" : "text-[26px] xl:text-[30px]"
                    }`}
                  >
                    {cat.name}
                    {cat.nameBreak && (
                      <>
                        <br />
                        {cat.nameBreak}
                      </>
                    )}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] font-normal">
                    {cat.subtitle}
                  </p>
                  <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--text-secondary)] font-light">
                    {cat.detail}
                  </p>
                </div>

                <a
                  href={cat.href}
                  className="threshold-action mt-6 flex items-center gap-2.5 text-xs uppercase tracking-widest font-semibold text-[var(--text-secondary)] no-underline hover:text-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1"
                >
                  <span>View {cat.name}</span>
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Mobile Version: Vertical Curated List */}
      <div className="block lg:hidden px-6">
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-5">
          <div>
            <p className="hc-mono text-xs uppercase tracking-[0.2em] font-semibold text-brass-ink">
              Showroom families
            </p>
            <h3 className="hc-serif mt-2 text-4xl sm:text-5xl leading-none text-[var(--text-primary)]">
              Where to begin
            </h3>
          </div>
        </div>

        <motion.div 
          className="mt-6 border-t border-[var(--border)] flex flex-col divide-y divide-[var(--border)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {activeFamilies.map((cat, idx) => (
            <motion.a
              variants={itemVariants}
              key={cat.id || cat.name}
              href={cat.href}
              className="mobile-row w-full py-4 flex items-center gap-4 text-left no-underline hover:bg-[var(--surface-raised)] transition-colors duration-150"
            >
              <span className="hc-mono w-6 text-xs font-semibold tracking-[0.12em] text-brass-ink">
                0{idx + 1}
              </span>
              {cat.image ? (
                <Image
                  alt={cat.name}
                  className="h-[56px] w-[80px] object-cover rounded-none border border-[var(--border)] shrink-0"
                  width={80}
                  height={56}
                  src={cat.image}
                />
              ) : (
                <div className="h-[56px] w-[80px] shrink-0 rounded-none border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center">
                  <span className="text-[8px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Wait</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <strong className="block hc-serif text-2xl leading-tight font-normal text-[var(--text-primary)]">
                  {cat.name} {cat.nameBreak || ""}
                </strong>
                <small className="mt-1 block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)] truncate">
                  {cat.subtitle}
                </small>
              </div>
              <svg className="w-5 h-5 text-[var(--accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

