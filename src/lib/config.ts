/**
 * Showroom configuration constants.
 * All contact links and WhatsApp messages are sourced from here.
 * ⚠️ SHOWROOM_MAP_URL: Confirm with Mukesh before production deploy.
 */

export const SHOWROOM_PHONE_HREF = "tel:+919835190738";
export const SHOWROOM_PHONE_DISPLAY = "+91 98351 90738";
export const SHOWROOM_SECONDARY_PHONE_HREF = "tel:+917033650739";
export const SHOWROOM_SECONDARY_PHONE_DISPLAY = "+91 70336 50739";
export const SHOWROOM_WHATSAPP_NUMBER = "919835190738";
export const SHOWROOM_ADDRESS = "1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001";

/** Used only when Site Settings is unreachable; Studio's showroomHours is the source of truth. */
export const SHOWROOM_HOURS_FALLBACK = "Wed–Mon: 10:00 AM – 8:00 PM\nTuesday: 10:00 AM – 2:00 PM";

/** Owner-facing stats (Trust signals) */
export const SHOWROOM_YEARS_OF_TRUST = 10;
export const SHOWROOM_BRAND_COUNT = 20;

export const SHOWROOM_DEFAULT_WA_MESSAGE =
  "Hi, I\u2019m interested in Hardware Collection\u2019s collections. I\u2019d like to know more.";

/**
 * Google Maps link for the showroom.
 * Source from env var NEXT_PUBLIC_SHOWROOM_MAP_URL, or fall back to the
 * currently known short link. Confirm before shipping.
 */
export const SHOWROOM_MAP_URL =
  process.env.NEXT_PUBLIC_SHOWROOM_MAP_URL ??
  "https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur";

/** Builds a WhatsApp deep-link with an optional custom message. */
export function buildWhatsAppUrl(message?: string, number?: string): string {
  const text = encodeURIComponent(message ?? SHOWROOM_DEFAULT_WA_MESSAGE);
  return `https://wa.me/${number || SHOWROOM_WHATSAPP_NUMBER}?text=${text}`;
}

/** Generates a WhatsApp URL based on a CTA intent and context. */
export function generateWhatsAppUrl(
  ctaType?: string,
  contextName?: string,
  number?: string
): string {
  let message = SHOWROOM_DEFAULT_WA_MESSAGE;

  if (ctaType === "product-enquiry" && contextName) {
    message = `Hi, I'm interested in the ${contextName}.`;
  } else if (ctaType === "category-enquiry" && contextName) {
    message = `Hi, I'm looking for ${contextName} solutions.`;
  } else if (ctaType === "brand-enquiry" && contextName) {
    message = `Hi, I want to explore ${contextName} products.`;
  } else if (ctaType === "showroom-visit") {
    message = `Hi, I'd like to schedule a showroom consultation.`;
  } else if (ctaType === "general-enquiry") {
    message = SHOWROOM_DEFAULT_WA_MESSAGE;
  }

  return buildWhatsAppUrl(message, number);
}
