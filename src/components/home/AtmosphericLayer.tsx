import { BrandWatermark } from "./BrandWatermark";
import { ParticleWave } from "./ParticleWave";

export type AtmosphericPreset = "hero" | "footer";

interface AtmosphericLayerProps {
  preset?: AtmosphericPreset;
}

export function AtmosphericLayer({
  preset = "hero",
}: AtmosphericLayerProps) {
  
  const isHero = preset === "hero";
  const particleOpacity = isHero ? 0.7 : 0.3; // Much lower for footer

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden" 
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* 
        Obsidian Background base 
        Hero uses page background, footer uses this to fade to black
      */}
      {!isHero && <div className="absolute inset-0 bg-[var(--surface)]" />}

      {/* Volumetric Lights */}
      <div 
        className="absolute bottom-0 right-0 w-[80vw] h-[80vh] rounded-full"
        style={{
          background: isHero 
            ? "radial-gradient(ellipse at bottom right, rgba(200, 169, 110, 0.035) 0%, transparent 70%)"
            : "radial-gradient(ellipse at bottom right, rgba(200, 169, 110, 0.015) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      
      {isHero && (
        <div 
          className="absolute top-0 left-0 w-[60vw] h-[60vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.015) 0%, transparent 70%)",
            filter: "blur(80px)"
          }}
        />
      )}

      {/* Z-index 1: Particle Wave */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <ParticleWave preset={preset} opacity={particleOpacity} />
      </div>

      {/* Z-index 2: Brand Watermark */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <BrandWatermark />
      </div>
      
      {/*
        Grounding wash under the footer content. Warm surface, not white — a
        white veil over the ivory ground desaturated the whole panel.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/25 via-transparent to-transparent" style={{ zIndex: 3 }} />
    </div>
  );
}

