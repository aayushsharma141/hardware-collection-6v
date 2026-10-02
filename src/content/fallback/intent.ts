export interface IntentZone {
  id: string;
  name: string;
  description?: string;
  keywords: { label: string; href: string }[];
  exploreHref?: string;
  image: string;
  className: string; // Used for grid spanning
}

export const INTENT_ZONES: IntentZone[] = [
  {
    id: "door-entry",
    name: "Door & Entry",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=85&w=1200", // Sleek door handle macro
    className: "lg:col-span-8 h-[400px] lg:h-[500px]",
    exploreHref: "?intent=door-entry#catalog",
    keywords: [
      { label: "Main Door Handles", href: "?category=main-door-handles#catalog" },
      { label: "Mortise Locks", href: "?category=mortise-door-locks#catalog" },
      { label: "Door Closers", href: "?category=door-closers-stoppers#catalog" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=85&w=800", // Elegant kitchen hardware
    className: "lg:col-span-4 h-[400px] lg:h-[500px]",
    exploreHref: "?intent=kitchen#catalog",
    keywords: [
      { label: "Sinks & Faucets", href: "?category=kitchen-sinks-faucets#catalog" },
      { label: "Hinges & Soft-Close", href: "?category=hinges-soft-close#catalog" },
      { label: "Drawer Channels", href: "?category=drawer-channels#catalog" },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=85&w=800", // Premium bathroom fitting
    className: "lg:col-span-5 h-[400px] lg:h-[460px]",
    exploreHref: "?intent=bathroom#catalog",
    keywords: [
      { label: "Accessories", href: "?category=bathroom-accessories#catalog" },
      { label: "Fittings", href: "?category=bathroom-accessories#catalog" },
    ],
  },
  {
    id: "wardrobe-furniture",
    name: "Wardrobe & Furniture",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=85&w=1200", // High-end wardrobe / pull
    className: "lg:col-span-7 h-[400px] lg:h-[460px]",
    exploreHref: "?intent=wardrobe-furniture#catalog",
    keywords: [
      { label: "Cabinet Handles", href: "?category=cabinet-wardrobe-handles#catalog" },
      { label: "Sliding Systems", href: "?category=wardrobe-hardware-sliding#catalog" },
      { label: "Furniture Fittings", href: "?category=drawer-channels#catalog" },
    ],
  },
  {
    id: "glass-architectural",
    name: "Glass & Architectural",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1200", // Glass partition/fittings
    className: "lg:col-span-7 h-[400px] lg:h-[460px]",
    exploreHref: "?intent=glass-architectural#catalog",
    keywords: [
      { label: "Glass Hardware", href: "?category=glass-hardware#catalog" },
      { label: "Door Systems", href: "?category=door-closers-stoppers#catalog" },
    ],
  },
  {
    id: "security",
    name: "Security",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=85&w=800", // Electronic lock / modern security
    className: "lg:col-span-5 h-[400px] lg:h-[460px]",
    exploreHref: "?intent=security#catalog",
    keywords: [
      { label: "Digital Locks", href: "?category=digital-locks#catalog" },
      { label: "Safes", href: "?category=safes#catalog" },
    ],
  },
];
