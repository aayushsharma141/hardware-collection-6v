"use client";

import dynamic from "next/dynamic";

const ThreeDHero = dynamic(() => import("./ThreeDHero"), { ssr: false });

export default function ThreeDHeroWrapper() {
  return <ThreeDHero />;
}
