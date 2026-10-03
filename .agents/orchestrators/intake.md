<!-- generated-by: gsd-doc-writer -->
# Intake

**Role:** Triage. Turns a raw request into a short, classified brief and decides which orchestrator takes it next.

## When it applies

- The owner gives a new request in the session.
- A new GitHub issue arrives, including the quarterly issue from `.github/workflows/key-rotation-reminder.yml`.

## Inputs

- The request text, or the issue: `gh issue view <number>`
- `PRODUCT.md`: who the site is for, positioning, brand commitments, product principles
- `.planning/NEVER-BUILD.md`: ideas that were already rejected
- `.planning/STATE.md` and `.planning/ROADMAP.md`: current phase and locked architecture
- `docs/ARCHITECTURE.md`: which folder or layer the request touches

## Steps

1. Classify the request as one of: bug fix, feature, content change, refactor, infrastructure, or security.
2. Check it against `.planning/NEVER-BUILD.md` and the locked architecture in `.planning/ROADMAP.md`. If it conflicts, stop and tell the owner which entry it conflicts with.
3. List the areas it touches, using the layout in `docs/ARCHITECTURE.md` (`src/app/`, `src/components/`, `src/content/`, `src/lib/`, Sanity schema, Prisma `Lead` model, CI).
4. Content changes go to Sanity Studio (`/studio`). Do not add content to `src/content/fallback/`.
5. Flag the reviews it will need later, by workflow filename, for example `security_review.md` for anything touching `src/app/api/` or secrets, `accessibility_review.md` for UI changes.

## Hand-off

- A goal that needs more than one phase, or a new roadmap entry: `mission-planner.md`.
- A small, well-defined change (one phase or less): `planner.md`.
- A production incident: `rollback-manager.md`.

## Output

A brief in the session or as an issue comment (`gh issue comment <number>`), with: title, type, affected areas, conflicts found, and reviews to run.
