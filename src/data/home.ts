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
 * `href` resolves to a real `/collections` filter.
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
    href: "/collections?category=handles-knobs",
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
    href: "/collections?category=door-hardware",
  },
  {
    id: "bathroom",
    index: "03 / 05",
    name: "Bathroom",
    subtitle: "Luxury shower fittings, mirrors and precision stainless steel suites.",
    detail: "Solid brass thermostatic shower suite, matte black.",
    image: "/cinema/categories/HC-03-BATHROOM.png",
    href: "/collections?category=bathroom",
  },
  {
    id: "kitchen",
    index: "04 / 05",
    name: "Kitchen",
    nameBreak: "& Wardrobes",
    subtitle: "German soft-close drawer fittings, sliding systems and quartz sinks.",
    detail: "Hafele Matrix Box tandem drawer & Labacha quartz sink.",
    image: "/cinema/categories/HC-03-KITCHEN.png",
    href: "/collections?category=kitchen-wardrobes",
  },
  {
    id: "furniture",
    index: "05 / 05",
    name: "Furniture",
    nameBreak: "Hardware",
    subtitle: "Concealed hinges, precision drawer runners and joinery fittings.",
    detail: "Hettich Sensys integrated soft-close hinge system.",
    image: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections?category=furniture-hardware",
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
    href: "/collections?category=door-hardware&brand=hafele",
    blurb:
      "Long-format entrance pulls in satin stainless — a low-reflectance surface that holds its finish under daily contact and reads quietly against timber, glass and stone.",
    sweepDelay: "0s",
  },
  {
    index: "02",
    name: "Mortice Handle",
    brand: "DORSET",
    finish: "Antique Brass",
    category: "Door Hardware",
    img: "/cinema/collection/HC-05-01.png",
    href: "/collections?category=door-hardware&brand=dorset",
    blurb:
      "Lever-on-rose mortice sets in antique brass, matched to the lock body and strike so the whole door schedule specifies as one line rather than three.",
    sweepDelay: "1.5s",
  },
  {
    index: "03",
    name: "Biometric Lock",
    brand: "GODREJ",
    finish: "Graphite",
    category: "Digital Locks",
    img: "/cinema/categories/HC-03-SECURITY.png",
    href: "/collections?category=digital-locks&brand=godrej",
    blurb:
      "Fingerprint, PIN and key access in one graphite body. Working units are on the wall in Sakchi — enrol a print and feel the throw before you specify it.",
    sweepDelay: "3s",
  },
  {
    index: "04",
    name: "Soft-Close Channel",
    brand: "HETTICH",
    finish: "Galvanised Steel",
    category: "Cabinet Hardware",
    img: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections?category=cabinet-hardware&brand=hettich",
    blurb:
      "Full-extension runners with integrated soft-close damping. The difference between grades is in the last centimetre of travel, which is why we keep them loaded and open on display.",
    sweepDelay: "0.5s",
  },
  {
    index: "05",
    name: "Towel Bar Set",
    brand: "KICH",
    finish: "Satin 304 SS",
    category: "Bathroom",
    img: "/cinema/categories/HC-03-BATHROOM.png",
    href: "/collections?category=bathroom&brand=kich",
    blurb:
      "Grade 304 stainless bath accessories in a satin finish, sized as a coordinated suite rather than assembled piece by piece.",
    sweepDelay: "2s",
  },
  {
    index: "06",
    name: "Cabinet Knob",
    brand: "LABACHA",
    finish: "Matte Gold",
    category: "Cabinet Hardware",
    img: "/cinema/collection/HC-05-02.png",
    href: "/collections?category=cabinet-hardware&brand=labacha",
    blurb:
      "Small-format knobs in matte gold — the detail a kitchen is read by, and the one most often chosen from a photograph rather than in the hand.",
    sweepDelay: "4s",
  },
];
