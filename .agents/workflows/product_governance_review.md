<!-- generated-by: gsd-doc-writer -->
# Product Governance Review Workflow

**Trigger:** `/workflow product_governance_review`

## Purpose

Catch product drift after an iteration: scope creep beyond the locked routes, content that
breaks the "only what is real ships" rule, unverified public claims, and changes that make
it harder to reach a showroom visit or a WhatsApp conversation. Hardware Collection is a
lead-generation showroom site — no cart, no pricing, no checkout.

## When to run

- After any iteration that changes copy, navigation, CTAs, or components under `src/components/`.
- Before `production_readiness`.

## Inputs

- `PRODUCT.md` — the source of truth. Use `## Capabilities and Constraints` (locked scope,
  content integrity, performance gates), `## Evidence on Hand` (known unverified claims),
  `## Product Principles` and `## Accessibility & Inclusion`.
- `docs/ARCHITECTURE.md` — where code belongs.
- `src/app/`, `src/components/`, `src/content/sanity/`, `src/content/fallback/`.

## Steps

1. **Scope.** List page routes with `find src/app -name page.tsx`. Only `/`, `/collections`,
   `/catalogues`, `/privacy`, `/terms` and `/studio` may exist. Any new route, or any
   pricing, cart, checkout or "buy" UI, is a finding. Run `npm test`:
   `src/lib/collections/__tests__/routeInventory.test.ts` fails on links to
   `/collections/<slug>`.
2. **Content ownership.** Sanity (`src/content/sanity/`) is the canonical content source.
   New product, brand or review content added under `src/content/fallback/` or hardcoded in
   a component is a finding. Reviews must come only from approved Sanity `testimonial`
   documents.
3. **No fabricated content.** Search changed files for placeholder or invented products,
   names and reviews. Search rendered copy for comparative superlatives — `most`, `largest`,
   `leading`, `finest`, `premier`, `unmatched` — as `PRODUCT.md` instructs.
4. **Unverified claims.** Re-check every item `PRODUCT.md` `## Evidence on Hand` still
   marks unverified (for example the "4.4 ★ · 50+" Google aggregate). Report whether it is
   still rendered and whether it has been confirmed.
5. **Conversion paths.** Confirm call, WhatsApp and visit CTAs remain reachable on every
   public route, and that product-level enquiries keep their prefilled message (category, brand, search and general builders)
   (`src/lib/integrations/whatsapp.ts`). `tests/e2e/mobile-journeys.spec.ts` and
   `tests/e2e/motion-protocol.spec.ts` cover the mobile conversion bar and CTA stability —
   run `npm run test:e2e`.
6. **NAP consistency.** Address, phone and opening hours shown on the site must match
   `PRODUCT.md` `## Operating Context`.
7. **Lead capture.** Changes to `src/lib/leads/schema.ts` or `src/app/api/leads/route.ts`
   must still capture leads only — the Prisma `Lead` model holds no catalogue data.
8. **Telemetry.** There is no product analytics SDK in `package.json`. Do not add one or
   assume one; if measurement is needed, raise it as an open question.

## Pass/fail criteria

- **MUST FIX:** a route outside the locked scope; pricing/cart/checkout UI; fabricated
  products or reviews; a new unmeasured superlative; a broken call/WhatsApp/visit path.
- **SHOULD FIX:** content authored in `src/content/fallback/` instead of Sanity; NAP mismatch;
  a still-unverified claim rendered without an owner decision.
- **Pass:** steps 1–7 produce no MUST FIX items.

## Output

`docs/reviews/product-governance-YYYY-MM-DD.md` (create `docs/reviews/` on first run):
findings by severity with file paths, the status of each `## Evidence on Hand` item, and
open questions for the owner.
