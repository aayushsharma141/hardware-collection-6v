<!-- generated-by: gsd-doc-writer -->
# Architecture Review Workflow

**Trigger:** `/workflow architecture_review`
**Purpose:** Check that changes respect the folder boundaries, content ownership rule and data-access paths described in `docs/ARCHITECTURE.md`.

---

## When to run

- When a change adds a folder, a route under `src/app/`, a Sanity schema, or a new data source.
- When a change touches `src/content/`, `src/lib/leads/` or `prisma/schema.prisma`.

## Inputs

- `docs/ARCHITECTURE.md` (the source of truth for this review), plus `src/components/README.md`, `src/content/README.md` and `src/lib/README.md`.
- The diff under review (`git diff main...HEAD`).

## Steps

1. **Six concerns.** New files sit in one of `src/app/`, `src/components/`, `src/content/`, `src/hooks/`, `src/lib/` or `src/types/`, and in the folder the "Where does new code go?" table in `docs/ARCHITECTURE.md` names.
2. **No loose component files.** `find src/components -maxdepth 1 -type f` should list only `README.md`. A component goes in `src/components/ui/` only when a third domain uses it.
3. **Content ownership.** Anything a non-developer would edit comes from Sanity (`src/content/sanity/queries.ts`, schemas in `src/content/sanity/schemaTypes/`). Flag any diff that adds or changes site copy in `src/content/fallback/`. Those tables are a resilience fallback, not an authoring location. Also flag new hardcoded content in route files; `fallbackHeroSlides` in `src/app/page.tsx` is a known existing case.
4. **Route shape.** `page.tsx` files are Server Components that fetch and merge content. Interactivity sits behind a `*Client.tsx` boundary (`CollectionsClient.tsx`, `CatalogsClient.tsx`). Flag `"use client"` on a `page.tsx`.
5. **Data access.** Prisma (the `Lead` model only) may be imported only from `src/lib/leads/` and the lead API routes (`src/app/api/leads/route.ts` and `src/app/api/leads/retry/route.ts`). Check with `grep -rln "@prisma/client\|lib/leads/createLead" src`. Components must never query the database or call Sanity directly.
6. **Client state.** Zustand is used only in `src/components/consultation/store.ts`. A new store needs a reason: state shared across components that props can't reasonably carry. Stores must not cache Sanity or server data.
7. **Circular imports (manual).** The repo has no dependency-graph tool. For each new import between domains in `src/components/` or `src/lib/`, confirm the reverse import doesn't also exist.
8. **Docs drift.** If the change alters a rule or a flow, update `docs/ARCHITECTURE.md` in the same PR.

## Pass/fail criteria

- **MUST FIX (fail):** content authored in `src/content/fallback/`; database or Sanity access from a component; a circular import; a new top-level folder in `src/`.
- **SHOULD FIX:** a file in the wrong domain folder; an inline Sanity-over-fallback merge copied into another route (see "Known gaps" in `docs/ARCHITECTURE.md`); `docs/ARCHITECTURE.md` not updated for a structural change.
- **COULD FIX:** extracting a shared content adapter.
- **IGNORED:** generated output (`.next/`, `public/pdfjs`), plus `_quarantine/` and `_archive/`, which aren't live code.

## Output

Write `docs/reviews/architecture-review-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. List each finding with its file, the rule broken (cite the `docs/ARCHITECTURE.md` section) and the severity.
