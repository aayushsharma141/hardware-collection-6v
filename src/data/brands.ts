import { Brand } from "@/types/catalog";

export interface BrandInfo {
  id: string;
  name: string;
  country: string;
  tier: string;
  authorized: boolean;
  logo: string;
  website?: string | null;
  tagline: string;
  description: string;
  establishedYear?: string;
  heroImage?: string;
  keyHighlights: string[];
  imageClass?: string;
}

export const CANONICAL_BRANDS: BrandInfo[] = [
  {
    id: "hafele",
    name: "Hafele",
    country: "Germany",
    tier: "Ultra Luxury Architectural & Modular Kitchen",
    authorized: true,
    logo: "/brands/Hafele.png",
    website: "https://www.hafeleindia.com/",
    tagline: "German Architectural & Kitchen Hardware",
    description: "Hafele is a world-renowned German manufacturer of architectural hardware, furniture fittings, and electronic access control systems.",
    establishedYear: "1923",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: ["German Precision", "Matrix Box", "3D Hinges", "Biometric Locks"]
  },
  {
    id: "blum",
    name: "Blum",
    country: "Austria",
    tier: "Premium Kitchen & Cabinet Hardware",
    authorized: true,
    logo: "/brands/Blum_logo.svg",
    website: "https://www.blum.com/in/en/",
    tagline: "Perfecting Motion",
    description: "Blum is an international company that specializes in the production of functional furniture fittings.",
    keyHighlights: ["Lift Systems", "Hinge Systems", "Pull-out Systems"]
  },
  {
    id: "dorset",
    name: "Dorset",
    country: "India / Global",
    tier: "High-End Architectural Locks & Security",
    authorized: true,
    logo: "/brands/dorset-seeklogo.svg",
    website: "https://www.dorsetindia.com/",
    tagline: "Digital Locks & Architectural Mortise",
    description: "Dorset is a premier provider of door controls, locksets, digital security systems, and architectural ironmongery.",
    establishedYear: "1995",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: ["SS 304 Handle Sets", "Biometric Locks", "200,000 Cycle Durability"]
  },
  {
    id: "pans",
    name: "Pans",
    country: "Global",
    tier: "Premium Hardware",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Premium Hardware Solutions",
    description: "Pans provides premium hardware and fittings.",
    keyHighlights: ["Quality Hardware", "Durability"]
  },
  {
    id: "geze",
    name: "Geze",
    country: "Germany",
    tier: "Door, Window & Safety Technology",
    authorized: true,
    logo: "/brands/GEZE_Logo_RGB.png",
    website: "https://www.geze.in/",
    tagline: "Connecting expertise - building solutions",
    description: "GEZE is one of the world's leading developers and manufacturers of construction systems for door, window and safety technology.",
    keyHighlights: ["Automatic Doors", "Door Closers", "Glass Systems"]
  },
  {
    id: "ozone",
    name: "Ozone",
    country: "India",
    tier: "Architectural Hardware & Security",
    authorized: true,
    logo: "/brands/ozone.webp",
    website: "https://www.ozone-india.com/",
    tagline: "Safe & Secure",
    description: "Ozone is a leading player in Architectural Hardware and Security Solutions.",
    keyHighlights: ["Glass Fittings", "Door Hardware", "Safes"],
    imageClass: "brightness-0 invert opacity-90",
  },
  {
    id: "backer",
    name: "Backer",
    country: "Global",
    tier: "Architectural Solutions",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Quality Architectural Hardware",
    description: "Backer provides robust architectural solutions.",
    keyHighlights: ["Durability", "Design"]
  },
  {
    id: "helix",
    name: "Helix",
    country: "Global",
    tier: "Advanced Hardware",
    authorized: true,
    logo: "/brands/heliex.webp",
    website: null,
    tagline: "Next-Gen Hardware",
    description: "Helix manufactures advanced hardware solutions for modern architecture.",
    keyHighlights: ["Advanced Systems", "Durability"]
  },
  {
    id: "tattva",
    name: "Tattva",
    country: "India",
    tier: "Premium Hardware",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Excellence in Hardware",
    description: "Tattva offers a range of high-quality hardware products.",
    keyHighlights: ["Premium Quality", "Modern Design"]
  },
  {
    id: "yale",
    name: "Yale",
    country: "Global",
    tier: "Smart Security & Locks",
    authorized: true,
    logo: "/brands/Yale_logo.svg",
    website: "https://www.yalehome.com/in/en",
    tagline: "The world's favorite lock",
    description: "Yale protects millions of homes and businesses worldwide and is the brand behind locks of every design and function.",
    keyHighlights: ["Smart Locks", "Safes", "Padlocks", "Alarms"]
  },
  {
    id: "labacha",
    name: "Labacha",
    country: "Italy / India",
    tier: "Luxury Quartz Sinks & Precision Faucets",
    authorized: true,
    logo: "/brands/labacha_logo.webp",
    website: "https://labachaindia.com/",
    tagline: "Luxury Granite Sinks & Bath Mixers",
    description: "Labacha brings Italian-inspired quartz composite granite sinks, workstation kitchen sinks, and luxury bathroom mixers to modern living spaces.",
    establishedYear: "2010",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: ["Quartz Composite", "Heat & Scratch Resistant", "360° Faucets", "Nano-Coating"]
  },
  {
    id: "rexton",
    name: "Rexton",
    country: "Global",
    tier: "Architectural Hardware",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Reliable Hardware Solutions",
    description: "Rexton provides reliable architectural hardware.",
    keyHighlights: ["Durability", "Precision"]
  },
  {
    id: "liftor",
    name: "Liftor",
    country: "Global",
    tier: "Ergonomic Furniture Solutions",
    authorized: true,
    logo: "/brands/Liftor.png",
    website: null,
    tagline: "Ergonomic Excellence",
    description: "Liftor specializes in height-adjustable desks and ergonomic furniture solutions.",
    keyHighlights: ["Standing Desks", "Ergonomics", "Smart Office"]
  },
  {
    id: "taco",
    name: "Taco",
    country: "Global",
    tier: "Premium Hardware",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Quality Hardware",
    description: "Taco provides a range of quality hardware solutions.",
    keyHighlights: ["Quality", "Design"]
  },
  {
    id: "madhuram",
    name: "Madhuram",
    country: "India",
    tier: "Hardware Solutions",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Reliable Hardware",
    description: "Madhuram offers a variety of hardware fittings.",
    keyHighlights: ["Reliability", "Durability"]
  },
  {
    id: "shapes",
    name: "Shapes",
    country: "Global",
    tier: "Architectural Accents",
    authorized: true,
    logo: "/brands/Shapes_logo_dark-1-768x224.png",
    website: null,
    tagline: "Defined by Design",
    description: "Shapes offers modern architectural hardware and elegant design accents.",
    keyHighlights: ["Modern Hardware", "Minimalist Design"]
  },
  {
    id: "furnipart",
    name: "Furnipart",
    country: "Denmark",
    tier: "Premium Cabinet Hardware",
    authorized: true,
    logo: "",
    website: "https://www.furnipart.com/",
    tagline: "Danish Design",
    description: "Furnipart designs and manufactures high-quality handles for the furniture industry.",
    keyHighlights: ["Danish Design", "Premium Finishes"]
  },
  {
    id: "marnello",
    name: "Marnello",
    country: "Global",
    tier: "Hardware Solutions",
    authorized: true,
    logo: "",
    website: null,
    tagline: "Hardware Excellence",
    description: "Marnello offers a comprehensive range of hardware products.",
    keyHighlights: ["Excellence", "Durability"]
  },
  {
    id: "godrej",
    name: "Godrej",
    country: "India",
    tier: "Enterprise & High-Trust Security Hardware",
    authorized: true,
    logo: "/brands/Godrej.svg",
    website: "https://www.godrejlocks.com/",
    tagline: "India's Trusted Smart Biometric Security",
    description: "Godrej Security Solutions is synonymous with unyielding trust and enterprise security in India.",
    establishedYear: "1897",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: ["Biometric Sensor", "Anti-Prise Locks", "Smart Mobile App", "Pan-India Service"]
  },
  {
    id: "decore",
    name: "Decore",
    country: "Global",
    tier: "Interior Finishes",
    authorized: true,
    logo: "/brands/decore.png",
    website: null,
    tagline: "Premium Finishes",
    description: "Decore provides high-quality interior finishes and hardware solutions.",
    keyHighlights: ["Finishes", "Cabinet Hardware"]
  },
  {
    id: "hettich",
    name: "Hettich",
    country: "Germany",
    tier: "German Furniture & Kitchen Fittings",
    authorized: true,
    logo: "/brands/Hettich.svg",
    website: "https://www.hettich.com/en-in/",
    tagline: "Fascin[action] German Furniture & Kitchen Fittings",
    description: "Hettich is a German family-owned manufacturer of furniture and kitchen fittings, engineering soft-close hinges, drawer runners, and sliding door systems used across the Modular Kitchen Hardware, Wardrobe Hardware & Sliding Systems, Hinges & Soft-Close Systems, and Drawer Channels collections.",
    keyHighlights: ["Sensys Soft-Close Hinges", "Quadro Drawer Runners", "Top-Running Sliding Systems"]
  },
  {
    id: "kich",
    name: "Kich",
    country: "India",
    tier: "Architectural Stainless Steel & Glass Hardware",
    authorized: true,
    logo: "/brands/kich_logo.svg",
    website: "https://www.kichindia.com/",
    tagline: "Architectural SS Hardware & Balustrade Systems",
    description: "Kich is an Indian manufacturer of architectural stainless steel hardware, frameless glass fittings, and balustrade systems, supplying the Main Door Handles, Cabinet & Wardrobe Handles, Bathroom Accessories, and Glass Hardware collections.",
    keyHighlights: ["AISI 316 Marine Grade Steel", "Frameless Glass Patch Fittings", "Balustrade Systems"]
  }
];

export const CANONICAL_BRANDS_BY_ID: Record<string, BrandInfo> = CANONICAL_BRANDS.reduce(
  (acc, brand) => {
    acc[brand.id] = brand;
    return acc;
  },
  {} as Record<string, BrandInfo>
);

export const BRAND_ALIASES: Record<string, string[]> = {
  hafele:   ["hafele", "haefele", "hfele", "hafeleindia"],
  dorset:   ["dorset", "dorsetindia"],
  labacha:  ["labacha", "labachaindia"],
  godrej:   ["godrej", "godrejlocks"],
  hettich:  ["hettich"],
  kich:     ["kich", "kichindia"],
  blum:     ["blum"],
  geze:     ["geze"],
  yale:     ["yale", "yalehome"],
  ozone:    ["ozone", "ozoneindia"],
  pans:     ["pans"],
  backer:   ["backer"],
  tattva:   ["tattva"],
  rexton:   ["rexton"],
  madhuram: ["madhuram"],
  furnipart:["furnipart"],
  marnello: ["marnello"],
  helix:    ["helix"],
  liftor:   ["liftor"],
  taco:     ["taco"],
  shapes:   ["shapes"],
  decore:   ["decore"],
};

const ALIAS_TO_KEY: Record<string, string> = Object.entries(BRAND_ALIASES).reduce(
  (acc, [key, aliases]) => {
    for (const alias of aliases) acc[alias] = key;
    return acc;
  },
  {} as Record<string, string>
);

export function normalizeBrandKey(brand: Brand): string {
  const raw =
    (brand?.slug as { current?: string })?.current ??
    (brand?.slug as string) ??
    brand?.id ??
    brand?.name ??
    "";
  const cleaned = String(raw).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ALIAS_TO_KEY[cleaned] ?? cleaned;
}
