/**
 * Home page content that more than one viewport renders.
 *
 * Desktop and mobile previously each carried their own copy of the showroom
 * families and the signature pieces, and the two had drifted: mobile listed
 * three families under different names and pointed them at `/categories/*`
 * routes that do not exist, and its product cards named pieces that are in no
 * catalog. One source keeps the two viewports describing the same showroom.
 *
 * Every brand named here is on the authorized dealership roster, and every
 * `href` resolves to one of the 11 routable `/collections/[slug]` pages.
 *
 * The five showroom families link to their own family pages (Phase 12). Under
 * D-25 they pointed at spaces instead, because family pages did not exist yet
 * — which sent "Handles & Knobs" to Living / Interior and "Furniture Hardware"
 * to Wardrobe.
 */

export interface CategoryFamily {
  id: string;
  /** Position within the set, e.g. "01 / 05" — rendered on desktop only. */
  index: string;
  name: string;
  /** Second line of the display name, so the serif can break where intended. */
  nameBreak?: string;
  subtitle: string;
  /** A representative specimen from the family. */
  detail: string;
  image: string;
  isFocal?: boolean;
  href: string;
}

export const CATEGORY_FAMILIES: CategoryFamily[] = [
  {
    id: "handles",
    index: "01 / 05",
    name: "Handles",
    nameBreak: "& Knobs",
    subtitle: "Contemporary profiles to classical architectural detailing.",
    detail: "Solid forged brass pull handle, PVD Rose Gold.",
    image: "/cinema/categories/HC-03-DOORS.png",
    href: "/collections/handles-knobs",
  },
  {
    id: "door",
    index: "02 / 05",
    name: "Door",
    nameBreak: "Hardware",
    subtitle: "High-security locking systems and precision entrance controls.",
    detail: "Dorset biometric deadbolt & SS 304 mortise lockset.",
    image: "/cinema/categories/HC-03-SECURITY.png",
    isFocal: true,
    href: "/collections/door-hardware",
  },
  {
    id: "bathroom",
    index: "03 / 05",
    name: "Bathroom",
    subtitle: "Bathroom accessories, mirrors and stainless steel mirror cabinets.",
    detail: "Coordinated stainless steel towel bars, hooks and shelving.",
    image: "/cinema/categories/HC-03-BATHROOM.png",
    href: "/collections/bathroom-hardware",
  },
  {
    id: "kitchen",
    index: "04 / 05",
    name: "Kitchen",
    nameBreak: "& Wardrobes",
    subtitle: "German soft-close drawer fittings, sliding systems and quartz sinks.",
    detail: "Hafele Matrix Box tandem drawer & Labacha quartz sink.",
    image: "/cinema/categories/HC-03-KITCHEN.png",
    href: "/collections/kitchen-wardrobes",
  },
  {
    id: "furniture",
    index: "05 / 05",
    name: "Furniture",
    nameBreak: "Hardware",
    subtitle: "Concealed hinges, precision drawer runners and joinery fittings.",
    detail: "Hettich Sensys integrated soft-close hinge system.",
    image: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections/furniture-hardware",
  },
];

export interface SignaturePiece {
  index: string;
  name: string;
  brand: string;
  finish: string;
  category: string;
  img: string;
  href: string;
  /** Longer material- and mechanism-led copy, used where a card has room. */
  blurb: string;
  /**
   * The single strongest sentence from `blurb`, for surfaces where the
   * photograph leads and a paragraph would compete with it — the mobile
   * reel, where three stacked blurbs read as a wall of text under a
   * cinematic image.
   */
  statement: string;
  sweepDelay: string;
}

export const SIGNATURE_PIECES: SignaturePiece[] = [
  {
    index: "01",
    name: "Pull Handle",
    brand: "HÄFELE",
    finish: "Satin Stainless",
    category: "Door Hardware",
    img: "/cinema/categories/HC-03-DOORS.png",
    href: "/collections/door-hardware#main-door-handles",
    blurb:
      "Long-format entrance pulls in satin stainless — a low-reflectance surface that holds its finish under daily contact and reads quietly against timber, glass and stone.",
    statement:
      "A low-reflectance surface that holds its finish under daily contact.",
    sweepDelay: "0s",
  },
  {
    index: "02",
    name: "Mortice Handle",
    brand: "DORSET",
    finish: "Antique Brass",
    category: "Door Hardware",
    img: "/cinema/collection/HC-05-01.png",
    href: "/collections/door-hardware#mortise-door-locks",
    blurb:
      "Lever-on-rose mortice sets in antique brass, matched to the lock body and strike so the whole door schedule specifies as one line rather than three.",
    statement:
      "Lever, lock body and strike matched, so the door schedule specifies as one line.",
    sweepDelay: "1.5s",
  },
  {
    index: "03",
    name: "Biometric Lock",
    brand: "GODREJ",
    finish: "Graphite",
    category: "Digital Locks",
    img: "/cinema/categories/HC-03-SECURITY.png",
    href: "/collections/door-hardware#digital-locks",
    blurb:
      "Fingerprint, PIN and key access in one graphite body. Working units are on the wall in Sakchi — enrol a print and feel the throw before you specify it.",
    statement:
      "Fingerprint, PIN and key in one graphite body. Working units are on the wall in Sakchi.",
    sweepDelay: "3s",
  },
  {
    index: "04",
    name: "Soft-Close Channel",
    brand: "HETTICH",
    finish: "Galvanised Steel",
    category: "Cabinet Hardware",
    img: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections/kitchen-wardrobes#drawer-channels",
    blurb:
      "Full-extension runners with integrated soft-close damping. The difference between grades is in the last centimetre of travel, which is why we keep them loaded and open on display.",
    statement:
      "Full-extension runners — the difference between grades is the last centimetre of travel.",
    sweepDelay: "0.5s",
  },
  {
    index: "05",
    name: "Cabinet Knob",
    brand: "LABACHA",
    finish: "Matte Gold",
    category: "Cabinet Hardware",
    img: "/cinema/collection/HC-05-02.png",
    href: "/collections/handles-knobs#cabinet-wardrobe-handles",
    blurb:
      "Small-format knobs in matte gold — the detail a kitchen is read by, and the one most often chosen from a photograph rather than in the hand.",
    statement:
      "The detail a kitchen is read by, and the one most often chosen from a photograph.",
    sweepDelay: "4s",
  },
];
