"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // Higher is faster parallax. Typical range: 0.1 to 0.3
}

export const ParallaxImage = ({ src, alt, className = "", speed = 0.2 }: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress (0 to 1) to y translation
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[120%] object-cover"
        style={{
          y: shouldReduceMotion ? 0 : y,
          height: shouldReduceMotion ? "100%" : "120%",
          top: shouldReduceMotion ? "0" : "-10%",
        }}
      />
    </div>
  );
};
