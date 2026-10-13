import type { CategoryTerms } from "./types";

/**
 * The words that put a catalogue page under each showroom category.
 *
 * This is search vocabulary, not taxonomy: it decides which catalogue pages a
 * category finds, never which family a category sits in (that is `primaryRail`
 * in the CMS). Keys are Sanity category slugs; a category without an entry shows no brands.
 *
 * Phrases are matched on stemmed, accent-folded tokens, so "drawer runners"
 * also covers "drawer runner". A page qualifies only through a `strong` term;
 * `weak` terms add weight and `exclude` terms (the neighbouring categories'
 * words) take it away. Owners can tune these without touching the matcher.
 */
export const CATEGORY_TERMS: Readonly<Record<string, CategoryTerms>> = {
  "digital-locks": {
    strong: [
      "digital lock", "smart lock", "smart door lock", "fingerprint lock", "fingerprint", "biometric lock",
      "biometric", "rfid", "keypad", "touch keypad", "face recognition", "wifi lock", "deadbolt", "mobile app",
    ],
    weak: ["pin code", "card access", "battery", "emergency key", "otp", "unlock"],
    exclude: ["safe deposit", "jewellery safe", "jewelry safe", "locker"],
  },
  "mortise-door-locks": {
    strong: [
      "mortise lock", "mortice lock", "mortise", "mortice", "lock body", "lockcase", "euro cylinder",
      "profile cylinder", "cylinder lock", "hotel lock", "night latch", "rim lock", "latch bolt", "master key",
    ],
    weak: ["cylinder", "backset", "faceplate", "escutcheon", "latch", "key"],
  },
  "main-door-handles": {
    strong: [
      "main door handle", "door handle", "entrance handle", "entrance door", "pull handle", "door pull",
      "lever handle", "lever on rose", "lever on plate", "door lever", "mortise handle",
    ],
    weak: ["handle", "lever", "entrance", "pvd", "rosette", "brass"],
    // "lever set" and "handle set" also name lift-system and hinge parts.
    exclude: ["cabinet handle", "wardrobe handle", "furniture handle", "drawer handle", "lift system", "hinge handle"],
  },
  "cabinet-wardrobe-handles": {
    strong: [
      "cabinet handle", "wardrobe handle", "furniture handle", "drawer handle", "bar handle", "profile handle",
      "edge pull", "j pull", "cabinet knob", "furniture knob", "drawer knob", "cup handle", "flush handle",
    ],
    weak: ["handle", "knob", "pull", "centre to centre", "center to center"],
    // A bare "knob" is as often a door knob or a lock's thumbturn as a cabinet knob.
    exclude: ["door handle", "main door", "entrance", "lever handle", "door lock", "mortise", "thumbturn", "towel bar"],
  },
  "modular-kitchen-hardware": {
    strong: [
      "modular kitchen", "kitchen accessories", "kitchen accessory", "corner carousel", "carousel", "magic corner",
      "pantry unit", "tall unit", "pull out basket", "pullout basket", "wire basket", "cutlery tray", "thali",
      "bottle pull out", "kitchen organiser", "kitchen organizer", "base unit", "wall unit",
    ],
    weak: ["kitchen", "basket", "pantry", "corner", "cabinet", "pull out"],
    exclude: ["faucet", "bathroom"],
  },
  "kitchen-sinks-faucets": {
    strong: [
      "kitchen sink", "faucet", "sink mixer", "stainless steel sink", "sink bowl", "quartz sink", "granite sink", "composite sink",
      "workstation sink", "pull out faucet", "kitchen mixer", "single bowl", "double bowl",
    ],
    weak: ["sink", "bowl", "drain", "waste coupling", "basin", "quartz"],
  },
  "wardrobe-hardware-sliding": {
    strong: [
      "wardrobe sliding", "sliding wardrobe", "sliding system", "sliding door system", "sliding fitting",
      "pull down lift", "wardrobe lift", "trouser rack", "tie rack", "belt rack", "wardrobe accessories",
      "wardrobe accessory", "pull out wardrobe", "wardrobe basket", "shoe rack", "clothes rail", "hanger rail",
      "clothes hanger", "wardrobe",
    ],
    weak: ["sliding", "rail", "hanger", "closet", "garment"],
    exclude: ["kitchen", "sink"],
  },
  "hinges-soft-close": {
    strong: [
      "soft close hinge", "concealed hinge", "cabinet hinge", "furniture hinge", "clip on hinge", "3d hinge",
      "sensys", "intermat", "soft close damper", "damper", "hinge", "soft close",
    ],
    weak: ["overlay", "inset", "opening angle", "hinge cup", "mounting plate"],
    exclude: ["glass door hinge", "fire door", "door hinge"],
  },
  "drawer-channels": {
    strong: [
      "drawer channel", "drawer runner", "drawer slide", "telescopic channel", "telescopic slide",
      "telescopic runner", "ball bearing slide", "ball bearing runner", "full extension", "soft close drawer",
      "push to open", "tandem box", "tandembox", "quadro", "drawer system", "undermount runner",
      "concealed runner", "drawer box", "side mount",
    ],
    weak: ["drawer", "runner", "slide", "extension", "load capacity", "synchronised", "synchronized"],
    exclude: ["sliding door", "wardrobe sliding", "sink"],
  },
  "bathroom-accessories": {
    strong: [
      "bathroom accessories", "bathroom accessory", "towel rail", "towel ring", "towel rod", "towel holder",
      "soap dish", "soap dispenser", "toilet paper holder", "paper holder", "robe hook", "bathroom shelf",
      "shower shelf", "mirror cabinet", "shaving mirror", "tumbler holder", "toothbrush holder", "grab bar",
      "accessory set",
    ],
    weak: ["bathroom", "towel", "soap", "bath", "mirror"],
    exclude: ["kitchen sink", "modular kitchen"],
  },
  "glass-hardware": {
    strong: [
      "glass door", "glass hardware", "patch fitting", "spider fitting", "glass hinge", "glass clamp",
      "glass connector", "shower hinge", "glass lock", "glass door lock", "frameless", "glass pull handle",
      "glass bracket", "glass holder", "shower enclosure", "toughened glass", "tempered glass",
    ],
    weak: ["glass", "toughened", "tempered", "floor spring"],
  },
  "door-closers-stoppers": {
    strong: [
      "door closer", "door stopper", "door stop", "floor spring", "hydraulic closer", "overhead closer",
      "concealed closer", "magnetic stopper", "door holder", "door damper", "closing speed", "latching speed",
      "closer",
    ],
    weak: ["stopper", "hold open", "en 1154", "fire door", "spring"],
  },
  safes: {
    strong: [
      "safe", "digital safe", "home safe", "biometric safe", "fire resistant safe", "jewellery safe",
      "jewelry safe", "strongbox", "locker",
    ],
    weak: ["fire resistant", "burglar", "combination lock", "bolt", "fireproof"],
    exclude: ["door lock", "mortise"],
  },

  // ── Categories added in Sanity beyond the original thirteen ──────────────
  // Classical, Italian, Luxury and Modern Collection are style names with no
  // product wording of their own; matching them would list brands on the
  // strength of marketing copy, so they are deliberately left out.

  "hotel-locks": {
    strong: ["hotel lock", "hotel door lock", "rfid lock", "card lock", "keycard", "key card", "guest room lock"],
    weak: ["rfid", "card", "guest", "encoder", "mifare"],
  },
  "door-knobs": {
    strong: ["door knob", "knob set", "knobset", "cylindrical knob", "tubular knob", "knob lock", "privacy knob"],
    weak: ["knob", "privacy", "passage", "entrance"],
    exclude: ["cabinet knob", "furniture knob", "drawer knob"],
  },
  "door-sliding": {
    strong: [
      "sliding door", "sliding door fitting", "sliding door system", "sliding door kit", "pocket door",
      "barn door", "door track", "top track", "bottom guide",
    ],
    weak: ["sliding", "track", "roller", "guide", "soft close"],
    exclude: ["wardrobe sliding", "sliding wardrobe", "wardrobe lock", "door lock"],
  },
  "window-hardware": {
    strong: [
      "window handle", "window hinge", "window stay", "friction stay", "window lock", "window fitting",
      "casement", "espagnolette", "tower bolt",
    ],
    weak: ["window", "stay", "sash", "upvc"],
  },
  "kitchen-accessories": {
    strong: [
      "kitchen accessories", "kitchen accessory", "pull out basket", "pullout basket", "wire basket", "cutlery tray",
      "corner carousel", "carousel", "magic corner", "bottle pull out", "thali", "plate rack", "kitchen organiser",
      "kitchen organizer", "waste bin",
    ],
    weak: ["kitchen", "basket", "tray", "organiser", "organizer"],
    exclude: ["bathroom", "faucet"],
  },
  "kitchen-appliances": {
    strong: [
      "kitchen appliance", "chimney", "built in hob", "hob", "cooktop", "built in oven", "microwave", "dishwasher",
      "induction",
    ],
    weak: ["burner", "suction", "appliance", "oven"],
  },
  lights: {
    strong: [
      "led light", "led profile", "cabinet light", "wardrobe light", "drawer light", "sensor light", "strip light",
      "spot light", "led strip", "led driver",
    ],
    weak: ["led", "light", "lighting", "lumen", "watt", "sensor"],
  },
  "long-bar-handles": {
    strong: ["long handle", "long bar handle", "bar handle", "tower handle", "wardrobe long handle"],
    weak: ["handle", "centre to centre", "center to center"],
    exclude: ["main door", "door lock", "mortise", "towel bar", "towel"],
  },
  "profile-handles": {
    strong: ["profile handle", "handle profile", "edge profile", "j profile", "g profile", "gola profile", "edge pull"],
    weak: ["profile", "handle", "aluminium", "aluminum"],
  },
  "flush-collection": {
    strong: ["flush handle", "flush pull", "recessed handle", "concealed handle", "sliding door pull"],
    weak: ["flush", "recessed", "handle"],
  },
  "ceramic-collection": {
    strong: ["ceramic handle", "ceramic knob", "porcelain handle", "porcelain knob"],
    weak: ["ceramic", "porcelain", "knob"],
  },
  "leather-collection": {
    strong: ["leather handle", "leather pull", "leather knob", "leather strap"],
    weak: ["leather", "handle"],
  },
  "wooden-collection": {
    strong: ["wooden handle", "wooden knob", "wood handle", "wood knob", "teak handle"],
    weak: ["wooden", "wood", "handle", "knob"],
  },
  "kids-collection": {
    strong: ["kids knob", "kids handle", "children knob", "children handle", "cartoon knob"],
    weak: ["kids", "children", "knob"],
  },
  "bathroom-shelf": {
    strong: ["bathroom shelf", "shower shelf", "glass shelf", "corner shelf", "shower caddy", "soap shelf"],
    weak: ["bathroom", "shower", "shelf"],
    // "glass shelfing" with LED profiles is cabinet lighting, not a bathroom shelf.
    exclude: ["kitchen", "led light", "wardrobe"],
  },
  dustbins: {
    strong: ["dustbin", "dust bin", "waste bin", "pedal bin", "garbage bin", "trash bin"],
    weak: ["bin", "waste", "pedal"],
  },
  hooks: {
    strong: ["robe hook", "towel hook", "coat hook", "wall hook", "cloth hook", "hook"],
    weak: ["bathroom", "towel", "robe"],
  },
  ladders: {
    strong: ["ladder", "step ladder", "folding ladder", "foldable ladder"],
    weak: ["step", "aluminium", "aluminum"],
    // A kitchen "pullout ladder unit" is a cabinet organiser, not a ladder.
    exclude: ["ladder unit", "pullout", "pull out"],
  },
  "mail-box": {
    strong: ["mail box", "mailbox", "letter box", "letterbox", "post box", "letter plate"],
    weak: ["mail", "letter"],
  },
  "shaving-mirrors": {
    strong: ["shaving mirror", "magnifying mirror", "cosmetic mirror", "makeup mirror"],
    weak: ["mirror", "magnifying", "bathroom"],
  },
  signages: {
    strong: ["signage", "sign plate", "door sign", "house number", "door number", "pictogram"],
    weak: ["sign", "number"],
  },
  "ss-mirror-cabinets": {
    strong: ["mirror cabinet", "bathroom cabinet", "ss cabinet", "stainless steel cabinet", "medicine cabinet"],
    weak: ["mirror", "cabinet", "bathroom"],
    exclude: ["kitchen", "wardrobe"],
  },
  "bed-fittings": {
    strong: [
      "bed fitting", "bed lift", "bed mechanism", "hydraulic bed", "bed connector", "bed hinge", "wall bed",
      "murphy bed", "bed bracket",
    ],
    weak: ["bed", "hydraulic", "storage"],
  },
  carvings: {
    strong: ["carving", "carved", "wooden carving", "decorative carving", "onlay"],
    weak: ["decorative", "ornamental", "wood"],
  },
  "furniture-locks": {
    strong: ["furniture lock", "cabinet lock", "drawer lock", "cam lock", "cupboard lock", "locker lock"],
    weak: ["lock", "cabinet", "drawer", "key"],
    exclude: ["mortise", "main door"],
  },
  "furniture-profiles": {
    strong: [
      "furniture profile", "aluminium profile", "aluminum profile", "glass profile", "shutter profile",
      "profile system", "frame profile",
    ],
    weak: ["profile", "aluminium", "aluminum", "frame", "shutter"],
  },
  "invisible-locks": {
    strong: ["invisible lock", "hidden lock", "concealed lock", "push lock"],
    weak: ["invisible", "hidden", "concealed", "magnetic", "lock"],
    exclude: ["shower", "glass door"],
  },
  "office-fittings": {
    strong: ["office fitting", "cable manager", "wire manager", "cable tray", "grommet", "keyboard tray", "cpu holder", "monitor arm"],
    weak: ["office", "desk", "cable", "workstation"],
  },
  "table-extension": {
    strong: ["table extension", "table slide", "extendable table", "extending table", "table mechanism"],
    weak: ["table", "extension", "dining"],
    // "Full extension slide" is a drawer runner.
    exclude: ["full extension", "drawer"],
  },
  "wheels-legs": {
    strong: [
      "furniture leg", "sofa leg", "table leg", "cabinet leg", "bed leg", "adjustable leg", "castor", "caster",
      "castor wheel", "furniture wheel",
    ],
    weak: ["leg", "height", "load", "wheel"],
    exclude: ["sliding door", "slide"],
  },
};
