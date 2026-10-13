"use client";

import React from "react";
import { motion, type Transition } from "motion/react";

interface AnimatedMenuIconProps {
  isOpen: boolean;
  className?: string;
  size?: number;
}

/**
 * Authentic Material Design Kinetic Menu Icon
 * Smooth GPU-accelerated transition between 3-line hamburger and diagonal close (X)
 * following Google Material Design motion guidelines (cubic-bezier easing, zero jitter).
 */
export function AnimatedMenuIcon({
  isOpen,
  className = "",
  size = 20,
}: AnimatedMenuIconProps) {
  // Precision mechanical damping: crisp start with smooth exponential deceleration
  const transition: Transition = {
    duration: 0.32,
    ease: [0.19, 1, 0.22, 1],
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={transition}
      className={`overflow-visible select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Line -> Glides to center and rotates 45° into diagonal */}
      <motion.line
        x1="4.5"
        y1="12"
        x2="19.5"
        y2="12"
        style={{ transformOrigin: "12px 12px" }}
        animate={{
          y: isOpen ? 0 : -5.5,
          rotate: isOpen ? 45 : 0,
        }}
        transition={transition}
      />

      {/* Middle Line -> Shrinks horizontally and fades out at center */}
      <motion.line
        x1="4.5"
        y1="12"
        x2="19.5"
        y2="12"
        style={{ transformOrigin: "12px 12px" }}
        animate={{
          opacity: isOpen ? 0 : 1,
          scaleX: isOpen ? 0 : 1,
        }}
        transition={{
          duration: isOpen ? 0.18 : 0.28,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Bottom Line -> Glides to center and rotates -45° into diagonal */}
      <motion.line
        x1="4.5"
        y1="12"
        x2="19.5"
        y2="12"
        style={{ transformOrigin: "12px 12px" }}
        animate={{
          y: isOpen ? 0 : 5.5,
          rotate: isOpen ? -45 : 0,
        }}
        transition={transition}
      />
    </motion.svg>
  );
}
