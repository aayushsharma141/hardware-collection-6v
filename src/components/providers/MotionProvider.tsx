"use client";

import { MotionConfig } from "motion/react";
import React from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </MotionConfig>
  );
}
