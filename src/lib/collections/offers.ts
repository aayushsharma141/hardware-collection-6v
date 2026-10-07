import type { Offer } from "@/types/catalog";



/** Used when an offer has no image of its own, so a hero slide is never blank. */
export const OFFER_HERO_FALLBACK_IMAGE = "/cinema/showroom/interior.png";

/** "2026-11-15" -> "15 Nov 2026", read as a calendar date so no timezone can shift it. */
export function formatOfferDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
