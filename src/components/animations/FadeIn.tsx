"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";
import { motionTokens } from "@/lib/motion/tokens";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
  viewportMargin?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  duration = motionTokens.duration.editorial,
  className = "",
  viewportMargin = "-10%",
}: FadeInProps) => {
  const shouldReduceMotion = useReducedMotion();

  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: motionTokens.distance.medium };
      case "down":
        return { y: -motionTokens.distance.medium };
      case "left":
        return { x: motionTokens.distance.medium };
      case "right":
        return { x: -motionTokens.distance.medium };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...(shouldReduceMotion ? {} : offset) 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration: shouldReduceMotion ? motionTokens.duration.standard : duration,
        delay,
        ease: motionTokens.ease.editorial,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
