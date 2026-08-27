"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/config";

interface ConsultationSuccessProps {
  leadId: string;
  intent: "consultation" | "enquiry" | "callback";
}

export function ConsultationSuccess({ leadId, intent }: ConsultationSuccessProps) {
  const isCallback = intent === "callback";
  
  // WhatsApp direct link text with Lead ID
  const waUrl = buildWhatsAppUrl(
    `Hi Hardware Collection Sakchi, I just submitted a consultation request on your website. My Reference ID is ${leadId}. Please confirm.`
  );

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-md mx-auto font-dmsans">
      {/* Quiet Gold Icon Badge */}
      <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center mb-5">
        <Check className="w-5 h-5 text-[#C8A96E]" />
      </div>
      
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#C8A96E] font-semibold mb-2">
        REQUEST LOGGED · SAKCHI SHOWROOM
      </p>
      
      <h3 
        className="font-cormorant text-2xl sm:text-3xl font-normal text-white mb-3"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        We&apos;ve received your request.
      </h3>
      
      <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
        {isCallback 
          ? "Our technical showroom specialists will call you during your requested callback window."
          : "Our showroom team will review your specifications and reach out on WhatsApp to confirm your preferred timing."}
      </p>

      {/* Reference ID Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 mb-6 w-full text-center">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">YOUR REFERENCE ID</p>
        <p className="text-[#C8A96E] font-mono text-base font-bold tracking-wider">{leadId}</p>
        <p className="text-[10px] text-zinc-400 mt-1">Our showroom team aims to respond within 2 business hours.</p>
      </div>

      {/* Immediate WhatsApp Action */}
      <a 
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-[0_4px_16px_rgba(200,169,110,0.25)] flex items-center justify-center gap-2 group"
      >
        <span>Instant WhatsApp Connect</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
      
      <p className="text-[11px] text-zinc-500 mt-4">
        Direct showroom desk: <span className="text-zinc-300 font-medium">+91 98351 90738</span>
      </p>
    </div>
  );
}
