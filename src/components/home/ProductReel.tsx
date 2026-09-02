"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion, motion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SIGNATURE_PIECES, SignaturePiece } from "@/content/fallback/home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PRODUCTS = SIGNATURE_PIECES;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 250,
      damping: 25,
      mass: 1
    }
  }
};

export default function ProductReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion || !containerRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const getScrollDistance = () =>
          trackRef.current ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 64) : 0;

        gsap.to(trackRef.current, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] }
  );

  // Mobile: CSS scroll-snap, layout contract per spec
  // Card width: 78vw | Container px: 16px | Gap: 16px | snap-align: start
  const mobileReel = (
    <motion.div
      className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 lg:hidden"
      style={{ scrollbarWidth: "none", paddingLeft: "16px", paddingRight: "16px" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {PRODUCTS.map((p, i) => (
        <motion.a
          variants={itemVariants}
          key={i}
          href={p.href}
          className="snap-start shrink-0 block group"
          style={{ width: "78vw" }}
        >
          <MobileProductCard product={p} />
        </motion.a>
      ))}
    </motion.div>
  );

  return (
    <section
      data-chapter="5"
      className="border-t border-[var(--border)] bg-transparent relative"
    >
      {/* Pointer light overlay &mdash; scoped to this chapter */}
      <div
        className="pointer-light absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* Mobile layout */}
      <div className="block lg:hidden pt-16 pb-8 px-0">
        <div className="px-6">
          <ChapterLabel />
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm mt-3 mb-8 font-light">
            A considered selection of tactile architectural details from our Sakchi showroom.
          </p>
        </div>
        <div className="mt-2">{mobileReel}</div>
        <div className="mt-8 px-6">
          <CollectionCTA />
        </div>
      </div>

      {/* Desktop horizontal reel */}
      <div
        ref={containerRef}
        className="hidden lg:block overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div
          ref={trackRef}
          className="flex h-full items-center pl-16 pr-16 gap-8 will-change-transform w-max"
        >
          {/* Chapter label as first "card" */}
          <div className="shrink-0 w-72 pr-8 flex flex-col justify-center h-full">
            <ChapterLabel />
            <p className="text-[var(--text-secondary)] font-light mt-4 leading-relaxed text-sm">
              Selected architectural hardware from our authorized partners.
            </p>
            <p className="text-[var(--text-secondary)] text-xs mt-6">
              01 &mdash; {PRODUCTS.length.toString().padStart(2, "0")}
            </p>
          </div>

          {/* Product cards */}
          <motion.div 
            className="flex h-full items-center gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PRODUCTS.map((p, i) => (
              <motion.a
                variants={itemVariants}
              key={i}
              href={p.href}
              className="product-card shrink-0 block group cursor-pointer"
              style={{ width: "340px" }}
            >
              <ProductCard product={p} />
              </motion.a>
            ))}
          </motion.div>

          {/* End: full collection CTA */}
          <div className="shrink-0 w-80 flex flex-col justify-center h-full pl-8 border-l border-[var(--border)]">
            <CollectionCTA />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
}: {
  product: SignaturePiece;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image with light sweep + hover zoom */}
      <div className="relative overflow-hidden bg-[var(--surface-raised)] aspect-[3/4] rounded-sm">
        <img
          src={product.img}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover opacity-80 group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
        />
        {/* Hover darkened overlay for editorial contrast */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        {/* Reflective light sweep */}
        <div
          className="light-sweep-overlay pointer-events-none"
          aria-hidden="true"
          style={{ "--sweep-delay": product.sweepDelay } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/30 to-transparent pointer-events-none" />
      </div>

      {/* Specimen label */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[var(--text-secondary)] text-[10px] tracking-widest uppercase opacity-70">
            {product.index} &middot; {product.category}
          </p>
          <span className="text-[var(--text-secondary)] text-sm group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" aria-hidden="true">
            &rarr;
          </span>
        </div>
        <p className="text-[#c8a96e] text-xs font-medium tracking-wide uppercase">
          {product.brand}
        </p>
        <h3 className="hc-serif text-[var(--text-primary)] font-light text-[26px] leading-tight">
          {product.name}
        </h3>
        <p className="text-[var(--text-secondary)] text-[11px] font-light uppercase tracking-widest opacity-80 pt-1">
          {product.finish}
        </p>
      </div>
    </div>
  );
}

function ChapterLabel() {
  return (
    <>
      <p className="hc-mono text-[var(--accent)] font-medium tracking-[0.22em] text-[10px] sm:text-[11px] uppercase mb-1">
        Selected hardware
      </p>
      <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[var(--text-primary)] leading-tight mt-2">
        Selected<br />
        <span className="text-[var(--text-secondary)]">Architectural</span><br />
        Hardware.
      </h2>
    </>
  );
}

function CollectionCTA() {
  return (
    <MagneticButton>
      <Link
        href="/collections"
        className="inline-flex items-center gap-3 px-8 py-5 border border-[var(--border)] text-[var(--text-primary)] font-medium text-sm tracking-widest uppercase hover:bg-[var(--text-primary)] hover:text-[var(--surface)] transition-colors duration-300"
      >
        EXPLORE FULL COLLECTION
        <span aria-hidden="true" className="text-base">→</span>
      </Link>
    </MagneticButton>
  );
}

/**
 * MobileProductCard &mdash; editorial mobile card layout
 * Simplified hierarchy: image → brand → title → explore
 * Card is the tap target (parent <a>). No secondary actions.
 */
function MobileProductCard({
  product,
}: {
  product: SignaturePiece;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Portrait image &mdash; aspect 4:5 */}
      <div className="relative overflow-hidden bg-[var(--surface-raised)] aspect-[4/5] rounded-sm">
        <img
          src={product.img}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700 ease-out will-change-transform"
        />
        <div
          className="light-sweep-overlay"
          aria-hidden="true"
          style={{ "--sweep-delay": product.sweepDelay } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/30 to-transparent" />
      </div>

      {/* Editorial label: brand (brass) → name → explore */}
      <div className="space-y-1 px-0.5">
        <p className="text-[#C8A96E] text-[13px] tracking-widest uppercase font-medium">
          {product.brand}
        </p>
        <h3 className="text-[var(--text-primary)] text-[20px] font-light leading-snug">
          {product.name}
        </h3>
        <p className="text-[var(--text-secondary)] text-[13px] tracking-wide group-hover:translate-x-1 transition-transform duration-200">
          Explore →
        </p>
      </div>
    </div>
  );
}





