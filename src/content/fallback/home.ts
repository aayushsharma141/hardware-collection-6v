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
 * `href` is an in-page anchor on the one catalogue route, `/collections`. There
 * are no per-family or per-category pages, so a tile links to the showroom
 * group its products are shown under (see `@/lib/collections/showroom`). There is
 * one family per group — two tiles that lead to the same place would promise two
 * different things and deliver one — and the homepage shows only the families
 * whose group has products (see `resolveFamilies`).
 */

import { showroomHref } from "@/lib/collections/showroom";

export interface CategoryFamily {
  id: string;
  /** The showroom group this family leads to — one family per group. */
  groupId: string;
  /** Position within the set, e.g. "01" — rendered on desktop only. */
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
    id: "door",
    groupId: "door",
    index: "01",
    name: "Door",
    nameBreak: "Hardware",
    subtitle: "Handles, mortise locks and the controls that make up a door.",
    detail: "Solid forged brass pull handle, PVD Rose Gold.",
    image: "/cinema/categories/HC-03-DOORS.png",
    isFocal: true,
    href: showroomHref("door"),
  },
  {
    id: "smart-security",
    groupId: "smart-security",
    index: "02",
    name: "Smart &",
    nameBreak: "Security",
    subtitle: "Digital and biometric locks, smart access and safes.",
    detail: "Dorset biometric deadbolt & Godrej fingerprint lock.",
    image: "/cinema/categories/HC-03-SECURITY.png",
    href: showroomHref("smart-security"),
  },
  {
    id: "kitchen",
    groupId: "kitchen",
    index: "03",
    name: "Kitchen",
    nameBreak: "Hardware",
    subtitle: "German soft-close drawer fittings, sinks and faucets.",
    detail: "Hafele Matrix Box tandem drawer & Labacha quartz sink.",
    image: "/cinema/categories/HC-03-KITCHEN.png",
    href: showroomHref("kitchen"),
  },
  {
    id: "wardrobe-furniture",
    groupId: "wardrobe-furniture",
    index: "04",
    name: "Wardrobe",
    nameBreak: "& Furniture",
    subtitle: "Sliding systems, cabinet and wardrobe handles, and fittings.",
    detail: "Hettich TopLine XL sliding system.",
    image: "/cinema/categories/HC-03-WARDROBE.png",
    href: showroomHref("wardrobe-furniture"),
  },
  {
    id: "bathroom-hardware",
    groupId: "bathroom-hardware",
    index: "05",
    name: "Bathroom",
    nameBreak: "Hardware",
    subtitle: "Bathroom accessories, mirrors and stainless steel fittings.",
    detail: "Coordinated stainless steel towel bars, hooks and shelving.",
    image: "/cinema/categories/HC-03-BATHROOM.png",
    href: showroomHref("bathroom-hardware"),
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
    href: showroomHref("door"),
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
    href: showroomHref("door"),
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
    href: showroomHref("smart-security"), // category: digital-locks
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
    href: showroomHref("kitchen"),
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
    href: showroomHref("wardrobe-furniture"), // category: cabinet-wardrobe-handles
    blurb:
      "Small-format knobs in matte gold — the detail a kitchen is read by, and the one most often chosen from a photograph rather than in the hand.",
    statement:
      "The detail a kitchen is read by, and the one most often chosen from a photograph.",
    sweepDelay: "4s",
  },
];
