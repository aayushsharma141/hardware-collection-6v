"use client";

import { useSyncExternalStore } from "react";

export function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(min-width: 768px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export const getSnapshot = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(min-width: 768px)").matches
    : false;

export const getServerSnapshot = () => false;

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
