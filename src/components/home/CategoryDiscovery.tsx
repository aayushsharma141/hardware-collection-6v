"use client";

import React from "react";
import Link from "next/link";
import { LazyImage as Image } from "@/components/ui/lazy-image";
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
        <div className="flex items-end justify-between gap-12 border-b border-[var(--border)] pb-8">
          <div className="max-w-2xl">
            <h2 className="hc-serif text-6xl xl:text-7xl leading-[0.95] font-light tracking-[-0.01em] text-[var(--text-primary)] text-balance">
              Where to begin
            </h2>
            <p className="mt-5 max-w-xl text-base lg:text-lg leading-relaxed text-[var(--text-secondary)] font-light text-pretty">
              A considered route through architectural hardware, security, bath, kitchen systems and the joinery details that finish a room.
            </p>
          </div>
          <Link
            href="/collections"
            className="group/btn shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--accent)] text-white text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[var(--accent-light)] shadow-[0_4px_16px_rgba(139,26,66,0.22)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.32)] active:scale-[0.98]"
          >
            <span>Explore All Collections</span>
            <svg className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <motion.div 
          className="mt-10 grid gap-6"
          style={{
            // One column per family, the focal one a little wider.
            gridTemplateColumns: activeFamilies.map((f) => (f.isFocal ? "1.24fr" : "1fr")).join(" "),
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
              className={`threshold-card group/card bg-white rounded-2xl border ${
                cat.isFocal
                  ? "border-[var(--accent)]/50 shadow-[0_12px_36px_rgba(139,26,66,0.08),0_2px_8px_rgba(0,0,0,0.03)]"
                  : "border-[var(--border)] shadow-[0_6px_24px_rgba(26,16,23,0.03)]"
              } hover:shadow-[0_16px_40px_rgba(26,16,23,0.08)] hover:border-[var(--color-wine)]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                cat.isFocal ? "relative z-10" : ""
              }`}
            >
              <div className={`threshold-image relative ${frameRatio} overflow-hidden bg-neutral-900`}>
                {cat.image ? (
                  <Image
                    alt={`${cat.name} showroom family`}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.04]"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    src={cat.image}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
                  </div>
                )}
              </div>

              <div className="bg-white px-6 pt-6 pb-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className={`hc-serif leading-[0.95] text-[var(--text-primary)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-1 ${
                      cat.isFocal ? "text-[32px] xl:text-[36px]" : "text-[26px] xl:text-[29px]"
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
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] font-normal text-pretty">
                    {cat.subtitle}
                  </p>
                  <p className="mt-3 border-t border-[var(--border)]/70 pt-3 text-xs leading-relaxed text-[var(--text-secondary)] font-light text-pretty">
                    {cat.detail}
                  </p>
                </div>

                <Link
                  href={cat.href}
                  className="threshold-action mt-6 flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-[var(--text-secondary)] no-underline group-hover/card:text-[var(--accent)] transition-colors duration-200"
                >
                  <span>View {cat.name}</span>
                  <span className="w-8 h-8 rounded-full bg-white border border-[var(--border)] group-hover/card:border-[var(--accent)] group-hover/card:bg-[var(--accent)] group-hover/card:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Mobile Version: Vertical Curated List */}
      <div className="block lg:hidden px-6">
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-5">
          <div>
            <h3 className="hc-serif text-4xl sm:text-5xl leading-none text-[var(--text-primary)] text-balance">
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
          {activeFamilies.map((cat) => (
            <motion.div
              variants={itemVariants}
              key={cat.id || cat.name}
            >
              <Link
                href={cat.href}
                className="mobile-row w-full py-4 flex items-center gap-4 text-left no-underline hover:bg-[var(--surface-raised)] transition-colors duration-150"
              >
                {cat.image ? (
                  <Image
                    alt={cat.name}
                    className="h-[56px] w-[80px] object-cover rounded-lg border border-[var(--border)] shrink-0"
                    width={80}
                    height={56}
                    src={cat.image}
                  />
                ) : (
                  <div className="h-[56px] w-[80px] shrink-0 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center">
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
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

