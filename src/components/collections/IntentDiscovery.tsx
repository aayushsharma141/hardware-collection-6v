"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { INTENT_ZONES } from "@/content/fallback/intent";

export default function IntentDiscovery() {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();

  return (
    <section className="py-16 md:py-24 border-t border-[var(--border)] bg-[#fbf5ea]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
            Collections
          </span>
          <h2 className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)]">
            What are you looking for?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {INTENT_ZONES.map((zone) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("intent", zone.id);
            params.delete("category"); // specific intent overrides specific category
            const exploreLink = `?${params.toString()}#catalog`;

            return (
              <motion.div
                key={zone.id}
                id={zone.id}
                className={`group relative overflow-hidden rounded-xl bg-black ${zone.className}`}
                initial="initial"
                whileHover={shouldReduceMotion ? "initial" : "hover"}
              >
                {/* Background Image */}
                <motion.div
                  className="absolute inset-0 z-0"
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.04 },
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={zone.image}
                    alt={zone.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                </motion.div>

                {/* Content overlay */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
                  <motion.div
                    variants={{
                      initial: { y: 0 },
                      hover: { y: -4 },
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <h3 className="hc-serif text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4">
                      {zone.name}
                    </h3>
                    
                    <ul className="flex flex-wrap items-center gap-y-2 gap-x-3 text-sm md:text-base text-white/80 font-light mb-2">
                      {zone.keywords.map((kw, i) => {
                        // Keep brand when clicking a subcategory keyword
                        const kwParams = new URLSearchParams(searchParams.toString());
                        const match = kw.href.match(/category=([^&#]+)/);
                        if (match) {
                          kwParams.set("category", match[1]);
                          kwParams.delete("intent");
                        }
                        const kwLink = `?${kwParams.toString()}#catalog`;
                        
                        return (
                          <li key={kw.label} className="flex items-center">
                            <Link
                              href={kwLink}
                              className="hover:text-white hover:underline decoration-1 underline-offset-4 transition-colors"
                            >
                              {kw.label}
                            </Link>
                            {i < zone.keywords.length - 1 && (
                              <span className="ml-3 text-white/30 select-none">•</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Subtle arrow indicator */}
                    <div className="mt-6 overflow-hidden h-6">
                      <Link
                        href={exploreLink}
                        className="text-[#c8a96e] font-mono text-xs tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <motion.div
                          variants={{
                            initial: { y: 24, opacity: 0 },
                            hover: { y: 0, opacity: 1 },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex items-center gap-2"
                        >
                          Explore Zone <span aria-hidden="true">&rarr;</span>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
