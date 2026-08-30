"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SIGNATURE_PIECES, SignaturePiece } from "@/data/home";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PRODUCTS = SIGNATURE_PIECES;

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
    <div
      className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 lg:hidden"
      style={{ scrollbarWidth: "none", paddingLeft: "16px", paddingRight: "16px" }}
    >
      {PRODUCTS.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className="snap-start shrink-0 block group"
          style={{ width: "78vw" }}
        >
          <MobileProductCard product={p} />
        </a>
      ))}
    </div>
  );

  return (
    <section
      data-chapter="5"
      className="border-t border-zinc-900 bg-transparent relative"
    >
      {/* Pointer light overlay — scoped to this chapter */}
      <div
        className="pointer-light absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* Mobile layout */}
      <div className="block lg:hidden pt-16 pb-8 px-0">
        <div className="px-6">
          <ChapterLabel />
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mt-3 mb-8 font-light">
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
            <p className="text-zinc-500 font-light mt-4 leading-relaxed text-sm">
              Selected architectural hardware from our authorized partners.
            </p>
            <p className="text-zinc-700 text-xs mt-6">
              01 — {PRODUCTS.length.toString().padStart(2, "0")}
            </p>
          </div>

          {/* Product cards */}
          {PRODUCTS.map((p, i) => (
            <a
              key={i}
              href={p.href}
              className="product-card shrink-0 block group cursor-pointer"
              style={{ width: "340px" }}
            >
              <ProductCard product={p} />
            </a>
          ))}

          {/* End: full collection CTA */}
          <div className="shrink-0 w-80 flex flex-col justify-center h-full pl-8 border-l border-zinc-900">
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
      <div className="relative overflow-hidden bg-zinc-900 aspect-[3/4] rounded-sm">
        <img
          src={product.img}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-700 ease-out will-change-transform"
        />
        {/* Reflective light sweep */}
        <div
          className="light-sweep-overlay"
          aria-hidden="true"
          style={{ "--sweep-delay": product.sweepDelay } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Specimen label */}
      <div className="space-y-0.5">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">{product.index} · {product.category}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-zinc-400 text-xs tracking-wide group-hover:translate-y-[-4px] transition-transform duration-200">
            {product.brand}
          </p>
          <span className="text-zinc-600 text-xs group-hover:translate-x-[6px] transition-transform duration-200" aria-hidden="true">
            →
          </span>
        </div>
        <h3 className="text-white font-light text-xl">{product.name}</h3>
        <p className="text-zinc-600 text-xs">{product.finish}</p>
      </div>
    </div>
  );
}

function ChapterLabel() {
  return (
    <>
      <p className="hc-mono text-[#c8a96e] font-medium tracking-[0.22em] text-[10px] sm:text-[11px] uppercase mb-1">
        Selected hardware
      </p>
      <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#e8e3d9] leading-tight mt-2">
        Selected<br />
        <span className="text-[#aaa49a]">Architectural</span><br />
        Hardware.
      </h2>
    </>
  );
}

function CollectionCTA() {
  return (
    <MagneticButton>
      <a
        href="/collections"
        className="inline-flex items-center gap-3 px-8 py-5 border border-zinc-700 text-white font-medium text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
      >
        EXPLORE FULL COLLECTION
        <span aria-hidden="true" className="text-base">→</span>
      </a>
    </MagneticButton>
  );
}

/**
 * MobileProductCard — editorial mobile card layout
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
      {/* Portrait image — aspect 4:5 */}
      <div className="relative overflow-hidden bg-zinc-900 aspect-[4/5] rounded-sm">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Editorial label: brand (brass) → name → explore */}
      <div className="space-y-1 px-0.5">
        <p className="text-[#C8A96E] text-[13px] tracking-widest uppercase font-medium">
          {product.brand}
        </p>
        <h3 className="text-white text-[20px] font-light leading-snug">
          {product.name}
        </h3>
        <p className="text-zinc-500 text-[13px] tracking-wide group-hover:translate-x-1 transition-transform duration-200">
          Explore →
        </p>
      </div>
    </div>
  );
}

