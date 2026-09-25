"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CATEGORY_FAMILIES } from "@/content/fallback/home";

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

export default function CategoryDiscovery() {
  return (
    <section id="categories" className="bg-[var(--surface)] text-[var(--text-primary)] py-16 lg:py-24 border-t border-[var(--border)]">
      {/* Desktop Version */}
      <div className="hidden lg:block px-12 xl:px-16">
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-8">
          <div>
            <p className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-brass-ink">
              Showroom families / 05
            </p>
            <h2 className="hc-serif mt-3 text-6xl xl:text-7xl 2xl:text-8xl leading-[0.95] font-light tracking-[-0.01em] text-[var(--text-primary)]">
              Five thresholds
            </h2>
          </div>
          <p className="max-w-[420px] text-right text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] font-light">
            A considered route through architectural hardware, security, bath, kitchen systems and the joinery details that finish a room.
          </p>
        </div>

        <motion.div 
          className="mt-10 grid grid-cols-[0.92fr_1.28fr_0.88fr_1.08fr_0.92fr] gap-[1px] bg-[var(--border)] rounded-2xl overflow-hidden shadow-sm"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {CATEGORY_FAMILIES.map((cat) => (
            <motion.article
              variants={itemVariants}
              key={cat.id}
              className={`threshold-card group/card bg-[var(--surface-raised)] pb-6 flex flex-col justify-between ${
                cat.isFocal ? "relative z-10" : ""
              }`}
            >
              <div className="threshold-image relative aspect-[5/7] overflow-hidden bg-[#181716]">
                <Image
                  alt={`${cat.name} showroom family`}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:scale-[1.03]"
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  src={cat.image}
                />
                <span className="absolute left-4 top-4 hc-mono text-xs tracking-[0.18em] font-semibold text-[#c8a96e]">
                  {cat.index}
                </span>
                {cat.isFocal && (
                  <span className="absolute right-4 top-4 border border-[var(--accent)]/[0.5] px-2.5 py-1 hc-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-brass-ink bg-[var(--surface)]/80 backdrop-blur-sm rounded">
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
                    className={`hc-serif leading-[0.95] text-[var(--text-primary)] transition-transform duration-500 ease-out group-hover/card:translate-x-1 ${
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
                  className="threshold-action mt-6 flex items-center gap-2.5 text-xs uppercase tracking-widest font-semibold text-[var(--text-secondary)] no-underline hover:text-[var(--accent)] transition-transform duration-500 ease-out group-hover/card:translate-x-1"
                >
                  <span>View {cat.name}</span>
                  <svg className="w-4 h-4 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              Five thresholds
            </h3>
          </div>
          <span className="hc-mono text-xs tracking-[0.16em] text-[var(--text-secondary)]">
            01 — 05
          </span>
        </div>

        <motion.div 
          className="mt-6 border-t border-[var(--border)] flex flex-col divide-y divide-[var(--border)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {CATEGORY_FAMILIES.map((cat, idx) => (
            <motion.a
              variants={itemVariants}
              key={cat.id}
              href={cat.href}
              className="mobile-row w-full py-4 flex items-center gap-4 text-left no-underline hover:bg-[var(--surface-raised)] transition-colors duration-150"
            >
              <span className="hc-mono w-6 text-xs font-semibold tracking-[0.12em] text-brass-ink">
                0{idx + 1}
              </span>
              <Image
                alt={cat.name}
                className="h-[56px] w-[80px] object-cover rounded-lg border border-[var(--border)]"
                width={80}
                height={56}
                src={cat.image}
              />
              <div className="flex-1 min-w-0">
                <strong className="block hc-serif text-2xl leading-tight font-normal text-[var(--text-primary)]">
                  {cat.name} {cat.nameBreak || ""}
                </strong>
                <small className="mt-1 block text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)] truncate">
                  {cat.subtitle}
                </small>
              </div>
              <svg className="w-5 h-5 text-[#c8a96e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

