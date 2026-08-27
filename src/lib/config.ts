/**
 * Showroom configuration constants.
 * All contact links and WhatsApp messages are sourced from here.
 * ⚠️ SHOWROOM_MAP_URL: Confirm with Mukesh before production deploy.
 */

export const SHOWROOM_PHONE_HREF = "tel:+919835190738";
export const SHOWROOM_PHONE_DISPLAY = "+91 98351 90738";
export const SHOWROOM_WHATSAPP_NUMBER = "919835190738";

export const SHOWROOM_DEFAULT_WA_MESSAGE =
  "Hi, I\u2019m interested in Hardware Collection\u2019s collections. I\u2019d like to know more.";

/**
 * Google Maps link for the showroom.
 * Source from env var NEXT_PUBLIC_SHOWROOM_MAP_URL, or fall back to the
 * currently known short link. Confirm before shipping.
 */
export const SHOWROOM_MAP_URL =
  process.env.NEXT_PUBLIC_SHOWROOM_MAP_URL ??
  "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9";

/** Builds a WhatsApp deep-link with an optional custom message. */
export function buildWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message ?? SHOWROOM_DEFAULT_WA_MESSAGE);
  return `https://wa.me/${SHOWROOM_WHATSAPP_NUMBER}?text=${text}`;
}
