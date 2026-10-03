<!-- generated-by: gsd-doc-writer -->
# Mission Planner

**Role:** Turns a larger goal into one or more roadmap phases with acceptance criteria.

## When it applies

Intake has classified a request as too large for a single phase, or the owner asks for a new milestone.

## Inputs

- The intake brief
- `PRODUCT.md`: product purpose, principles, constraints
- `.planning/ROADMAP.md`: existing phases and the locked architecture
- `.planning/STATE.md`: what is in progress and what is blocked
- `.planning/NEVER-BUILD.md`
- `docs/ARCHITECTURE.md`

## Steps

1. State the user problem and the business reason in two or three sentences, in the terms used by `PRODUCT.md`.
2. Split the goal into phases that can each ship on their own. Keep the locked architecture in `.planning/ROADMAP.md` unless the owner agrees to change it.
3. Write acceptance criteria for each phase that someone can check on the running site or with a command.
4. Note dependencies on the owner (photos, catalogues, Sanity content, credentials) separately from engineering work.
5. Name the reviews each phase will need, by workflow filename in `.agents/workflows/`.

## Hand-off

`decision-engine.md`, to decide whether and when the proposed phases go ahead.

## Output

Proposed phase entries for `.planning/ROADMAP.md` (goal, acceptance criteria, owner dependencies, reviews). Nothing is added to the roadmap until the decision engine records a go.
