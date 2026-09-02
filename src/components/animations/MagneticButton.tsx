"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, ReactNode } from "react";

export type MagneticIntensity = "none" | "subtle" | "standard";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  intensity?: MagneticIntensity;
  onClick?: () => void;
}

export const MagneticButton = ({ 
  children, 
  className = "", 
  intensity = "subtle", 
  onClick 
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const getStrength = () => {
    switch (intensity) {
      case "none":
        return 0;
      case "subtle":
        return 8;
      case "standard":
        return 16;
    }
  };

  const strength = getStrength();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !ref.current || intensity === "none") return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    setPosition({ x: middleX * (strength / 40), y: middleY * (strength / 40) });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      whileTap={shouldReduceMotion || intensity === "none" ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};
