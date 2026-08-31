# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-primary audiences with genuinely different jobs. Future work must serve both without collapsing one into the other.

**Interior designers and architects.** Specifying hardware for client projects — door schedules, wardrobe channels, kitchen systems, lock hardware. They arrive knowing the vocabulary, need technical detail and confirmed brand availability, and value a supplier who can read a blueprint and spec a complete schedule rather than sell an item. They evaluate on range, authenticity, and whether the person on the other end understands the drawing.

**Homeowners renovating.** Families in and around Jamshedpur upgrading a kitchen, doors, wardrobes, or bathrooms. They are choosing finishes largely for themselves, comparing on appearance and durability, and are unsure which brands are genuine. They need orientation and reassurance before committing to a visit.

Contractors and bulk builders are a real but secondary audience. Their needs — stock depth, repeat supply, fast contact — are largely served by the same paths and do not get dedicated design work at the cost of the two primary audiences.

## Product Purpose

A public showroom site for Hardware Collection, an architectural hardware, digital lock, and modular kitchen systems retailer in Sakchi, Jamshedpur. Its job is to establish that the physical showroom is worth the trip, and to hand the visitor to a person.

The site does not transact. There is no cart, no pricing, and no checkout. Success is a visitor arriving at the Sakchi showroom, or opening a WhatsApp conversation with a specialist carrying enough context — product, brand, SKU, category — that the conversation starts usefully.

## Positioning

**Scale of physical display.** The showroom carries a breadth of architectural hardware, security, and kitchen systems on live display that a visitor cannot see anywhere else nearby — not a catalog to order from, but the actual range, physically present and testable.

This is confirmed positioning *intent*, not a measured competitive fact. It has never been benchmarked against other showrooms in the district or the state. Future public copy must express it through concrete, verifiable showroom facts — floor area, breadth of live displays, brand count, working demonstrations — and must not assert a comparative ranking. See `## Evidence on Hand` for the superlatives currently in the codebase that this constrains.

Supporting truths that are separately verifiable and may be stated plainly: authorized dealership status across the brand roster, operating in Sakchi since 2002, growth from a 113 sq ft shop to a 7,500 sq ft showroom, and live functional demonstrations — soft-close drawer motion, biometric and digital lock operation, kitchen setups.

## Operating Context

- **Discovery is local and mobile-heavy.** Visitors find the business through Google Search and Google Business Profile in the Jamshedpur area, frequently on mid-range Android devices over mobile data. Load performance is an audience-reach concern, not only a technical one.
- **The showroom is the destination.** 1/18, Kashidih, Near Baradwari Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001. Open 10:00 AM – 8:00 PM, Monday through Sunday. NAP consistency across the site, Google Business Profile, and Maps is an operating requirement.
- **Conversion runs through WhatsApp to a named person.** Primary phone +91 98351 90738; WhatsApp 919835190738. Product-level inquiries carry a prefilled message containing the product and brand so the specialist has context before replying. A separate technical-consultation line exists at wa.me/919431111550.
- **Leads are captured to a Google Sheet pipeline** via webhook. The Prisma/Postgres `Lead` model exists for lead capture only and holds no catalog data.
- **Content is owned by CMS editors, not engineers.** Sanity is the single source of truth for products, categories, brands, and site settings. The site renders canonical fallback data when Sanity returns nothing, so an empty CMS degrades gracefully rather than breaking.
- **Designers often arrive mid-project** with a drawing or specification already in hand; homeowners usually arrive at the start, with a room and a budget and no vocabulary.

## Capabilities and Constraints

**Locked scope.** Public routes are `/` (home) and `/collections` (catalog) only, plus the Sanity Studio at `/studio`. No pricing, no e-commerce, no cart. Feature development is frozen; the project is in its production launch phase.

**Content integrity rules.** No fake, mock, or placeholder products may ever ship. Public source PDFs may not be substituted for official brand catalogs — official catalogs are an owner dependency and remain outstanding.

**Authorized brands.** All twenty-three brands presented in the brand strip are authorized dealerships: Häfele, Blum, Hettich, Dorset, GEZE, Godrej, Yale, Jaquar, Asian Paints, Philips, Ozone, Helix, Labacha, Liftor, Shapes, Decore, Furnipart, Pans, Backer, Tattva, Rexton, Madhuram, Marnello. This supersedes the older six-brand restriction recorded in `.planning/STATE.md`, which is stale; that file should be corrected so the two records do not conflict. The count 23 is currently hardcoded in two places — the stat row in `FloatingCTA.tsx` and the third scene in `ShowroomCinematic.tsx` — and will drift as the roster changes; deriving it from the brand list is the durable fix.

**Catalog structure.** Thirteen canonical categories, with six surfaced category families: door hardware and locks, modular kitchen systems, biometric and digital locks, luxury bathroom fittings, wardrobe and sliding systems, architectural glass hardware. Canonical catalog data merges with Sanity content by slug.

**Frozen motion architecture.** Next.js App Router with three motion engines held to one dominant motion idea per viewport: `motion/react` for UI, drawers, and transitions; GSAP `useGSAP()` / `matchMedia()` for the cinematic horizontal journey; Three.js / React Three Fiber for a single isolated product moment. WebGL, horizontal scroll, and the custom cursor are gated to viewports ≥1024px. Conversion controls must remain stable, predictable, and immediately clickable regardless of motion state.

**Performance gates.** LCP ≤ 2.5s, CLS ≤ 0.10, INP ≤ 200ms. The Three.js bundle is excluded from the initial route chunk and loads on desktop only.

**Undecided product facts.** Whether the site launches with real reviews published in Sanity or with the review blocks withheld. Verification of the "4.4 ★ · 55+" Google aggregate. Timing of official brand PDF catalogs, and of image population by CMS editors.

## Brand Commitments

- **Name:** Hardware Collection. Logo asset at `/public/Hardware Collection/`.
- **Voice:** Architectural and specification-literate rather than retail-promotional. Product language is material- and mechanism-led — finish, motion, mortise, channel, PVD, soft-close — and speaks to someone specifying, not someone bargaining.
- **Visual identity, recorded as binding in `.planning/STATE.md`:** Cormorant Garamond for display and DM Sans for body; near-black `#131314` with gold `#e5c487` / `#c8a96e`. Recorded here as an existing constraint on future work, not elaborated — the visual system itself belongs in DESIGN.md.
- **Founder:** Mukesh Khandelwal, named in customer-facing copy and the final authority on business-truth claims. The founding principle stated on the site — never sell grey-market hardware, only genuine authorized brand engineering with hands-on consultation — is confirmed brand voice.

## Evidence on Hand

**Real and usable.**

- Verified NAP, hours, phone, WhatsApp numbers, and Google Maps link, live in `src/components/Footer.tsx`.
- Founding facts: operating in Sakchi since 2002; grown from a 113 sq ft shop to a 7,500 sq ft showroom.
- Twenty-three authorized brand logo assets in `/public/brands/`.
- Cinema and showroom photography in `/public/cinema/`.
- Thirteen canonical categories and the product catalog in `src/content/fallback/catalog.ts`.
- Live functional demonstrations in the showroom: soft-close drawer motion, biometric and digital lock operation, kitchen setups.

**Absent — future work must not fabricate around these.**

- **No real customer testimonials are on the site yet.** The three fabricated reviews ("Rajiv Sharma", "Anita Sen", "Vikramaditya Roy") were removed on 2026-08-27. `src/components/Testimonials.tsx` was dead code and is deleted; `FloatingCTA` and `MobileReviews` now render only Sanity `testimonial` documents where `approved == true`, and withhold their review blocks entirely when none exist. The pipeline — the `testimonial` schema, `getTestimonialsQuery`, and the Studio list — already existed and is now the only permitted source. Review content must never be hardcoded in a component again. Until an editor publishes real reviews, the site shows none.
- **The aggregate rating claim is unverified in this record.** Both review blocks state "4.4 ★ · 55+ Verified Google Reviews" beside a link to the Maps listing. It is plausibly the real Google Business Profile aggregate but has not been confirmed here; check it against the live profile before launch, since it is a public factual claim. A now-deleted component claimed "4.8 ★" for the same listing, so at least one of the two figures was invented — treat the surviving number as unverified until checked.
- **Two dead components carried fabricated reviews.** `src/components/Testimonials.tsx` and `src/components/home/ReviewsSlide.tsx` were both unreferenced and both held invented, named testimonials; both are deleted. Before launch, confirm no other unreferenced component is still holding invented content.
- **No measured basis exists for any comparative superlative.** The two first-party claims were corrected on 2026-08-27: `src/components/home/ShowroomCinematic.tsx` and `src/components/ShowroomExperience.tsx` now carry the verifiable 7,500 sq ft figure and the 2002 growth arc in place of state- and city-level rankings. "Largest physical stock display in the entire district" existed only inside the fabricated testimonials and went with them. A second sweep found two more: "Jamshedpur's most comprehensive architectural hardware destination" in the desktop scene data of `ShowroomCinematic.tsx`, and "the showroom experience is unmatched" inside `ReviewsSlide.tsx` — both since removed. No comparative ranking now appears in any rendered copy, and none may be reintroduced without measurement behind it. Search for `most`, `largest`, `leading`, `finest`, `premier`, and `unmatched` before shipping new copy; the first sweep here used too narrow a pattern and missed live claims.
- **Official brand PDF catalogs are outstanding** and are an owner dependency. Public source PDFs are not an acceptable substitute.
- **The 3D product asset is placeholder geometry.** The specified deliverable is a signature architectural pull or mortise handle as compressed `.glb` under 50k polygons, with PVD satin brass and matte black PBR materials.
- **Macro product photography is specified but not delivered:** tactile close-up of knurled and brushed metal, five isolated finish plates, and a wide architectural capture of the Sakchi showroom.
- **Sanity image population by CMS editors is pending.** The dataset fetches successfully; imagery is not yet in place.
- No pricing, stock counts, delivery terms, or warranty terms have been established as public claims.

## Product Principles

1. **Two jobs, one site.** Designers and homeowners are co-primary. Never sharpen one path by degrading the other — a specification-literate detail must not make the homeowner feel unqualified, and reassurance for the homeowner must not make the designer feel talked down to.
2. **Show scale, never rank it.** Inventory depth is the positioning, but it is earned through concrete facts a visitor can verify — floor area, brand count, working demonstrations — not through comparative superlatives nobody has measured.
3. **The room is the close.** Every path terminates in a reason to walk into Sakchi, or to message a person who knows the stock. Nothing is transacted online, so the site is judged on visits and conversations started, not on time spent.
4. **Only what is real ships.** No placeholder products, no invented reviews, no unverified claims, no substituted catalogs. When the true asset is missing, the honest move is to omit the section, not to fill it.
5. **Conversion outranks expression.** The site carries ambitious motion, but a visitor must be able to reach a CTA at any moment — stable, predictable, immediately clickable — regardless of what is animating around it.

## Accessibility & Inclusion

- **Reduced motion is a first-class path,** not a degradation. `MotionConfig reducedMotion="user"` is honored across all three motion engines; WebGL is disabled and animation reduces to simple opacity transitions with static layouts.
- **Full keyboard operability with visible focus** is required. `focus-visible` treatment was added project-wide; a complete keyboard audit remains an open launch gate.
- **Device reach is an inclusion requirement.** A substantial share of the local audience browses on mid-range Android over mobile data. Tablet and mobile receive no WebGL, no custom cursor, and no horizontal scroll — a clean vertical editorial experience with static photographic fallbacks and zero horizontal overflow.
- **Touch targets and tap response** on the mobile conversion bar — call, WhatsApp, visit — must remain reliably reachable and instantly responsive; it is the primary conversion surface for most visitors.
