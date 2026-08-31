"use client";

import { useState, useEffect, useRef, Component, ReactNode, ErrorInfo } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/config";

// Dynamic import for ThreeDScene, only loaded when capability passed and near viewport
const DynamicThreeDScene = dynamic(() => import("./3d/ThreeDScene"), {
  ssr: false,
  loading: () => <StaticProductFallback />,
});

// Error boundary to gracefully catch any WebGL context failure
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL rendering failed, falling back to static product showcase:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StaticProductFallback() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[var(--surface)] flex items-center justify-center">
      <img
        src="/Hardware Collection/hero_bg.png"
        alt="Solid Brass Pull Handle"
        className="w-full h-full object-cover opacity-60 filter brightness-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    </div>
  );
}

export default function ThreeDHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isCapable, setIsCapable] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    // 1. Check capability: Desktop (>=1024px) + Fine pointer (mouse) + WebGL support
    const checkCapability = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      
      let webglSupported = false;
      try {
        const canvas = document.createElement("canvas");
        webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      } catch {
        webglSupported = false;
      }

      setIsCapable(isDesktop && isFinePointer && webglSupported && !shouldReduceMotion);
    };

    checkCapability();
    window.addEventListener("resize", checkCapability);

    // 2. Intersection Observer with 800px rootMargin to prepare 3D scene ahead of scroll
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
        }
      },
      { rootMargin: "800px 0px 800px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkCapability);
    };
  }, [shouldReduceMotion]);

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-[70vh] lg:h-screen bg-[var(--surface)] relative overflow-hidden border-t border-[var(--border)] flex flex-col justify-between"
    >
      {/* Editorial Header Overlay */}
      <div className="relative z-10 pt-16 px-6 lg:px-16 pointer-events-none">
        <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-3">
          SECTION 07 // THE PRODUCT MOMENT
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-light text-[var(--text-primary)] leading-tight max-w-2xl">
          Architectural Scale.<br />Solid Form.
        </h2>
      </div>

      {/* 3D Canvas / Static Fallback Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        {isCapable && isNearViewport ? (
          <WebGLErrorBoundary fallback={<StaticProductFallback />}>
            <DynamicThreeDScene />
          </WebGLErrorBoundary>
        ) : (
          <StaticProductFallback />
        )}
      </div>

      {/* Bottom Information & Action Bar */}
      <div className="relative z-10 pb-12 px-6 lg:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12">
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs tracking-widest uppercase">
            {isCapable ? "Drag to inspect finish" : "Craftsmanship Standard"}
          </p>
          <p className="text-[var(--text-primary)] text-base lg:text-lg font-light">
            SOLID BRASS &bull; PVD SATIN GOLD FINISH
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/collections"
            className="px-6 py-3 border border-[var(--border)] hover:border-[#C8A96E] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs tracking-widest uppercase transition-colors"
          >
            Explore Collection
          </Link>
          <a
            href={buildWhatsAppUrl("Hi, I am interested in architectural hardware consultation.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#C8A96E] hover:bg-[#b5955a] text-zinc-950 text-xs font-medium tracking-widest uppercase transition-colors shadow-lg"
          >
            Consult on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

