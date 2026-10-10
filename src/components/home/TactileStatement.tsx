"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export default function TactileStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Clip path reveal
  const clipPath = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );

  // Parallax movement for the main image
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.15, 1.0]);
  
  // Text moving in opposite direction
  const textY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-[var(--surface)] relative overflow-hidden flex items-center">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            style={{ y: shouldReduceMotion ? 0 : textY }}
            className="order-2 lg:order-1"
          >
            <p className="text-brass-ink font-medium tracking-widest text-sm uppercase mb-6">
              THE TACTILE STATEMENT
            </p>
            <h2 className="text-5xl lg:text-7xl font-light text-[var(--text-primary)] leading-tight mb-8">
              HARDWARE<br />YOU CAN<br />EXPERIENCE.
            </h2>
            <p className="text-xl text-[var(--text-secondary)] font-light max-w-md">
              Weight. Texture. Resistance. True quality isn&apos;t just seen. It communicates through touch.
            </p>
          </motion.div>
          
          {/* Macro Photography Reveal */}
          <div className="order-1 lg:order-2 h-[50vh] lg:h-[65vh] w-full relative">
            <motion.div 
              style={{ 
                clipPath: shouldReduceMotion ? "none" : clipPath,
                width: "100%",
                height: "100%"
              }}
              className="relative overflow-hidden bg-[var(--surface-raised)]"
            >
              <motion.img 
                style={{ scale: shouldReduceMotion ? 1 : imageScale }}
                src="/Hardware Collection/hero_bg.png" 
                alt="Macro texture of architectural hardware"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>

            {/* Small detail image overlapping */}
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [50, -150]) }}
              className="absolute -bottom-10 -left-10 w-48 h-64 border border-[var(--border)] hidden lg:block bg-[var(--surface-raised)] overflow-hidden"
            >
              <Image
                src="/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg"
                alt="Detail"
                fill
                sizes="192px"
                className="object-cover"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}


