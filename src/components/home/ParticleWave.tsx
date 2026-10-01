"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface ParticleWaveProps {
  preset: "hero" | "footer";
  opacity?: number;
}

export function ParticleWave({ 
  preset = "hero",
  opacity = 1.0,
}: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const mouseRef = useRef({ x: -1000, y: -1000, isMoving: false });
  const rafRef = useRef<number>(undefined);
  
  // Simulation config based on preset
  const isHero = preset === "hero";
  const mouseInfluenceEnabled = isHero;
  const speedMultiplier = isHero ? 1.0 : 0.3;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reduced Motion Fallback
    if (shouldReduceMotion) {
      // Transparent, like the animated path's clearRect: the section's own warm
      // ground shows through. Filling this with obsidian laid a dark slab over
      // the ivory footer for every reduced-motion visitor.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 200; i++) {
        // Brass at 4% is invisible on a light ground; the darker gold reads.
        ctx.fillStyle = `rgba(154, 122, 66, ${Math.random() * 0.14})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = false;

    // Particle arrays (using flat typed arrays could be faster, but for < 1000 particles, objects are fine if not re-allocated)
    type Particle = {
      x: number; y: number; baseX: number; baseY: number;
      size: number; layer: number; speedX: number; speedY: number;
      r: number; g: number; b: number; baseAlpha: number;
    };
    
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const isMobile = width < 768;
      
      // Target counts
      const farCount = isHero ? (isMobile ? 160 : 400) : (isMobile ? 80 : 150);
      const midCount = isHero ? (isMobile ? 80 : 180) : (isMobile ? 30 : 60);
      const nearCount = isHero ? (isMobile ? 25 : 60) : (isMobile ? 10 : 20);

      const addParticles = (count: number, layer: number) => {
        for (let i = 0; i < count; i++) {
          // Clustering horizontally to form "waves/bands"
          // We use sine waves to bias the Y distribution
          const x = Math.random() * width;
          // Create a wave shape constraint for Y
          const waveHeight = height * 0.3;
          const yBand = (height / 2) + Math.sin(x / width * Math.PI * 2) * waveHeight;
          const yVariance = (Math.random() - 0.5) * (height * (layer === 1 ? 1.0 : 0.6)); 
          let y = yBand + yVariance;
          
          // Wrap Y to stay on screen if it drifted too far
          if (y < 0) y = Math.random() * height;
          if (y > height) y = Math.random() * height;

          const size = layer * (isMobile ? 0.4 : 0.6) + (Math.random() * 0.4);
          const speedX = (Math.random() - 0.5) * (layer * 0.04);
          const speedY = (Math.random() - 0.5) * (layer * 0.04);

          let r = 90, g = 85, b = 80; // Warm grey default
          const colorRand = Math.random();
          if (colorRand > 0.99) { r = 139; g = 26; b = 74; } // Crimson
          else if (colorRand > 0.96) { r = 200; g = 169; b = 110; } // Gold
          else if (colorRand > 0.85) { r = 160; g = 155; b = 145; } // Muted metallic

          const baseAlpha = (layer / 3) * (0.15 + Math.random() * 0.35);

          particles.push({
            x, y, baseX: x, baseY: y, size, layer, speedX, speedY, r, g, b, baseAlpha
          });
        }
      };

      addParticles(farCount, 1);
      addParticles(midCount, 2);
      addParticles(nearCount, 3);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      // Only re-init if significant change
      if (Math.abs(width - rect.width) > 50 || Math.abs(height - rect.height) > 50) {
        width = rect.width;
        height = rect.height;
        // Cap DPR to 2 for performance
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initParticles();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInfluenceEnabled) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isMoving: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isMoving = false;
    };

    // Intersection Observer to pause when out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.0 });
    observer.observe(container);

    resize();
    window.addEventListener("resize", resize);
    
    if (mouseInfluenceEnabled) {
      window.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    const start = performance.now();
    
    const render = (time: number) => {
      if (isVisible) {
        const elapsed = time - start;
        
        ctx.clearRect(0, 0, width, height);
        
        const mX = mouseRef.current.x;
        const mY = mouseRef.current.y;
        const mActive = mouseRef.current.isMoving && mouseInfluenceEnabled;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // Organic flow math
          const timeOffset = elapsed * speedMultiplier;
          const waveX = Math.sin(timeOffset * 0.0004 + p.baseY * 0.003) * (p.layer * 0.8);
          const waveY = Math.cos(timeOffset * 0.0003 + p.baseX * 0.003) * (p.layer * 0.8);

          let targetX = p.baseX + waveX + timeOffset * p.speedX;
          let targetY = p.baseY + waveY + timeOffset * p.speedY;

          // Wrap around screen bounds softly
          if (targetX > width + 50) p.baseX -= width + 100;
          if (targetX < -50) p.baseX += width + 100;
          if (targetY > height + 50) p.baseY -= height + 100;
          if (targetY < -50) p.baseY += height + 100;

          // Mouse disturbance
          if (mActive && mX > -1) {
            const dx = mX - targetX;
            const dy = mY - targetY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 180;
            
            if (distance < influenceRadius) {
              const force = Math.pow((influenceRadius - distance) / influenceRadius, 2); // easing
              targetX -= (dx * force * p.layer * 0.04);
              targetY -= (dy * force * p.layer * 0.04);
            }
          }

          // Lerp to target for smoothness
          p.x += (targetX - p.x) * 0.04;
          p.y += (targetY - p.y) * 0.04;

          // Draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.baseAlpha * opacity})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (mouseInfluenceEnabled) {
        window.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [opacity, preset, mouseInfluenceEnabled, speedMultiplier, shouldReduceMotion, isHero]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
