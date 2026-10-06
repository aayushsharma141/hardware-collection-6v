import type { Offer } from "@/types/catalog";

/** A page whose hero can carry offers; the values are what the Studio stores. */
export type HeroPlacement = "home" | "collections";

/** Offers per hero, and slides per hero in all. Offers fill the rest with the page's own slides. */
export const HERO_MAX_OFFERS = 3;
export const HERO_MAX_SLIDES = 6;

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

const last = (n: number | undefined | null) => (typeof n === "number" ? n : Number.POSITIVE_INFINITY);

/**
 * The offers an editor ticked for this page's hero. When more than `max` are
 * ticked, the lowest "hero order" wins; ties go to the offer ending soonest,
 * then to the title, so the choice never flickers between renders.
 */
export function pickHeroOffers(offers: readonly Offer[], placement: HeroPlacement, max = HERO_MAX_OFFERS): Offer[] {
  return offers
    .filter((o) => o.heroPlacement?.includes(placement))
    .sort(
      (a, b) =>
        last(a.heroOrder) - last(b.heroOrder) ||
        (a.validUntil ?? "9999-12-31").localeCompare(b.validUntil ?? "9999-12-31") ||
        a.title.localeCompare(b.title)
    )
    .slice(0, max);
}

/**
 * The page's own slides with offers woven in (own, offer, own, offer, ...),
 * capped at `maxSlides`. Offers take slots from the end of the page's own
 * slides. With no offers the hero is returned untouched, so a page that has no
 * offers ticked looks exactly as it did before.
 */
export function weaveHeroSlides<T, U>(own: readonly T[], offers: readonly U[], maxSlides = HERO_MAX_SLIDES): (T | U)[] {
  if (offers.length === 0) return [...own];
  const offerCount = Math.min(offers.length, maxSlides);
  const ownKept = own.slice(0, Math.max(maxSlides - offerCount, 0));
  const out: (T | U)[] = [];
  let o = 0;
  let w = 0;
  while (o < ownKept.length || w < offerCount) {
    const takeOwn = o < ownKept.length && (w >= offerCount || out.length % 2 === 0);
    out.push(takeOwn ? ownKept[o++] : offers[w++]);
  }
  return out;
}
