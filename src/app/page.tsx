import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getHomePage, getSiteSettings, getBrands } from "@/sanity/queries";

// Global cinema system
import { AtmosphericBackground } from "@/components/home/cinema/AtmosphericBackground";
import { ChapterIndex } from "@/components/home/cinema/ChapterIndex";
import { PointerLight } from "@/components/home/cinema/PointerLight";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

// 7 Cinematic Chapters
import HeroStage from "@/components/home/HeroStage";           // CH01 — HIGH tension
import InteractiveBrandWall from "@/components/home/InteractiveBrandWall"; // CH02 — LOW tension
import CategoryDiscovery from "@/components/home/CategoryDiscovery";       // CH03 — MEDIUM tension
import MaterialJourney from "@/components/home/MaterialJourney";           // CH04 — VERY HIGH tension
import ProductReel from "@/components/home/ProductReel";                   // CH05 — MEDIUM tension
import ShowroomCinematic from "@/components/home/ShowroomCinematic";       // CH06 — HIGH tension
import FloatingCTA from "@/components/home/FloatingCTA";                   // CH07 — QUIET ZONE

export const revalidate = 60;

const fallbackHeroSlides = [
  {
    id: "ch01",
    eyebrow: "HARDWARE COLLECTION · SAKCHI, JAMSHEDPUR",
    title: "The Art of\nthe Finish.",
    description:
      "Architectural hardware chosen for spaces that deserve better details. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/hero/HC-01-HERO-01.png",
    productUrl: "/cinema/hero/HC-01-HERO-02.png",
    macroUrl: "/cinema/hero/HC-01-HERO-03.png",
    reflectionUrl: "/cinema/hero/HC-01-HERO-04.png",
  },
  {
    id: "ch02",
    eyebrow: "LIVE SHOWROOM EXPERIENCE",
    title: "Touch Before\nYou Decide.",
    description:
      "Experience German soft-close drawers, live biometric lock demos, and luxury kitchen setups at our Sakchi flagship showroom.",
    primaryCta: "Get Showroom Directions",
    ctaTarget: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
    imageUrl: "/cinema/showroom/interior.png",
    // Fallback product overlays for the second slide
    productUrl: "/cinema/hero/HC-01-HERO-03.png",
  },
];

export default async function HomePage() {
  const [homeData, siteSettings, brands] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getBrands(),
  ]);

  const heroSlides =
    homeData?.heroSlides && homeData.heroSlides.length > 0
      ? homeData.heroSlides
      : fallbackHeroSlides;

  return (
    <div
      className="min-h-[100dvh] text-white overflow-x-hidden relative selection:bg-[#C8A96E] selection:text-black"
      style={{ backgroundColor: "rgb(var(--atm-r), var(--atm-g), var(--atm-b))" }}
    >
      {/* ── Global Cinema System ─────────────────────────────────── */}
      {/* z=0: Persistent atmospheric canvas — behind all content */}
      <AtmosphericBackground />

      {/* Scroll progress indicator — subtle top bar */}
      <ScrollProgress />

      {/* Pointer lighting — registered globally, scoped per chapter via .pointer-light */}
      <PointerLight />

      {/* Left-rail chapter index — desktop fine-pointer only */}
      <ChapterIndex />

      {/* ── Navigation ──────────────────────────────────────────── */}
      <Navbar
        primaryPhone={siteSettings?.primaryPhone}
        whatsappNumber={siteSettings?.whatsappNumber}
        defaultWhatsappMessage={siteSettings?.defaultWhatsappMessage}
      />

      {/* ── 7 Cinematic Chapters ─────────────────────────────────── */}
      <main>
        {/* CH01 — The Art of the Finish (HIGH) */}
        <HeroStage slides={heroSlides} />

        {/* CH02 — Specified By (LOW) */}
        <InteractiveBrandWall />

        {/* CH03 — Form & Function (MEDIUM) */}
        <CategoryDiscovery />

        {/* CH04 — The Finish · Primary Material Showcase (VERY HIGH) */}
        <MaterialJourney />

        {/* CH05 — The Collection · Emotion→Consideration Bridge (MEDIUM) */}
        <ProductReel />

        {/* CH06 — Inside the Showroom (HIGH) */}
        <ShowroomCinematic />

        {/* CH07 — Come Feel It · Quiet Conversion Zone (QUIET) */}
        <FloatingCTA />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer settings={siteSettings} brands={brands} />
    </div>
  );
}