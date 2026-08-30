# Rejected Ideas (The "Never Build" List)

Validation is as much about discovering what **not** to build as it is about what to build. This list captures features, ideas, and UI elements that were rejected by users during validation sprints, preventing future engineering waste.

Every time a designer ignores a feature, mistrusts an AI explanation, or bypasses a tool, add it here.

## Sprint: Phase 16 Designer Brief Validation

*Awaiting results from the 5-10 designer interviews...*

*(Examples to track)*
- Did designers ignore a specific section of the brief?
- Was the AI explanation for a recommendation mistrusted?
- Was the confidence gauge ignored?
- Was the raw evidence table never opened?

## Phase 9 — Collections Guided Discovery (2026-08-30)

- **Lifting `<Footer>` into `RootLayout`** — `Footer` is independently rendered and fetched in
  `app/page.tsx`, `CollectionsClient.tsx` and `CatalogsClient.tsx` today; `/collections/[slug]`
  would make it a 4th duplicated fetch. RESEARCH.md (Pitfall 8) confirms `Footer` already
  self-suppresses on `/studio` and would be safe to lift, but this is an optional architecture
  improvement, not required by any Phase 9 decision — deferred, revisit only if a future phase
  needs to touch `Footer`'s data flow anyway.
