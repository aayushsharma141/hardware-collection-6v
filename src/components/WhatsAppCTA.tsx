"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppCTA({ message, phoneNumber }: { message?: string, phoneNumber?: string }) {
  const defaultMessage = "Hi Hardware Collection, I am visiting your website and would like to inquire about architectural hardware.";
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  const targetPhone = phoneNumber || "919835190738";
  
  return (
    <>
      {/* Desktop Floating Button */}
      <a
        href={`https://wa.me/${targetPhone}?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3 bg-[#25D366] text-black font-body font-bold text-xs px-4 py-3 shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-all group"
      >
        <MessageCircle className="w-5 h-5 fill-black" />
        <span className="uppercase tracking-wider">Chat on WhatsApp</span>
      </a>

      {/* Mobile Persistent Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 bg-white border-t border-[var(--color-glass-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <a
          href={`tel:+${targetPhone}`}
          className="flex-1 flex items-center justify-center font-body font-bold text-xs uppercase tracking-wider text-black border-r border-[var(--color-glass-border)] active:bg-gray-50"
        >
          Call Us
        </a>
        <a
          href={`https://wa.me/${targetPhone}?text=${encodedMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-black font-body font-bold text-xs uppercase tracking-wider active:bg-[#20b858]"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          WhatsApp
        </a>
      </div>
    </>
  );
}
