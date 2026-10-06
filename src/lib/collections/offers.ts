/** Offers per hero, and slides per hero in all. Hero Manager slides take slots from the page's own. */
export const HERO_MAX_OFFERS = 3;
export const HERO_MAX_SLIDES = 6;

/** Used when a hero slide has no image of its own, so it is never blank. */
export const HERO_FALLBACK_IMAGE = "/cinema/showroom/interior.png";

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
