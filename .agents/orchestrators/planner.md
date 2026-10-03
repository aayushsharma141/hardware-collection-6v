<!-- generated-by: gsd-doc-writer -->
# Planner

**Role:** Breaks one approved phase or change into small, ordered tasks, each with a way to check it is done.

## When it applies

- The decision engine has approved a phase.
- Intake has passed a small, well-defined change straight through.

## Inputs

- The approved phase in `.planning/ROADMAP.md`, or the intake brief
- `docs/ARCHITECTURE.md`: where new code belongs
- `src/components/README.md`, `src/content/README.md`, `src/lib/README.md`: what belongs in each folder
- `.planning/STATE.md`
- Earlier phase folders in `.planning/phases/` for context

## Steps

1. Read the relevant code before writing tasks. Do not plan changes to files you have not opened.
2. Write tasks small enough for one atomic commit each. Each task names the files it touches and how to check it (a command, a test, or what to look at on the page).
3. Put dependencies first, for example a Sanity schema change before the component that reads the new field, or a Prisma `Lead` change before the API route that writes it.
4. Mark any task that changes the production database: there are no Prisma migrations, so schema changes are applied by hand (see `docs/DEPLOYMENT.md`).
5. Attach the definition of done for the phase (below).

## Definition of done

- The six gates in `scripts/release-verification.ts` pass: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm audit --audit-level=critical`, and evidence schema validation.
- New behaviour has tests (`npm test`; `npm run test:e2e` for browser flows).
- Docs that describe the changed area are updated (`docs/ARCHITECTURE.md`, the folder READMEs, `docs/CONFIGURATION.md` for new environment variables).
- `.planning/STATE.md` reflects the new state.

## Hand-off

`execution-planner.md`.

## Output

A plan in a phase folder under `.planning/phases/` (existing folders use `NN-slug/`, for example `13-cms-photography-offers/`), or in the session for small changes: ordered tasks, files, checks, and the definition of done.
