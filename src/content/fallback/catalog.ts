export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryLabel: string;
  brand: string;
  brandName?: string;
  model?: string;
  catalogReference?: string;
  shortDescription?: string;
  description: string;
  features: string[];
  finishes: string[];
  application: string;
  imageUrl?: string;
  imageLqip?: string;
  featured?: boolean;
  whatsappMessage: string;
  material?: string;
  durability?: string;
  dimensions?: string;
  showroomBay?: string;
  displayStatus?: "Live Display" | "Available on Order" | "Exclusive Demo Unit";
  specifications?: Array<{ key: string; value: string }>;
}

export interface CategoryInfo {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  shortDesc: string;
  overview: string;
  iconName: string;
  primaryRail: "handles-knobs" | "door-hardware" | "bathroom" | "kitchen-wardrobes" | "furniture-hardware" | "door" | "digital-locks" | "kitchen" | "wardrobe" | "more";
  familySlugs: string[];
  subcategories?: string[];
  cardVariant: "standard" | "wide" | "feature";
  suitableFor: string[];
  brands: string[];
  pendingVerificationBrands?: string[];
  keyFeatures: string[];
  verificationStatus: "unverified" | "brand_verified" | "catalog_verified";
  whatsappMessage: string;
  featured?: boolean;
  itemCount: number;
}

export interface ShowroomFamily {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  subcategories: string[];
  styleTags?: string[];
  formTags?: string[];
  collectionSlugs: string[];
}

export type { BrandInfo } from "./brands";

export interface ShowroomZone {
  id: string;
  bayNumber: string;
  title: string;
  category: string;
  description: string;
  featuredProducts: string[];
  image: string;
  highlights: string[];
}

export const SHOWROOM_FAMILIES: ShowroomFamily[] = [
  {
    id: "handles-knobs",
    slug: "handles-knobs",
    name: "Handles & Knobs",
    tagline: "Contemporary profiles to classical architectural detailing",
    description: "Architectural entrance pull handles, luxury cabinet handles, knurled knobs, and designer joinery trim.",
    styleTags: ["Modern", "Classical", "Luxury", "Italian", "Wooden", "Ceramic", "Leather", "Kids"],
    formTags: ["Long Bar", "Flush", "Profile", "Pull Handles", "Knobs"],
    subcategories: [
      "Kids Collection",
      "Modern Collection",
      "Classical Collection",
      "Long Bar Handles",
      "Flush Collection",
      "Leather Collection",
      "Luxury Collection",
      "Wooden Collection",
      "Italian Collection",
      "Ceramic Collection",
      "Profile Handles"
    ],
    collectionSlugs: ["main-door-handles", "cabinet-wardrobe-handles"]
  },
  {
    id: "door-hardware",
    slug: "door-hardware",
    name: "Door Hardware",
    tagline: "High-security locking systems and precision entrance controls",
    description: "Biometric smart locks, high-durability mortise locksets, architectural door controls, and glass door fittings.",
    subcategories: [
      "Door Locks",
      "Digital Locks",
      "Hotel Locks",
      "Mortise Handles",
      "Door Pull Handles",
      "Door Knobs",
      "Door Accessories",
      "Door Sliding",
      "Window Hardware",
      "Glass Door Fittings"
    ],
    collectionSlugs: ["digital-locks", "mortise-door-locks", "main-door-handles", "glass-hardware", "door-closers-stoppers", "safes"]
  },
  {
    id: "bathroom",
    slug: "bathroom",
    name: "Bathroom",
    tagline: "Luxury shower fittings, mirrors, and precision stainless steel suites",
    description: "Solid brass thermostatic shower suites, stainless steel accessories, designer mirrors, and anti-odor drainage solutions.",
    subcategories: [
      "Bathroom Accessories",
      "Bathroom Shelves",
      "Shaving Mirrors",
      "SS Mirror Cabinets",
      "Signages",
      "Hooks",
      "Mail Boxes",
      "Ladders",
      "Dustbins"
    ],
    collectionSlugs: ["bathroom-accessories"]
  },
  {
    id: "kitchen-wardrobes",
    slug: "kitchen-wardrobes",
    name: "Kitchen & Wardrobes",
    tagline: "German soft-close drawer fittings, sliding systems, and quartz sinks",
    description: "Engineered kitchen storage solutions, top-running wardrobe sliding mechanisms, and luxury granite sinks.",
    subcategories: [
      "Modular Kitchen Hardware",
      "Kitchen Accessories",
      "Kitchen Handles",
      "Kitchen Sinks & Faucets",
      "Wardrobe Hardware & Sliding",
      "Hinges & Soft-Close Systems",
      "Drawer Channels",
      "Lights",
      "Kitchen Appliances",
      "Safes"
    ],
    collectionSlugs: ["modular-kitchen-hardware", "kitchen-sinks-faucets", "wardrobe-hardware-sliding", "hinges-soft-close", "drawer-channels", "safes"]
  },
  {
    id: "furniture-hardware",
    slug: "furniture-hardware",
    name: "Furniture Hardware",
    tagline: "Concealed hinges, precision drawer runners, and joinery fittings",
    description: "German furniture fittings, concealed 3D adjustable hinges, heavy-duty drawer runners, and bespoke joinery mechanisms.",
    subcategories: [
      "Invisible Locks",
      "Drawer Channels",
      "Furniture Profiles",
      "Furniture Locks",
      "Furniture Hinges",
      "Carvings",
      "Bed Fittings",
      "Wheels & Legs",
      "Office Fittings",
      "Table Extension",
      "Furniture Fittings"
    ],
    collectionSlugs: ["drawer-channels", "hinges-soft-close", "cabinet-wardrobe-handles"]
  }
];

export { CANONICAL_BRANDS as BRANDS } from "./brands";

// The 13 Canonical Collections Architecture (Merchandised within 5 Showroom Families)
export const CATEGORIES: CategoryInfo[] = [
  {
    id: "digital-locks",
    slug: "digital-locks",
    title: "Digital Locks",
    eyebrow: "Biometric & Electronic Access Control",
    shortDesc: "Smart biometric fingerprint deadbolts, touch keypads, RFID card access, and mobile app integration.",
    overview: "Modern smart security solutions for residential and commercial properties, combining biometric, PIN, and app-based access.",
    iconName: "Lock",
    primaryRail: "door-hardware",
    familySlugs: ["door-hardware"],
    subcategories: ["Digital Locks", "Biometric Deadbolts", "RFID Cards", "Smart Life Integration"],
    cardVariant: "feature",
    suitableFor: ["Residential", "Commercial"],
    brands: ["Dorset", "Godrej"],
    pendingVerificationBrands: ["Hafele"],
    keyFeatures: [
      "0.3s Semiconductor Fingerprint Access",
      "Mobile App Control & Dynamic OTP Generation",
      "Triple Anti-Prise Heavy Deadbolts",
      "Emergency Mechanical Key & USB Backup"
    ],
    verificationStatus: "catalog_verified",
    whatsappMessage: "Hardware Collection — I would like to consult on Digital Locks & Biometric Security for my project.",
    featured: true,
    itemCount: 4
  },
  {
    id: "mortise-door-locks",
    slug: "mortise-door-locks",
    title: "Mortise & Door Locks",
    eyebrow: "High-Durability Architectural Security",
    shortDesc: "Heavy-duty SS 304 mortise locksets, euro profile brass cylinders, and high-security latch bodies.",
    overview: "Architectural grade lockcases and brass cylinder mechanisms engineered for 200,000+ opening cycles.",
    iconName: "ShieldCheck",
    primaryRail: "door-hardware",
    familySlugs: ["door-hardware"],
    subcategories: ["Door Locks", "Mortise Handles", "Euro Cylinders", "Hotel Locks"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Commercial"],
    brands: ["Dorset", "Godrej"],
    pendingVerificationBrands: ["Hafele"],
    keyFeatures: [
      "SS 304 Solid Latch and Deadbolt Mechanism",
      "Computerized Dimple Key Master Keying Options",
      "Corrosion-Resistant PVD Finished Faceplates"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Mortise & Architectural Door Locks.",
    featured: false,
    itemCount: 2
  },
  {
    id: "main-door-handles",
    slug: "main-door-handles",
    title: "Main Door Handles",
    eyebrow: "Grand Entrance Architectural Ironmongery",
    shortDesc: "Sculptural pull handles, solid forged brass lever sets, and statement entrance hardware.",
    overview: "Tactile, solid forged entrance handles in luxury finishes including PVD Rose Gold, Matte Black, and Antique Brass.",
    iconName: "DoorClosed",
    primaryRail: "handles-knobs",
    familySlugs: ["handles-knobs", "door-hardware"],
    subcategories: ["Door Pull Handles", "Modern Collection", "Classical Collection", "Luxury Collection", "Italian Collection"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Commercial", "Hospitality"],
    brands: ["Dorset", "Hafele", "Kich"],
    keyFeatures: [
      "Forged Solid Brass & SS 304 Stainless Steel",
      "Salt-Spray Tested Luxury PVD Coating",
      "Back-to-Back Glass & Wooden Door Mountings"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Main Entrance Pull Handles & Finishes.",
    featured: false,
    itemCount: 2
  },
  {
    id: "cabinet-wardrobe-handles",
    slug: "cabinet-wardrobe-handles",
    title: "Cabinet & Wardrobe Handles",
    eyebrow: "Minimalist Furniture & Wardrobe Profiles",
    shortDesc: "Slim aluminum edge profiles, concealed J-pulls, knurled bar handles, and luxury knobs.",
    overview: "Ergonomic furniture trim and edge pulls for bespoke joinery, modular wardrobes, and vanity units.",
    iconName: "Sliders",
    primaryRail: "handles-knobs",
    familySlugs: ["handles-knobs", "kitchen-wardrobes", "furniture-hardware"],
    subcategories: ["Long Bar Handles", "Profile Handles", "Flush Collection", "Knobs", "Leather Collection", "Ceramic Collection", "Wooden Collection"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Hospitality"],
    brands: ["Hafele", "Kich"],
    keyFeatures: [
      "Precision Knurled Solid Brass Textures",
      "Extruded Aluminum Seamless Edge Profiles",
      "Anti-Fingerprint Anodized Finishes"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Cabinet & Wardrobe Handles.",
    featured: false,
    itemCount: 1
  },
  {
    id: "modular-kitchen-hardware",
    slug: "modular-kitchen-hardware",
    title: "Modular Kitchen Hardware",
    eyebrow: "German Precision Soft-Close Fittings",
    shortDesc: "Hafele & Hettich soft-close tandem drawers, tall pantry pull-outs, and corner carousel magic units.",
    overview: "Complete German-engineered kitchen fitting systems — hinges, drawer channels, organizers — for durable, soft-close daily use.",
    iconName: "ChefHat",
    primaryRail: "kitchen-wardrobes",
    familySlugs: ["kitchen-wardrobes"],
    subcategories: ["Modular Kitchen Hardware", "Kitchen Accessories", "Kitchen Handles", "Corner Carousels", "Pantry Units"],
    cardVariant: "feature",
    suitableFor: ["Residential"],
    brands: ["Hafele", "Hettich"],
    keyFeatures: [
      "Synchronized Full-Extension Soft-Close Runners",
      "50kg Dynamic Cookware Load Bearing Capacity",
      "Corner Carousel & Blind Corner Magic Storage",
      "Integrated 3D Tool-less Front Alignment"
    ],
    verificationStatus: "catalog_verified",
    whatsappMessage: "Hardware Collection — Inquiring about German Modular Kitchen Hardware Systems.",
    featured: true,
    itemCount: 4
  },
  {
    id: "kitchen-sinks-faucets",
    slug: "kitchen-sinks-faucets",
    title: "Kitchen Sinks & Faucets",
    eyebrow: "Italian Quartz Granite & Precision Mixers",
    shortDesc: "Labacha composite quartz double/single bowl sinks and 360° pull-out brass kitchen faucets.",
    overview: "Non-porous, antibacterial composite granite sinks with thermal shock resistance up to 280°C and solid brass mixers.",
    iconName: "Droplet",
    primaryRail: "kitchen-wardrobes",
    familySlugs: ["kitchen-wardrobes"],
    subcategories: ["Sink", "Faucets", "Workstation Sinks", "Kitchen Appliances"],
    cardVariant: "wide",
    suitableFor: ["Residential"],
    brands: ["Labacha"],
    keyFeatures: [
      "80% Natural Quartz Composite Granite",
      "Heat & Scratch Resistant Non-Porous Surface",
      "360° Swivel Pull-Out Dual-Spray Faucets",
      "Sound-Dampening Heavy Composite Basin"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Labacha Quartz Sinks & Kitchen Faucets.",
    featured: false,
    itemCount: 2
  },
  {
    id: "wardrobe-hardware-sliding",
    slug: "wardrobe-hardware-sliding",
    title: "Wardrobe Hardware & Sliding Systems",
    eyebrow: "Top-Running Silent Sliding Systems",
    shortDesc: "Hettich & Hafele heavy door sliding fittings, internal wardrobe lifts, pull-out trouser racks, and LED sensor profiles.",
    overview: "Whisper-quiet sliding door mechanisms supporting up to 100kg door leaves with bi-directional dampening.",
    iconName: "Layers",
    primaryRail: "kitchen-wardrobes",
    familySlugs: ["kitchen-wardrobes"],
    subcategories: ["Wardrobe Sliding", "Wardrobe Accessories", "Pull-Down Lifts", "Trouser Racks"],
    cardVariant: "wide",
    suitableFor: ["Residential", "Hospitality"],
    brands: ["Hafele", "Hettich"],
    keyFeatures: [
      "Top-Running Heavy Weight Door Hardware (Up to 100kg)",
      "Silent System Dampened Opening & Soft-Closing",
      "Ergonomic Hydraulic Wardrobe Pull-Down Lifts"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Wardrobe Sliding Systems & Internal Fittings.",
    featured: false,
    itemCount: 2
  },
  {
    id: "hinges-soft-close",
    slug: "hinges-soft-close",
    title: "Hinges & Soft-Close Systems",
    eyebrow: "Concealed 3D Adjustable Hinges",
    shortDesc: "Hafele 3D concealed architectural door hinges, Hettich Sensys clip-on soft-close cabinet hinges.",
    overview: "Engineered concealed hinges for flush residential doors and kitchen cabinetry tested to 200,000 cycles.",
    iconName: "Maximize2",
    primaryRail: "furniture-hardware",
    familySlugs: ["furniture-hardware", "kitchen-wardrobes"],
    subcategories: ["Furniture Hinges", "3D Concealed Hinges", "Sensys Hinges", "Soft-Close Dampers"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Commercial"],
    brands: ["Hafele", "Hettich"],
    keyFeatures: [
      "3-Way Tool-less Cam Adjustment",
      "Integrated Hydraulic Soft-Closing Damper",
      "Certified 200,000 Cycle Fatigue Endurance"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about 3D Concealed Hinges & Soft-Close Systems.",
    featured: false,
    itemCount: 2
  },
  {
    id: "drawer-channels",
    slug: "drawer-channels",
    title: "Drawer Channels",
    eyebrow: "Heavy-Duty Telescopic & Concealed Runners",
    shortDesc: "Hettich Quadro concealed runners, Hafele full-extension soft-close ball bearing drawer slides.",
    overview: "Smooth, sag-resistant runner technology for kitchen cabinetry, office credenzas, and bedroom storage.",
    iconName: "Columns",
    primaryRail: "furniture-hardware",
    familySlugs: ["furniture-hardware", "kitchen-wardrobes"],
    subcategories: ["Drawer Channels", "Quadro Runners", "Full-Extension Slides", "Push-to-Open"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Commercial"],
    brands: ["Hafele", "Hettich"],
    keyFeatures: [
      "Concealed Under-Mount Synchronized Glides",
      "Push-to-Open & Soft-Close Combined Capabilities",
      "Galvanized Steel Heavy-Duty Load Ratings"
    ],
    verificationStatus: "brand_verified",
    whatsappMessage: "Hardware Collection — Inquiring about Concealed Drawer Runners & Slides.",
    featured: false,
    itemCount: 1
  },
  {
    id: "bathroom-accessories",
    slug: "bathroom-accessories",
    title: "Bathroom Accessories",
    eyebrow: "Luxury Shower Suites & Solid SS Fixtures",
    shortDesc: "Rain showers, thermostatic bath mixers, SS 304 towel racks, soap dispensers, and linear drains.",
    overview: "Tactile luxury bathroom suites crafted with solid brass valves, PVD coatings, and anti-clog linear floor drains.",
    iconName: "Bath",
    primaryRail: "bathroom",
    familySlugs: ["bathroom"],
    subcategories: ["Bathroom Accessories", "Bathroom Shelves", "Shaving Mirrors", "SS Mirror Cabinets", "Signages", "Hooks", "Mail Boxes", "Ladders", "Dustbins"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Hospitality"],
    brands: [],
    pendingVerificationBrands: ["Labacha", "Kich"],
    keyFeatures: [
      "Solid Brass Thermostatic Cartridges",
      "SS 304 Anti-Odor Linear Floor Drainage",
      "PVD Brushed Gold & Matte Black Finish Durability"
    ],
    verificationStatus: "unverified",
    whatsappMessage: "Hardware Collection — Inquiring about Luxury Bathroom Fixtures & Accessories.",
    featured: false,
    itemCount: 0
  },
  {
    id: "glass-hardware",
    slug: "glass-hardware",
    title: "Glass Hardware",
    eyebrow: "Frameless Glass Architecture & Balustrades",
    shortDesc: "Stainless steel patch fittings, shower hinges, spider fittings, and glass railings.",
    overview: "High-grade stainless steel architectural fittings engineered for commercial glass facades and luxury frameless shower enclosures.",
    iconName: "Building2",
    primaryRail: "door-hardware",
    familySlugs: ["door-hardware"],
    subcategories: ["Glass Door Fittings", "Spider Fittings", "Shower Hinges", "Patch Fittings"],
    cardVariant: "standard",
    suitableFor: ["Commercial", "Residential", "Hospitality"],
    brands: [],
    pendingVerificationBrands: ["Kich", "Hafele"],
    keyFeatures: [
      "AISI 316 Marine Grade Solid Forged Stainless Steel",
      "Frameless Shower Door Pivot Hinges & Brackets",
      "Heavy Commercial Glass Facade Spider Fittings"
    ],
    verificationStatus: "unverified",
    whatsappMessage: "Hardware Collection — Inquiring about Architectural Glass Fittings.",
    featured: false,
    itemCount: 0
  },
  {
    id: "door-closers-stoppers",
    slug: "door-closers-stoppers",
    title: "Door Closers & Stoppers",
    eyebrow: "Concealed Hydraulic Controls & Magnetic Holders",
    shortDesc: "Concealed overhead door closers, floor springs, heavy-duty floor buffers, and magnetic door catches.",
    overview: "Controlled closing velocity and latch action for residential fire doors, entrance doors, and corporate offices.",
    iconName: "RotateCcw",
    primaryRail: "door-hardware",
    familySlugs: ["door-hardware"],
    subcategories: ["Door Accessories", "Door Closers", "Floor Springs", "Magnetic Stoppers", "Window Hardware"],
    cardVariant: "standard",
    suitableFor: ["Commercial", "Residential"],
    brands: [],
    pendingVerificationBrands: ["Dorset", "Godrej", "Hafele"],
    keyFeatures: [
      "Adjustable Closing & Latching Velocity Valves",
      "Concealed In-Door Frame Installation",
      "EN 1154 Fire-Rated Compliance Standards"
    ],
    verificationStatus: "unverified",
    whatsappMessage: "Hardware Collection — Inquiring about Hydraulic Door Closers & Stoppers.",
    featured: false,
    itemCount: 0
  },
  {
    id: "safes",
    slug: "safes",
    title: "Safes",
    eyebrow: "Bank-Grade Home & Commercial Security Safes",
    shortDesc: "Motorized biometric digital safes, fire-resistant document lockers, and concealed wardrobe jewelry safes.",
    overview: "High-security digital safes equipped with hardened steel shooting bolts, secondary mechanical overrides, and tamper alarms.",
    iconName: "Key",
    primaryRail: "door-hardware",
    familySlugs: ["door-hardware", "kitchen-wardrobes"],
    subcategories: ["Safes", "Biometric Safes", "Fire-Resistant Safes", "Wardrobe Jewelry Safes"],
    cardVariant: "standard",
    suitableFor: ["Residential", "Commercial", "Hospitality"],
    brands: [],
    pendingVerificationBrands: ["Godrej"],
    keyFeatures: [
      "Motorized Solid Steel Shooting Bolts",
      "Biometric + PIN Multi-User Access Memory",
      "Tamper Alarm Auto-Freeze Security Protocol"
    ],
    verificationStatus: "unverified",
    whatsappMessage: "Hardware Collection — Inquiring about Biometric Home & Office Safes.",
    featured: false,
    itemCount: 0
  },
{
  "id": "kids-collection",
  "slug": "kids-collection",
  "title": "Kids Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium kids collection for architectural and interior applications.",
  "overview": "Discover our extensive range of kids collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Kids Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "modern-collection",
  "slug": "modern-collection",
  "title": "Modern Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium modern collection for architectural and interior applications.",
  "overview": "Discover our extensive range of modern collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Modern Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "classical-collection",
  "slug": "classical-collection",
  "title": "Classical Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium classical collection for architectural and interior applications.",
  "overview": "Discover our extensive range of classical collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Classical Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "long-bar-handles",
  "slug": "long-bar-handles",
  "title": "Long Bar Handles",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium long bar handles for architectural and interior applications.",
  "overview": "Discover our extensive range of long bar handles, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Long Bar Handles.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "flush-collection",
  "slug": "flush-collection",
  "title": "Flush Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium flush collection for architectural and interior applications.",
  "overview": "Discover our extensive range of flush collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Flush Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "leather-collection",
  "slug": "leather-collection",
  "title": "Leather Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium leather collection for architectural and interior applications.",
  "overview": "Discover our extensive range of leather collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Leather Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "luxury-collection",
  "slug": "luxury-collection",
  "title": "Luxury Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium luxury collection for architectural and interior applications.",
  "overview": "Discover our extensive range of luxury collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Luxury Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "wooden-collection",
  "slug": "wooden-collection",
  "title": "Wooden Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium wooden collection for architectural and interior applications.",
  "overview": "Discover our extensive range of wooden collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Wooden Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "italian-collection",
  "slug": "italian-collection",
  "title": "Italian Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium italian collection for architectural and interior applications.",
  "overview": "Discover our extensive range of italian collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Italian Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "ceramic-collection",
  "slug": "ceramic-collection",
  "title": "Ceramic Collection",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium ceramic collection for architectural and interior applications.",
  "overview": "Discover our extensive range of ceramic collection, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Ceramic Collection.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "profile-handles",
  "slug": "profile-handles",
  "title": "Profile Handles",
  "eyebrow": "Handles & Knobs Collection",
  "shortDesc": "Premium profile handles for architectural and interior applications.",
  "overview": "Discover our extensive range of profile handles, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "handles-knobs",
  "familySlugs": [
    "handles-knobs"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Profile Handles.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "hotel-locks",
  "slug": "hotel-locks",
  "title": "Hotel Locks",
  "eyebrow": "Door Hardware Collection",
  "shortDesc": "Premium hotel locks for architectural and interior applications.",
  "overview": "Discover our extensive range of hotel locks, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "door-hardware",
  "familySlugs": [
    "door-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Hotel Locks.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "door-knobs",
  "slug": "door-knobs",
  "title": "Door Knobs",
  "eyebrow": "Door Hardware Collection",
  "shortDesc": "Premium door knobs for architectural and interior applications.",
  "overview": "Discover our extensive range of door knobs, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "door-hardware",
  "familySlugs": [
    "door-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Door Knobs.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "door-sliding",
  "slug": "door-sliding",
  "title": "Door Sliding",
  "eyebrow": "Door Hardware Collection",
  "shortDesc": "Premium door sliding for architectural and interior applications.",
  "overview": "Discover our extensive range of door sliding, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "door-hardware",
  "familySlugs": [
    "door-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Door Sliding.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "window-hardware",
  "slug": "window-hardware",
  "title": "Window Hardware",
  "eyebrow": "Door Hardware Collection",
  "shortDesc": "Premium window hardware for architectural and interior applications.",
  "overview": "Discover our extensive range of window hardware, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "door-hardware",
  "familySlugs": [
    "door-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Window Hardware.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "bathroom-shelf",
  "slug": "bathroom-shelf",
  "title": "Bathroom Shelf",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium bathroom shelf for architectural and interior applications.",
  "overview": "Discover our extensive range of bathroom shelf, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Bathroom Shelf.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "shaving-mirrors",
  "slug": "shaving-mirrors",
  "title": "Shaving Mirrors",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium shaving mirrors for architectural and interior applications.",
  "overview": "Discover our extensive range of shaving mirrors, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Shaving Mirrors.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "ss-mirror-cabinets",
  "slug": "ss-mirror-cabinets",
  "title": "SS Mirror Cabinets",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium ss mirror cabinets for architectural and interior applications.",
  "overview": "Discover our extensive range of ss mirror cabinets, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about SS Mirror Cabinets.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "signages",
  "slug": "signages",
  "title": "Signages",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium signages for architectural and interior applications.",
  "overview": "Discover our extensive range of signages, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Signages.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "hooks",
  "slug": "hooks",
  "title": "Hooks",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium hooks for architectural and interior applications.",
  "overview": "Discover our extensive range of hooks, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Hooks.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "mail-box",
  "slug": "mail-box",
  "title": "Mail Box",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium mail box for architectural and interior applications.",
  "overview": "Discover our extensive range of mail box, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Mail Box.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "ladders",
  "slug": "ladders",
  "title": "Ladders",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium ladders for architectural and interior applications.",
  "overview": "Discover our extensive range of ladders, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Ladders.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "dustbins",
  "slug": "dustbins",
  "title": "Dustbins",
  "eyebrow": "Bathroom Collection",
  "shortDesc": "Premium dustbins for architectural and interior applications.",
  "overview": "Discover our extensive range of dustbins, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "bathroom",
  "familySlugs": [
    "bathroom"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Dustbins.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "kitchen-accessories",
  "slug": "kitchen-accessories",
  "title": "Kitchen Accessories",
  "eyebrow": "Kitchen & Wardrobes Collection",
  "shortDesc": "Premium kitchen accessories for architectural and interior applications.",
  "overview": "Discover our extensive range of kitchen accessories, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "kitchen-wardrobes",
  "familySlugs": [
    "kitchen-wardrobes"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Kitchen Accessories.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "lights",
  "slug": "lights",
  "title": "Lights",
  "eyebrow": "Kitchen & Wardrobes Collection",
  "shortDesc": "Premium lights for architectural and interior applications.",
  "overview": "Discover our extensive range of lights, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "kitchen-wardrobes",
  "familySlugs": [
    "kitchen-wardrobes"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Lights.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "kitchen-appliances",
  "slug": "kitchen-appliances",
  "title": "Kitchen Appliances",
  "eyebrow": "Kitchen & Wardrobes Collection",
  "shortDesc": "Premium kitchen appliances for architectural and interior applications.",
  "overview": "Discover our extensive range of kitchen appliances, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "kitchen-wardrobes",
  "familySlugs": [
    "kitchen-wardrobes"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Kitchen Appliances.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "invisible-locks",
  "slug": "invisible-locks",
  "title": "Invisible Locks",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium invisible locks for architectural and interior applications.",
  "overview": "Discover our extensive range of invisible locks, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Invisible Locks.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "furniture-profiles",
  "slug": "furniture-profiles",
  "title": "Furniture Profiles",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium furniture profiles for architectural and interior applications.",
  "overview": "Discover our extensive range of furniture profiles, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Furniture Profiles.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "furniture-locks",
  "slug": "furniture-locks",
  "title": "Furniture Locks",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium furniture locks for architectural and interior applications.",
  "overview": "Discover our extensive range of furniture locks, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Furniture Locks.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "carvings",
  "slug": "carvings",
  "title": "Carvings",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium carvings for architectural and interior applications.",
  "overview": "Discover our extensive range of carvings, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Carvings.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "bed-fittings",
  "slug": "bed-fittings",
  "title": "Bed Fittings",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium bed fittings for architectural and interior applications.",
  "overview": "Discover our extensive range of bed fittings, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Bed Fittings.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "wheels-legs",
  "slug": "wheels-legs",
  "title": "Wheels & Legs",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium wheels & legs for architectural and interior applications.",
  "overview": "Discover our extensive range of wheels & legs, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Wheels & Legs.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "office-fittings",
  "slug": "office-fittings",
  "title": "Office Fittings",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium office fittings for architectural and interior applications.",
  "overview": "Discover our extensive range of office fittings, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Office Fittings.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "table-extension",
  "slug": "table-extension",
  "title": "Table Extension",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium table extension for architectural and interior applications.",
  "overview": "Discover our extensive range of table extension, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Table Extension.",
  "featured": false,
  "itemCount": 0
},
{
  "id": "furniture-fittings",
  "slug": "furniture-fittings",
  "title": "Furniture Fittings",
  "eyebrow": "Furniture Hardware Collection",
  "shortDesc": "Premium furniture fittings for architectural and interior applications.",
  "overview": "Discover our extensive range of furniture fittings, crafted with precision and available in multiple finishes.",
  "iconName": "LayoutGrid",
  "primaryRail": "furniture-hardware",
  "familySlugs": [
    "furniture-hardware"
  ],
  "subcategories": [],
  "cardVariant": "standard",
  "suitableFor": [
    "Residential",
    "Commercial"
  ],
  "brands": [],
  "pendingVerificationBrands": [],
  "keyFeatures": [
    "Premium architectural grade material",
    "Multiple finish options available",
    "Durable and tested for high usage"
  ],
  "verificationStatus": "unverified",
  "whatsappMessage": "Hardware Collection — Inquiring about Furniture Fittings.",
  "featured": false,
  "itemCount": 0
}
];

export const SHOWROOM_ZONES: ShowroomZone[] = [
  {
    id: "bay-1",
    bayNumber: "Bay #1",
    title: "Modular Kitchen & Hafele Soft-Close Tandem Bay",
    category: "Kitchen & Appliances",
    description: "Experience fully functional modular kitchen units featuring Hafele Matrix Box drawer systems, corner carousel magic corners, and Labacha quartz sinks with live water displays.",
    featuredProducts: ["hafele-matrix-drawer", "labacha-quartz-sink-black"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).webp",
    highlights: ["Live Water Test Faucets", "Corner Carousel Pull-Outs", "Soft-Close Drawer Systems"]
  },
  {
    id: "bay-2",
    bayNumber: "Bay #2",
    title: "Biometric & Digital Lock Experience Bar",
    category: "Smart Security",
    description: "Test drive live smart biometric locks from Dorset, Godrej, and Hafele. Experience instant 0.3s fingerprint scanning, RFID keycard entry, PIN codes, and mobile app unlocking.",
    featuredProducts: ["dorset-biometric-x1", "godrej-advantis-revolution"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).webp",
    highlights: ["Fingerprint Speed Demo", "Mobile App Unlock Bar", "Emergency Key Override Test"]
  },
  {
    id: "bay-3",
    bayNumber: "Bay #3",
    title: "Main Entrance Mortise & Designer Handle Gallery",
    category: "Door Locks & Handles",
    description: "Browse over 80+ full-sized door panels displaying Dorset, Hafele, and Kich mortise handles in PVD Rose Gold, Satin Chrome, Antique Brass, and Matte Black finishes.",
    featuredProducts: ["dorset-pvd-mortise-rose", "hafele-3d-concealed-hinge"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).webp",
    highlights: ["Full-Size Door Mounting", "PVD Finish Touch & Feel", "Heavy-Duty Concealed Hinges"]
  },
  {
    id: "bay-4",
    bayNumber: "Bay #4",
    title: "Luxury Bathroom & Glass Shower Suite",
    category: "Bath Fittings",
    description: "Immerse in luxury bath fittings including Labacha designer rain showers, solid brass thermostatic mixers, SS 304 glass cubicle brackets, and anti-odor linear floor drains.",
    featuredProducts: ["labacha-thermostatic-shower", "kich-glass-patch-fitting"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).webp",
    highlights: ["Thermostatic Water Control", "Frameless Glass Brackets", "Anti-Odor Floor Drain Demo"]
  },
  {
    id: "bay-5",
    bayNumber: "Bay #5",
    title: "Wardrobe Sliding & LED Profile Living Bay",
    category: "Wardrobe & Sliding",
    description: "Discover Hettich top-running sliding door fittings, internal wardrobe pull-outs, trouser racks, shoe organizers, and motion-sensor aluminum LED wardrobe profiles.",
    featuredProducts: ["hettich-sliding-system", "hafele-wardrobe-lift"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).webp",
    highlights: ["Silent Top-Running Sliding", "Sensor LED Illumination", "Ergonomic Wardrobe Lifts"]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "dorset-biometric-x1",
    name: "Dorset Biometric Smart Digital Lock X1",
    category: "Digital Locks",
    categorySlug: "digital-locks",
    categoryLabel: "Biometric & Smart Digital Locks",
    brand: "Dorset",
    brandName: "Dorset",
    model: "X1-SMART-PVD",
    catalogReference: "DOR-DL-X1",
    shortDescription: "Ultra-fast semiconductor biometric door lock with encrypted RFID and mobile app connectivity.",
    description: "State-of-the-art biometric main door lock featuring 360-degree semiconductor fingerprint recognition, encrypted RFID cards, touch keypad, and remote WiFi application access.",
    features: [
      "0.3 Second Ultra-Fast Semiconductor Fingerprint Sensor",
      "PVD Rose Gold & Matte Black Dual Tone Finish",
      "Anti-Prise Triple Deadbolt Mortise Lock Mechanism",
      "Emergency Micro-USB & Physical Mechanical Key Override"
    ],
    finishes: ["PVD Rose Gold", "Matte Black", "Antique Brass"],
    application: "Main Entrance Wooden & Security Doors (35mm - 70mm thickness)",
    featured: true,
    whatsappMessage: "Hi Hardware Collection, I want to inquire about Dorset Biometric Smart Lock X1.",
    material: "High-Density Zinc Alloy & SS 304 Deadbolts",
    durability: "Tested for 200,000+ Unlocking Operations",
    dimensions: "380mm x 75mm Front Panel",
    showroomBay: "Bay #2: Digital Lock Bar",
    displayStatus: "Live Display",
    specifications: [
      { key: "Unlocking Modes", value: "Biometric Fingerprint, PIN Code, RFID Card, Mobile App, Mechanical Key" },
      { key: "Fingerprint Capacity", value: "Up to 100 Biometric Profiles" },
      { key: "Door Thickness Suitability", value: "35mm to 70mm Wooden & Metal Doors" },
      { key: "Power Supply", value: "4x AA Alkaline Batteries with Emergency USB Port" }
    ]
  },
  {
    id: "godrej-advantis-revolution",
    name: "Godrej Advantis Revolution Biometric Door Lock",
    category: "Digital Locks",
    categorySlug: "digital-locks",
    categoryLabel: "Smart Security & Living",
    brand: "Godrej",
    brandName: "Godrej",
    model: "ADVANTIS-REV-PRO",
    catalogReference: "GOD-DL-ADV",
    shortDescription: "Bank-grade biometric main door lock with multi-level authentication and tamper alarms.",
    description: "Enterprise grade smart door lock with multi-level biometric authentication, RFID card reader, virtual password protection, and break-in alarm integration.",
    features: [
      "Bank-Grade Biometric Sensor Recognition",
      "Break-In & Tamper Alarm Notification System",
      "Privacy Locking Mode & Mechanical Override Key",
      "Suitable for Right/Left Inward & Outward Opening Doors"
    ],
    finishes: ["Matte Black with Chrome Edges"],
    application: "Residential Villas, Apartments & Executive Offices",
    featured: true,
    whatsappMessage: "Hi Hardware Collection, I want to inquire about Godrej Advantis Revolution Lock.",
    material: "Zinc Alloy Outer Casing & Steel Mortise",
    durability: "Certified 150,000 Operations",
    dimensions: "360mm x 72mm Panel",
    showroomBay: "Bay #2: Digital Lock Bar",
    displayStatus: "Live Display",
    specifications: [
      { key: "Security Protocol", value: "Dual Authentication (Fingerprint + PIN)" },
      { key: "Alarm Triggers", value: "Tamper, Forced Entry, Low Battery Alert" },
      { key: "Key Override", value: "High-Security Mechanical Dimple Key" }
    ]
  },
  {
    id: "hafele-matrix-drawer",
    name: "Hafele Matrix Box Premium Soft-Close Tandem Drawer",
    category: "Modular Kitchen Hardware",
    categorySlug: "modular-kitchen-hardware",
    categoryLabel: "Modular Kitchen Systems",
    brand: "Hafele",
    brandName: "Hafele",
    model: "MATRIX-BOX-S",
    catalogReference: "HAF-KIT-MBX",
    shortDescription: "German-engineered soft-close drawer system with synchronized full-extension runners.",
    description: "German-engineered soft-close drawer system with synchronized runner action and full extension capabilities. Designed to carry heavy kitchen cookware effortlessly.",
    features: [
      "Slick Synchronized Full Extension Runner Action",
      "Integrated Smuso Soft-Closing Mechanism",
      "50 kg Dynamic Load Bearing Capacity",
      "Tool-less 3D Front Alignment Adjustment"
    ],
    finishes: ["Metallic White", "Anthracite Gray", "Silver Metallic"],
    application: "Modular Kitchen Drawers, Pantry Units & Cooking Stations",
    featured: true,
    whatsappMessage: "Hi Hardware Collection, I would like a quotation for Hafele Matrix Box Tandem Drawers.",
    material: "Galvanized Steel Rail with Epoxy Powder Coating",
    durability: "LGA Certified 100,000 Cycles",
    dimensions: "Depth: 500mm / Height: 84mm & 168mm",
    showroomBay: "Bay #1: Kitchen Bay",
    displayStatus: "Live Display",
    specifications: [
      { key: "Load Capacity", value: "50 kg Dynamic Weight Rating" },
      { key: "Runner Mechanism", value: "Synchronized Full Extension with Smuso Damper" },
      { key: "Adjustment", value: "3D Front Panel Cam Alignment" }
    ]
  },
  {
    id: "labacha-quartz-sink-black",
    name: "Labacha Double Bowl Quartz Granite Kitchen Sink",
    category: "Kitchen Sinks & Faucets",
    categorySlug: "kitchen-sinks-faucets",
    categoryLabel: "Modular Kitchen Systems",
    brand: "Labacha",
    brandName: "Labacha",
    model: "LAB-QUARTZ-860",
    catalogReference: "LAB-SNK-860",
    shortDescription: "Italian composite granite sink with 280°C heat resistance and anti-bacterial nano surface.",
    description: "Handcrafted Italian design double bowl quartz granite kitchen sink featuring thermal shock resistance up to 280°C and sound-dampening non-porous composite structure.",
    features: [
      "Natural Quartz Composite Granite Construction",
      "Non-Porous Anti-Bacterial & Scratch-Resistant Surface",
      "Extra Deep 220mm Bowls for Large Indian Cookware",
      "Includes Waste Coupling & Overflow Kit"
    ],
    finishes: ["Carbon Metallic Black", "Granite White", "Choco Brown"],
    application: "Luxury Kitchen Counters & Island Workstations",
    featured: true,
    whatsappMessage: "Hi Hardware Collection, please share pricing for Labacha Quartz Granite Double Bowl Sink.",
    material: "80% Natural Quartz Crystal + 20% Acrylic Resin",
    durability: "High Heat Resistant up to 280°C",
    dimensions: "860mm x 500mm x 220mm Bowl Depth",
    showroomBay: "Bay #1: Kitchen Bay",
    displayStatus: "Live Display",
    specifications: [
      { key: "Material Composition", value: "80% German Natural Quartz + 20% Premium Resin" },
      { key: "Heat Resistance", value: "Up to 280°C Thermal Shock Resistance" },
      { key: "Bowl Depth", value: "220mm Deep Basin" }
    ]
  },
  {
    id: "hettich-sliding-system",
    name: "Hettich TopLine XL Soft-Close Wardrobe Sliding System",
    category: "Wardrobe Hardware & Sliding Systems",
    categorySlug: "wardrobe-hardware-sliding",
    categoryLabel: "Wardrobe & Sliding Systems",
    brand: "Hettich",
    brandName: "Hettich",
    model: "TOPLINE-XL-PRO",
    catalogReference: "HET-SLD-XL",
    shortDescription: "Premium top-running sliding system for floor-to-ceiling wooden and glass wardrobe doors.",
    description: "Premium top-running sliding door system for large floor-to-ceiling wardrobe doors. Delivers whisper-quiet soft-close sliding for heavy wooden or glass doors.",
    features: [
      "Supports Large Doors up to 100 kg per door",
      "Silent System Soft-Closing in Opening & Closing Directions",
      "Concealed Top Track Mounting for Seamless Aesthetic",
      "Prevent Door Sagging with Integrated Alignment Adjuster"
    ],
    finishes: ["Silver Anodized", "Black Anodized"],
    application: "Modern Master Bedrooms & Built-In Wardrobes",
    featured: true,
    whatsappMessage: "Hi Hardware Collection, please provide details for Hettich TopLine XL Sliding System.",
    material: "Extruded High-Grade Aircraft Aluminum Track",
    durability: "German DIN Standard 50,000 Cycles",
    dimensions: "Track Length: 3000mm / Door Thickness: 18-50mm",
    showroomBay: "Bay #5: Wardrobe Sliding Bay",
    displayStatus: "Live Display",
    specifications: [
      { key: "Weight Capacity", value: "Up to 100 kg per Door Leaf" },
      { key: "Dampening Action", value: "Bi-Directional Soft Opening and Soft Closing" },
      { key: "Track Mounting", value: "Concealed Top Running Extrusion" }
    ]
  },
  {
    id: "kich-glass-patch-fitting",
    name: "Kich Architectural Glass Patch Fitting & Door Pivot Set",
    category: "Glass Hardware",
    categorySlug: "glass-hardware",
    categoryLabel: "Architectural & Glass Fittings",
    brand: "Kich",
    brandName: "Kich",
    model: "KICH-SS316-PATCH",
    catalogReference: "KICH-GLS-PCH",
    shortDescription: "Marine grade AISI 316 stainless steel frameless glass door patch fittings and pivot set.",
    description: "Marine grade AISI 316 stainless steel frameless glass door patch fittings and floor spring pivot set engineered for high-traffic commercial glass doors.",
    features: [
      "AISI 316 Grade Stainless Steel Solid Forged Construction",
      "Mirror Polish & Satin Brushed Corrosion-Resistant Finishes",
      "Precision Ball Bearing Internal Pivot Mechanism",
      "For 10mm to 12mm Toughened Glass Doors"
    ],
    finishes: ["Satin Stainless Steel", "Mirror Polished SS", "PVD Gold"],
    application: "Commercial Entrance Doors, Glass Partitions & Showrooms",
    featured: false,
    whatsappMessage: "Hi Hardware Collection, I would like to inquire about Kich Glass Patch Fittings.",
    material: "Solid AISI 316 Stainless Steel",
    durability: "Grade 10 Corrosion Tested (500hr Salt Spray)",
    dimensions: "For Glass Thickness: 10mm - 12mm",
    showroomBay: "Bay #4: Bath & Glass Suite",
    displayStatus: "Live Display",
    specifications: [
      { key: "Steel Grade", value: "Marine Grade AISI 316 Stainless Steel" },
      { key: "Glass Suitability", value: "10mm to 12mm Toughened Safety Glass" },
      { key: "Finish Options", value: "Satin Brushed, Mirror Polished, PVD Gold" }
    ]
  }
];

export const SHOWROOM_STATS = [
  { label: "Years in Business", value: "10+", sub: "Serving Jamshedpur with excellence" },
  { label: "Authorized Brands", value: "Curated", sub: "Hafele, Dorset, Labacha, Godrej, Hettich, Kich & more" },
  { label: "Showroom Location", value: "Sakchi", sub: "Live Display in Jamshedpur" },
  { label: "Google Rating", value: "4.4 ★", sub: "55+ Verified Customer Reviews" },
];

export const SERVICE_AREAS = [
  "Sakchi Market",
  "Bistupur",
  "Kadma",
  "Jugsalai",
  "Telco Colony",
  "Adityapur",
  "Sonari",
  "Mango",
  "Gamharia",
  "Baradwari",
  "Kashidih",
  "Golmuri"
];
