export interface SpaceInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  linkedCategorySlugs: string[]; // must be real slugs from src/data/catalog.ts CATEGORIES
  displayOrder: number;
}

export const SPACES: SpaceInfo[] = [
  {
    id: "kitchen",
    slug: "kitchen",
    name: "Kitchen",
    description: "German-engineered soft-close fittings and sinks for the modular kitchen.",
    linkedCategorySlugs: [
      "modular-kitchen-hardware",
      "kitchen-sinks-faucets",
      "hinges-soft-close",
      "drawer-channels",
    ],
    displayOrder: 0,
  },
  {
    id: "entrance",
    slug: "entrance",
    name: "Entrance",
    description: "Grand entrance handles, biometric locks and architectural security for the front door.",
    linkedCategorySlugs: [
      "main-door-handles",
      "digital-locks",
      "mortise-door-locks",
      "door-closers-stoppers",
      "glass-hardware",
    ],
    displayOrder: 1,
  },
  {
    id: "wardrobe",
    slug: "wardrobe",
    name: "Wardrobe",
    description: "Silent sliding systems, concealed hinges and precision drawer runners for wardrobes.",
    linkedCategorySlugs: [
      "wardrobe-hardware-sliding",
      "cabinet-wardrobe-handles",
      "hinges-soft-close",
      "drawer-channels",
    ],
    displayOrder: 2,
  },
  {
    id: "bathroom",
    slug: "bathroom",
    name: "Bathroom",
    description: "Luxury shower fittings, mirrors and frameless glass for the bathroom.",
    linkedCategorySlugs: ["bathroom-accessories", "glass-hardware"],
    displayOrder: 3,
  },
  {
    id: "living-interior",
    slug: "living-interior",
    name: "Living / Interior",
    description: "Furniture fittings and integrated security for living and interior spaces.",
    linkedCategorySlugs: ["cabinet-wardrobe-handles", "drawer-channels", "safes"],
    displayOrder: 4,
  },
  {
    id: "commercial",
    slug: "commercial",
    name: "Commercial",
    description: "Heavy-duty door controls, glass systems and safes for commercial properties.",
    linkedCategorySlugs: ["safes", "door-closers-stoppers", "glass-hardware"],
    displayOrder: 5,
  },
];
