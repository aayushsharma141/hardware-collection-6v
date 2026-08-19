"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export const CursorSystem = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  useEffect(() => {
    // Only enable if min-width: 1024px AND fine pointer (mouse)
    const checkPointer = () => {
      const match = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      setIsDesktopPointer(match);
    };

    checkPointer();
    window.addEventListener("resize", checkPointer);

    if (!isDesktopPointer || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Native cursor exceptions: inputs, text areas, precision areas, editable text
      if (
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.tagName.toLowerCase() === 'select' ||
        target.isContentEditable ||
        target.closest('[data-native-cursor]') ||
        target.closest('iframe')
      ) {
        setIsVisible(false);
        setIsHovering(false);
        setCursorText("");
        return;
      }

      setIsVisible(true);

      // Check for custom cursor attributes
      const customCursorData = target.closest('[data-cursor]');
      
      if (customCursorData) {
        setIsHovering(true);
        setCursorText(customCursorData.getAttribute('data-cursor') || "");
      } else if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
        setCursorText(""); // Standard hover
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", checkPointer);
    };
  }, [isDesktopPointer, shouldReduceMotion]);

  if (!isDesktopPointer || shouldReduceMotion || !isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) and (pointer: fine) {
          body, a, button, [role="button"] {
            cursor: none;
          }
          input, textarea, select, [data-native-cursor], [contenteditable="true"] {
            cursor: auto !important;
          }
        }
      `}} />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
        animate={{
          x: mousePosition.x - (cursorText ? 36 : isHovering ? 20 : 12),
          y: mousePosition.y - (cursorText ? 36 : isHovering ? 20 : 12),
          height: cursorText ? 72 : isHovering ? 40 : 24,
          width: cursorText ? 72 : isHovering ? 40 : 24,
          backgroundColor: cursorText ? "rgba(200, 169, 110, 1)" : isHovering ? "rgba(200, 169, 110, 0.2)" : "transparent",
          border: isHovering && !cursorText ? "1px solid rgba(200, 169, 110, 0.8)" : cursorText ? "none" : "1px solid rgba(200, 169, 110, 0.5)",
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.1 }}
      >
        {cursorText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-semibold tracking-widest text-zinc-950 uppercase"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
};
