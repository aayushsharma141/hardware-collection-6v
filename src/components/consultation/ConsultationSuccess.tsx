"use client";

import React from "react";
import { ArrowRight, Check, PhoneCall } from "lucide-react";
import { motion } from "motion/react";
import { buildWhatsAppUrl, SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY } from "@/lib/config";

interface ConsultationSuccessProps {
  leadId: string;
}

export function ConsultationSuccess({ leadId }: ConsultationSuccessProps) {
  // WhatsApp direct link with Reference ID
  const waUrl = buildWhatsAppUrl(
    `Hi Hardware Collection Sakchi, I just submitted an enquiry on your website. My Reference ID is ${leadId}.`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center max-w-md mx-auto font-dmsans"
    >
      {/* Quiet Gold Icon Badge */}
      <div className="w-12 h-12 rounded-full bg-[#C8A96E]/10 border border-[var(--accent)]/30 flex items-center justify-center mb-5">
        <Check className="w-5 h-5 text-[var(--accent)]" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-2">
        HARDWARE COLLECTION · SAKCHI
      </p>

      <h3
        className="font-cormorant text-2xl sm:text-3xl font-normal text-[var(--text-primary)] mb-2"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Enquiry Received
      </h3>

      <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-6 leading-relaxed">
        Thank you. Our team will contact you shortly.
      </p>

      {/* Reference ID Card */}
      <div className="bg-[var(--surface-raised)]/60 border border-[var(--border)]/80 rounded-xl p-3.5 mb-6 w-full text-center">
        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1 font-semibold">REFERENCE ID</p>
        <p className="text-[var(--accent)] font-mono text-sm sm:text-base font-bold tracking-wider">{leadId}</p>
      </div>

      {/* Action Buttons Row: WhatsApp Us · Call Now */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#e5c487] hover:from-[#d8b97e] hover:to-[#f0d49e] text-[#0E0C0C] font-bold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 group"
        >
          <span>WhatsApp Us</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>

        <a
          href={SHOWROOM_PHONE_HREF}
          className="flex-1 py-3 px-5 rounded-full bg-[var(--surface-raised)] border border-zinc-700 hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--text-primary)] font-semibold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Call Now</span>
        </a>
      </div>

      <p className="text-[11px] text-[var(--text-secondary)] mt-5">
        Direct showroom desk: <span className="text-[var(--text-primary)] font-medium">{SHOWROOM_PHONE_DISPLAY}</span>
      </p>
    </motion.div>
  );
}

