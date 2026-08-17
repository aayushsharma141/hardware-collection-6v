export interface Product {
  id: string;
  name: string;
  category: "doors" | "kitchen" | "bath" | "wardrobe" | "architectural" | "smart";
  categoryLabel: string;
  brand: "Hafele" | "Dorset" | "Labacha" | "Godrej" | "Hettich" | "Kich";
  model: string;
  description: string;
  features: string[];
  finishes: string[];
  application: string;
  image?: string;
  featured?: boolean;
  whatsappMessage: string;
  // Enhanced Showroom & Technical Spec Fields
  material?: string;
  durability?: string;
  dimensions?: string;
  warranty?: string;
  priceRange?: string;
  mrp?: string;
  showroomBay?: string;
  displayStatus?: "Live Display" | "Available on Order" | "Exclusive Demo Unit";
}

export interface CategoryInfo {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  itemCount: number;
}

export interface BrandInfo {
  id: string;
  name: string;
  country: string;
  tier: string;
  authorized: boolean;
  logo: string;
  tagline: string;
  description: string;
  establishedYear?: string;
  heroImage?: string;
  keyHighlights: string[];
}

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

export const BRANDS: BrandInfo[] = [
  {
    id: "hafele",
    name: "Hafele",
    country: "Germany",
    tier: "Ultra Luxury Architectural & Modular Kitchen",
    authorized: true,
    logo: "/brands/Hafele.png",
    tagline: "German Architectural & Kitchen Hardware",
    description: "Häfele is a world-renowned German manufacturer of architectural hardware, furniture fittings, and electronic access control systems. Established in 1923, Häfele products embody precision engineering, sleek minimalist design, and smooth operation for high-end residential and commercial developments.",
    establishedYear: "1923",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "German Precision & Soft-Close Engineering",
      "Matrix Box & Tandem Drawer Runner Systems",
      "3D Adjustable Concealed Door Hinges",
      "Biometric Smart Locks with Smart Life App Integration"
    ]
  },
  {
    id: "dorset",
    name: "Dorset",
    country: "India / Global",
    tier: "High-End Architectural Locks & Security",
    authorized: true,
    logo: "/brands/dorset-seeklogo.svg",
    tagline: "Digital Locks & Architectural Mortise",
    description: "Dorset is a premier provider of door controls, locksets, digital security systems, and architectural ironmongery. Engineered for maximum physical security and elegant aesthetic appeal, Dorset mortise handles and biometric deadbolts secure iconic properties across the globe.",
    establishedYear: "1995",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "SS 304 High-Grade Mortise Handle Sets",
      "Dual-Auth Biometric & RFID Digital Door Locks",
      "200,000 Cycle Durability Certified Locks",
      "Custom PVD Rose Gold & Antique Brass Finishes"
    ]
  },
  {
    id: "labacha",
    name: "Labacha",
    country: "Italy / India",
    tier: "Luxury Quartz Sinks & Precision Faucets",
    authorized: true,
    logo: "/brands/labacha_logo.webp",
    tagline: "Luxury Granite Sinks & Bath Mixers",
    description: "Labacha brings Italian-inspired quartz composite granite sinks, workstation kitchen sinks, and luxury bathroom mixers to modern living spaces. Crafted from non-porous antibacterial materials, Labacha products combine high thermal resistance with tactile elegance.",
    establishedYear: "2010",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "Natural Quartz Composite Granite Construction",
      "Heat & Scratch Resistant Non-Porous Surfaces",
      "360° Swivel Pull-Out Brass Kitchen Faucets",
      "Anti-Bacterial & Easy Clean Nano-Coating"
    ]
  },
  {
    id: "godrej",
    name: "Godrej",
    country: "India",
    tier: "Enterprise & High-Trust Security Hardware",
    authorized: true,
    logo: "/brands/Godrej.svg",
    tagline: "India's Trusted Smart Biometric Security",
    description: "Godrej Security Solutions is synonymous with unyielding trust and enterprise security in India. Offering state-of-the-art biometric main door locks, home safes, and rim locks, Godrej ensures peace of mind through advanced encryption and robust mechanical construction.",
    establishedYear: "1897",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "Bank-Grade Biometric Sensor Recognition",
      "Anti-Prise Deadbolt Locks & Emergency Mechanical Override",
      "Smart Mobile App Access & OTP Sharing",
      "Pan-India Service & Comprehensive Warranty"
    ]
  },
  {
    id: "hettich",
    name: "Hettich",
    country: "Germany",
    tier: "Precision Sliding & Drawer Runners",
    authorized: true,
    logo: "/brands/Hettich.svg",
    tagline: "Sliding Systems & German Drawer Fittings",
    description: "Hettich creates perfect technology for furniture. As one of Germany's leading hardware manufacturers, Hettich's silent soft-close drawers, top-running sliding wardrobe fittings, and Sensys hinges set global benchmarks for interior design functionality.",
    establishedYear: "1888",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "InnoTech Atira & ArciTech Soft-Close Drawer Systems",
      "Top-Running Heavy Weight Sliding Door Hardware",
      "Integrated Silent System Hinge Dampening",
      "Modular Pull-Out Kitchen & Wardrobe Accessories"
    ]
  },
  {
    id: "kich",
    name: "Kich",
    country: "India",
    tier: "Premium Architectural & Glass Fittings",
    authorized: true,
    logo: "/brands/Godrej.svg",
    tagline: "Architectural Hardware & Balustrade Systems",
    description: "Kich is India's leading manufacturer of premium architectural hardware, stainless steel handrails, glass railing systems, and glass hardware fittings. Celebrated for high-grade AISI 316 stainless steel craftsmanship and award-winning designs.",
    establishedYear: "1992",
    heroImage: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    keyHighlights: [
      "AISI 316 Marine Grade Stainless Steel Construction",
      "Glass Patch Fittings & Shower Cubicle Brackets",
      "Corrosion-Free Glass Railing & Spider Systems",
      "National Design Award Winner for Ironmongery"
    ]
  }
];

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "doors",
    title: "Door Hardware & Locks",
    shortDesc: "Main door handles, biometric locks, mortise handles, heavy-duty hinges & door closers",
    iconName: "Lock",
    itemCount: 14,
  },
  {
    id: "kitchen",
    title: "Modular Kitchen Systems",
    shortDesc: "Hafele soft-close tandems, tall units, corner carousel solutions, Labacha luxury sinks",
    iconName: "ChefHat",
    itemCount: 12,
  },
  {
    id: "bath",
    title: "Luxury Bathroom Fittings",
    shortDesc: "Designer showers, brass faucets, luxury floor drains, grab bars & premium towel suites",
    iconName: "Bath",
    itemCount: 10,
  },
  {
    id: "wardrobe",
    title: "Wardrobe & Sliding Systems",
    shortDesc: "Hettich soft-close sliding fittings, pull-out trousers racks, sensor wardrobe profiles",
    iconName: "Layers",
    itemCount: 8,
  },
  {
    id: "smart",
    title: "Smart Security & Living",
    shortDesc: "Hafele Smart Living & Dorset biometric entry, WiFi app-controlled smart deadbolts",
    iconName: "ShieldCheck",
    itemCount: 6,
  },
  {
    id: "architectural",
    title: "Architectural & Glass Fittings",
    shortDesc: "Shower cubicle hinges, spider fittings, SS 304 glass brackets, luxury profile handles",
    iconName: "Building2",
    itemCount: 8,
  },
];

export const SHOWROOM_ZONES: ShowroomZone[] = [
  {
    id: "bay-1",
    bayNumber: "Bay #1",
    title: "Modular Kitchen & Häfele Soft-Close Tandem Bay",
    category: "Kitchen & Appliances",
    description: "Experience fully functional modular kitchen units featuring Häfele Matrix Box drawer systems, corner carousel magic corners, and Labacha quartz sinks with live water displays.",
    featuredProducts: ["hafele-matrix-drawer", "labacha-quartz-sink-black"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    highlights: ["Live Water Test Faucets", "Corner Carousel Pull-Outs", "Soft-Close Drawer Systems"]
  },
  {
    id: "bay-2",
    bayNumber: "Bay #2",
    title: "Biometric & Digital Lock Experience Bar",
    category: "Smart Security",
    description: "Test drive live smart biometric locks from Dorset, Godrej, and Häfele. Experience instant 0.3s fingerprint scanning, RFID keycard entry, PIN codes, and mobile app unlocking.",
    featuredProducts: ["dorset-biometric-x1", "godrej-advantis-revolution"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    highlights: ["Fingerprint Speed Demo", "Mobile App Unlock Bar", "Emergency Key Override Test"]
  },
  {
    id: "bay-3",
    bayNumber: "Bay #3",
    title: "Main Entrance Mortise & Designer Handle Gallery",
    category: "Door Locks & Handles",
    description: "Browse over 80+ full-sized door panels displaying Dorset, Häfele, and Kich mortise handles in PVD Rose Gold, Satin Chrome, Antique Brass, and Matte Black finishes.",
    featuredProducts: ["dorset-pvd-mortise-rose", "hafele-3d-concealed-hinge"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    highlights: ["Full-Size Door Mounting", "PVD Finish Touch & Feel", "Heavy-Duty Concealed Hinges"]
  },
  {
    id: "bay-4",
    bayNumber: "Bay #4",
    title: "Luxury Bathroom & Glass Shower Suite",
    category: "Bath Fittings",
    description: "Immerse in luxury bath fittings including Labacha designer rain showers, solid brass thermostatic mixers, SS 304 glass cubicle brackets, and anti-odor linear floor drains.",
    featuredProducts: ["labacha-thermostatic-shower", "kich-glass-patch-fitting"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    highlights: ["Thermostatic Water Control", "Frameless Glass Brackets", "Anti-Odor Floor Drain Demo"]
  },
  {
    id: "bay-5",
    bayNumber: "Bay #5",
    title: "Wardrobe Sliding & LED Profile Living Bay",
    category: "Wardrobe & Sliding",
    description: "Discover Hettich top-running sliding door fittings, internal wardrobe pull-outs, trouser racks, shoe organizers, and motion-sensor aluminum LED wardrobe profiles.",
    featuredProducts: ["hettich-sliding-system", "hafele-wardrobe-lift"],
    image: "/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png",
    highlights: ["Silent Top-Running Sliding", "Sensor LED Illumination", "Ergonomic Wardrobe Lifts"]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "dorset-biometric-x1",
    name: "Dorset Biometric Smart Digital Lock X1",
    category: "smart",
    categoryLabel: "Biometric & Smart Digital Locks",
    brand: "Dorset",
    model: "X1-SMART-PVD",
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
    warranty: "3 Years On-Site Manufacturer Warranty",
    priceRange: "₹₹₹ Luxury Security",
    mrp: "₹24,500",
    showroomBay: "Bay #2: Digital Lock Bar",
    displayStatus: "Live Display"
  },
  {
    id: "hafele-matrix-drawer",
    name: "Häfele Matrix Box Premium Soft-Close Tandem Drawer",
    category: "kitchen",
    categoryLabel: "Modular Kitchen Systems",
    brand: "Hafele",
    model: "MATRIX-BOX-S",
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
    whatsappMessage: "Hi Hardware Collection, I would like a quotation for Häfele Matrix Box Tandem Drawers.",
    material: "Galvanized Steel Rail with Epoxy Powder Coating",
    durability: "LGA Certified 100,000 Cycles",
    dimensions: "Depth: 500mm / Height: 84mm & 168mm",
    warranty: "10 Years German Warranty",
    priceRange: "₹₹ German Architectural",
    mrp: "₹6,800 per set",
    showroomBay: "Bay #1: Kitchen Bay",
    displayStatus: "Live Display"
  },
  {
    id: "labacha-quartz-sink-black",
    name: "Labacha Double Bowl Quartz Granite Kitchen Sink",
    category: "kitchen",
    categoryLabel: "Modular Kitchen Systems",
    brand: "Labacha",
    model: "LAB-QUARTZ-860",
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
    warranty: "10 Years Manufacturer Replacement Warranty",
    priceRange: "₹₹ Luxury Kitchen",
    mrp: "₹18,900",
    showroomBay: "Bay #1: Kitchen Bay",
    displayStatus: "Live Display"
  },
  {
    id: "godrej-advantis-revolution",
    name: "Godrej Advantis Revolution Biometric Door Lock",
    category: "smart",
    categoryLabel: "Smart Security & Living",
    brand: "Godrej",
    model: "ADVANTIS-REV-PRO",
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
    warranty: "2 Years Godrej Direct Warranty",
    priceRange: "₹₹ High-Trust Security",
    mrp: "₹21,000",
    showroomBay: "Bay #2: Digital Lock Bar",
    displayStatus: "Live Display"
  },
  {
    id: "hettich-sliding-system",
    name: "Hettich TopLine XL Soft-Close Wardrobe Sliding System",
    category: "wardrobe",
    categoryLabel: "Wardrobe & Sliding Systems",
    brand: "Hettich",
    model: "TOPLINE-XL-PRO",
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
    durability: "German Din Standard 50,000 Cycles",
    dimensions: "Track Length: 3000mm / Door Thickness: 18-50mm",
    warranty: "5 Years Manufacturer Warranty",
    priceRange: "₹₹₹ German Precision",
    mrp: "₹14,500 per kit",
    showroomBay: "Bay #5: Wardrobe Sliding Bay",
    displayStatus: "Live Display"
  },
  {
    id: "kich-glass-patch-fitting",
    name: "Kich Architectural Glass Patch Fitting & Door Pivot Set",
    category: "architectural",
    categoryLabel: "Architectural & Glass Fittings",
    brand: "Kich",
    model: "KICH-SS316-PATCH",
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
    warranty: "5 Years Replacement Guarantee",
    priceRange: "₹₹ Architectural Grade",
    mrp: "₹4,200 set",
    showroomBay: "Bay #4: Bath & Glass Suite",
    displayStatus: "Live Display"
  }
];

export const SHOWROOM_STATS = [
  { label: "Years in Business", value: "21+", sub: "Serving Jamshedpur since 2002" },
  { label: "Showroom Size", value: "7,500", sub: "Sq Ft Display in Sakchi" },
  { label: "Authorized Brands", value: "6 Premium", sub: "Hafele, Dorset, Labacha, Godrej, Hettich, Kich" },
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

