"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export default function SignatureCollection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Asymmetric parallax offsets
  const leftPanelY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rightPanelY = useTransform(scrollYProgress, [0, 1], [100, -200]);

  return (
    <section ref={containerRef} className="py-32 lg:py-48 bg-[var(--surface)] overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-24 lg:mb-40">
          <p className="text-brass-ink font-medium tracking-widest text-sm uppercase mb-4">
            CURATED
          </p>
          <h2 className="text-4xl lg:text-6xl font-light text-[var(--text-primary)]">Signature Collections</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
          
          {/* Left Panel */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : leftPanelY }}
            className="w-full lg:w-[90%]"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--surface-raised)] group">
              <motion.img 
                src="/cinema/showroom/exterior.png"
                alt="Smart Entrance"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
                          </div>
            <div className="mt-8">
              <h3 className="text-3xl text-[var(--text-primary)] font-light mb-2">SMART ENTRANCE</h3>
              <Link href="/collections" className="text-sm text-brass-ink tracking-widest uppercase hover:text-[var(--text-primary)] transition-colors">
                Explore Edition →
              </Link>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : rightPanelY }}
            className="w-full lg:w-[80%] ml-auto mt-24 lg:mt-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-raised)] group">
              <motion.img 
                src="/cinema/showroom/interior.png"
                alt="Modern Kitchen"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
                          </div>
            <div className="mt-8">
              <h3 className="text-3xl text-[var(--text-primary)] font-light mb-2">MODERN KITCHEN</h3>
              <Link href="/collections" className="text-sm text-brass-ink tracking-widest uppercase hover:text-[var(--text-primary)] transition-colors">
                Explore Edition →
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

