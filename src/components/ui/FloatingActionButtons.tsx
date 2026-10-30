"use client";

import { buildWhatsAppUrl, generateWhatsAppUrl, SHOWROOM_PHONE_HREF } from "@/lib/config";
import { Phone } from "lucide-react";

export interface FloatingActionButtonsProps {
  phone?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
}

export function FloatingActionButtons({
  phone,
  whatsappNumber,
  defaultMessage,
}: FloatingActionButtonsProps = {}) {
  const callHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : SHOWROOM_PHONE_HREF;
  const whatsappHref = defaultMessage
    ? buildWhatsAppUrl(defaultMessage, whatsappNumber)
    : generateWhatsAppUrl("general-enquiry", undefined, whatsappNumber);

  return (
    <div className="floating-action-buttons fixed bottom-6 right-6 z-[80] flex flex-col gap-3 lg:hidden">
      {/* Call Button */}
      <a
        href={callHref}
        className="w-12 h-12 rounded-none flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] shadow-sm hover:shadow-md active:scale-[0.97] transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out"
        aria-label="Call Us"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-none flex items-center justify-center bg-[#25D366] text-white shadow-sm hover:shadow-md active:scale-[0.97] transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.777-.877-2.052-.977-.275-.1-.475-.15-.675.15-.2.3-.775.977-.95 1.177-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.131-.611.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.584-.492-.505-.675-.514-.175-.009-.375-.009-.575-.009-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.124 4.53.716.31 1.275.495 1.71.633.72.228 1.375.196 1.893.118.577-.087 1.777-.726 2.027-1.428.25-.702.25-1.303.175-1.428-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>
    </div>
  );
}
