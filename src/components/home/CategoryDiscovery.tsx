"use client";

import React from "react";
import { CATEGORY_FAMILIES } from "@/data/home";

export default function CategoryDiscovery() {
  return (
    <section id="categories" className="bg-[#090909] text-[#e8e3d9] py-16 lg:py-24 border-t border-white/[0.12]">
      {/* Desktop Version */}
      <div className="hidden lg:block px-[68px]">
        <div className="flex items-end justify-between border-b border-white/[0.16] pb-6">
          <div>
            <p className="hc-mono text-[10px] uppercase tracking-[0.22em] text-[#c8a96e]">
              Showroom families / 05
            </p>
            <h2 className="hc-serif mt-3 text-[56px] xl:text-[62px] leading-none font-normal tracking-[0.02em] text-[#e8e3d9]">
              Five thresholds
            </h2>
          </div>
          <p className="max-w-[360px] text-right text-[13px] leading-[1.6] text-[#aaa49a] font-light">
            A considered route through architectural hardware, security, bath, kitchen systems and the joinery details that finish a room.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-[0.92fr_1.28fr_0.88fr_1.08fr_0.92fr] gap-[1px] bg-white/[0.13]">
          {CATEGORY_FAMILIES.map((cat) => (
            <article
              key={cat.id}
              className={`threshold-card bg-[#11100f] pb-5 flex flex-col justify-between ${
                cat.isFocal ? "relative z-10" : ""
              }`}
            >
              <div className="threshold-image relative aspect-[5/7] overflow-hidden bg-[#181716]">
                <img
                  alt={`${cat.name} showroom family`}
                  className={`h-full w-full object-cover ${
                    cat.isFocal ? "opacity-[0.9]" : "opacity-[0.8]"
                  }`}
                  decoding="async"
                  loading="lazy"
                  src={cat.image}
                />
                <div className="absolute inset-0 bg-[#090909]/[0.15]" />
                <span className="absolute left-4 top-4 hc-mono text-[10px] tracking-[0.16em] text-[#c8a96e]">
                  {cat.index}
                </span>
                {cat.isFocal && (
                  <span className="absolute right-4 top-4 border border-[#c8a96e]/[0.5] px-2 py-1 hc-mono text-[8px] uppercase tracking-[0.14em] text-[#c8a96e] bg-[#090909]/60">
                    Focal family
                  </span>
                )}
              </div>

              <div
                className={`border-t ${
                  cat.isFocal ? "border-[#c8a96e]" : "border-[#c8a96e]/[0.65]"
                } bg-[#090909] px-5 xl:px-6 pt-5 pb-4 flex-1 flex flex-col justify-between`}
              >
                <div>
                  <h3
                    className={`hc-serif leading-[0.94] text-[#e8e3d9] ${
                      cat.isFocal ? "text-[36px]" : "text-[28px] xl:text-[30px]"
                    }`}
                  >
                    {cat.name}
                    {cat.nameBreak && (
                      <>
                        <br />
                        {cat.nameBreak}
                      </>
                    )}
                  </h3>
                  <p className="mt-3 text-[11px] leading-[1.5] text-[#aaa49a]">
                    {cat.subtitle}
                  </p>
                  <p className="mt-3 border-t border-white/[0.12] pt-3 text-[10px] leading-[1.5] text-[#88837a]">
                    {cat.detail}
                  </p>
                </div>

                <a
                  href={cat.href}
                  className="threshold-action mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#d1ccc4] no-underline hover:text-white"
                >
                  <span>View {cat.name}</span>
                  <svg className="w-3.5 h-3.5 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Mobile Version: Vertical Curated List */}
      <div className="block lg:hidden px-4">
        <div className="flex items-end justify-between border-b border-white/[0.14] pb-4">
          <div>
            <p className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[#c8a96e]">
              Showroom families
            </p>
            <h3 className="hc-serif mt-1 text-[32px] leading-none text-[#e8e3d9]">
              Five thresholds
            </h3>
          </div>
          <span className="hc-mono text-[10px] tracking-[0.16em] text-[#aaa49a]">
            01—05
          </span>
        </div>

        <div className="mt-4 border-t border-white/[0.14] flex flex-col">
          {CATEGORY_FAMILIES.map((cat, idx) => (
            <a
              key={cat.id}
              href={cat.href}
              className={`mobile-row w-full border-b border-white/[0.12] pl-3 pr-2 py-3.5 flex items-center gap-3 text-left no-underline hover:bg-white/[0.02] ${
                idx === 0 ? "border-t-0" : ""
              }`}
            >
              <span className="hc-mono w-6 text-[10px] tracking-[0.12em] text-[#c8a96e]">
                0{idx + 1}
              </span>
              <img
                alt={cat.name}
                className="h-[52px] w-[76px] object-cover opacity-[0.85] rounded-none border border-white/[0.08]"
                decoding="async"
                loading="lazy"
                src={cat.image}
              />
              <div className="flex-1 min-w-0">
                <strong className="block hc-serif text-[19px] leading-none font-normal text-[#e8e3d9]">
                  {cat.name} {cat.nameBreak || ""}
                </strong>
                <small className="mt-1 block text-[10px] uppercase tracking-[0.1em] text-[#88837a] truncate">
                  {cat.subtitle}
                </small>
              </div>
              <svg className="w-4 h-4 text-[#c8a96e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
