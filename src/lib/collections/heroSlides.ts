import { categoryRails, showroomGroupId, showroomHref } from "./showroom";
import { HERO_FALLBACK_IMAGE, HERO_MAX_OFFERS, HERO_MAX_SLIDES_HOME, formatOfferDate } from "./offers";
import type { HeroManagerSlide, HeroSlideKind } from "@/types/hero";

/** A slide an editor chose in Hero Manager, resolved for one page, with where it asked to sit. */
export interface PlacedSlide<S> {
  kind: HeroSlideKind;
  position?: number | null;
  slide: S;
}

/**
 * The Hero Manager slides for a page: those whose reference or content is
 * complete, at most `maxOffers` offers, in the order the editor arranged them.
 */
export function usableManagerSlides<S>(
  slides: readonly HeroManagerSlide[] | null | undefined,
  resolve: (slide: HeroManagerSlide, index: number) => S | null,
  maxOffers = HERO_MAX_OFFERS
): PlacedSlide<S>[] {
  const out: PlacedSlide<S>[] = [];
  let offers = 0;
  (slides ?? []).forEach((raw, index) => {
    const slide = resolve(raw, index);
    if (!slide) return;
    if (raw.slideType === "offer" && ++offers > maxOffers) return;
    out.push({ kind: raw.slideType, position: raw.position, slide });
  });
  return out;
}

/**
 * Builds a hero carousel from the page's own slides and the editor's. With none
 * from the editor the page's own slides are returned untouched. Otherwise the
 * editor's slides take slots from the end of the page's own (six slides at most);
 * those with a `position` land on that slot and the rest sit between the page's own.
 */
export function placeHeroSlides<T, U>(
  own: readonly T[],
  placed: readonly PlacedSlide<U>[],
  maxSlides = HERO_MAX_SLIDES_HOME
): (T | U)[] {
  if (placed.length === 0) return [...own];
  const kept = placed.slice(0, maxSlides);
  const ownKept = own.slice(0, Math.max(maxSlides - kept.length, 0));
  const floating = kept.filter((p) => !p.position).map((p) => p.slide);

  // Floating slides alternate with the page's own: own, extra, own, extra, ...
  const out: (T | U)[] = [];
  let o = 0;
  let f = 0;
  while (o < ownKept.length || f < floating.length) {
    const takeOwn = o < ownKept.length && (f >= floating.length || out.length % 2 === 0);
    out.push(takeOwn ? ownKept[o++] : floating[f++]);
  }

  // Pinned slides go in last, lowest slot first, so each lands where it asked.
  const pinned = kept.filter((p) => p.position).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  for (const p of pinned) out.splice(Math.min((p.position as number) - 1, out.length), 0, p.slide);
  return out;
}

const isExternal = (url: string) => /^https?:\/\//i.test(url);
const offerWhen = (validUntil?: string | null) =>
  validUntil ? `Current offer · until ${formatOfferDate(validUntil)}` : "Current offer";

/** The category's anchor on /collections, as the family it is filed under. */
function collectionAnchor(slug: string | null | undefined, primaryRail: string | null | undefined) {
  const groupId = showroomGroupId(slug, categoryRails(slug ? [{ slug, primaryRail }] : []));
  return { groupId, href: showroomHref(groupId) };
}

/** A slide as the /collections hero draws it. */
export interface CollectionsHeroSlide {
  id: string;
  title: string;
  tagline: string;
  image: string;
  /** An offer slide enquires about the offer on WhatsApp instead of opening a collection. */
  offerHref?: string;
  /** Any other slide that links somewhere: its button label and target. */
  href?: string;
  ctaLabel?: string;
  external?: boolean;
}

export function toCollectionsHeroSlide(
  slide: HeroManagerSlide,
  index: number,
  offerEnquiryHref: (offerTitle: string) => string
): CollectionsHeroSlide | null {
  const id = `manager-${index}`;
  switch (slide.slideType) {
    case "offer": {
      const o = slide.offer;
      if (!o?.title) return null;
      return {
        id,
        title: o.title,
        tagline: offerWhen(o.validUntil),
        image: o.imageUrl || HERO_FALLBACK_IMAGE,
        offerHref: offerEnquiryHref(o.title),
      };
    }
    case "collection": {
      const c = slide.collection;
      if (!c?.name) return null;
      const { groupId } = collectionAnchor(c.slug, c.primaryRail);
      return {
        id,
        title: c.name,
        tagline: c.description || "Collection",
        image: c.imageUrl || HERO_FALLBACK_IMAGE,
        href: `#${groupId}`,
        ctaLabel: `Explore ${c.name}`,
      };
    }
    case "brand": {
      const b = slide.brand;
      if (!b?.name) return null;
      return {
        id,
        title: b.name,
        tagline: "Authorised brand",
        image: HERO_FALLBACK_IMAGE,
        href: b.slug ? `/catalogues?brand=${b.slug}` : "/catalogues",
        ctaLabel: `${b.name} catalogue`,
      };
    }
    default: {
      if (!slide.title) return null;
      const link = slide.link?.trim();
      return {
        id,
        title: slide.title,
        tagline: slide.subtitle || "Featured",
        image: slide.imageDesktop || HERO_FALLBACK_IMAGE,
        ...(link ? { href: link, ctaLabel: "Learn more", external: isExternal(link) } : {}),
      };
    }
  }
}

/** A slide as the home hero stage draws it (a `HeroSlide` from types/hero). */
export interface HomeHeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  ctaTarget: string;
  imageUrl: string;
  specimenLabel?: string;
  specimenCaption?: string;
}

export function toHomeHeroSlide(
  slide: HeroManagerSlide,
  index: number,
  offerEnquiryHref: (offerTitle: string) => string
): HomeHeroSlide | null {
  const id = `manager-${index}`;
  switch (slide.slideType) {
    case "offer": {
      const o = slide.offer;
      if (!o?.title) return null;
      return {
        id,
        eyebrow: o.validUntil ? `CURRENT OFFER · UNTIL ${formatOfferDate(o.validUntil).toUpperCase()}` : "CURRENT OFFER",
        title: o.title,
        description: o.description || "Ask our Sakchi showroom team for details and availability.",
        primaryCta: "Enquire about this offer",
        ctaTarget: offerEnquiryHref(o.title),
        imageUrl: o.imageUrl || HERO_FALLBACK_IMAGE,
        specimenLabel: "Current offer",
        specimenCaption: o.brandName || "Hardware Collection · Sakchi",
      };
    }
    case "collection": {
      const c = slide.collection;
      if (!c?.name) return null;
      return {
        id,
        eyebrow: "COLLECTION",
        title: c.name,
        description: c.description || "See it at our Sakchi showroom.",
        primaryCta: `Explore ${c.name}`,
        ctaTarget: collectionAnchor(c.slug, c.primaryRail).href,
        imageUrl: c.imageUrl || HERO_FALLBACK_IMAGE,
        specimenLabel: "Collection",
        specimenCaption: c.name,
      };
    }
    case "brand": {
      const b = slide.brand;
      if (!b?.name) return null;
      return {
        id,
        eyebrow: "AUTHORISED BRAND",
        title: b.name,
        description: `Browse the ${b.name} catalogue, or see the range at our Sakchi showroom.`,
        primaryCta: `${b.name} catalogue`,
        ctaTarget: b.slug ? `/catalogues?brand=${b.slug}` : "/catalogues",
        imageUrl: HERO_FALLBACK_IMAGE,
        specimenLabel: "Brand",
        specimenCaption: b.name,
      };
    }
    default: {
      if (!slide.title) return null;
      return {
        id,
        eyebrow: "HARDWARE COLLECTION · SAKCHI",
        title: slide.title,
        description: slide.subtitle || "",
        primaryCta: "Learn more",
        ctaTarget: slide.link?.trim() || "/collections",
        imageUrl: slide.imageDesktop || HERO_FALLBACK_IMAGE,
      };
    }
  }
}
