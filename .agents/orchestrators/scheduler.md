<!-- generated-by: gsd-doc-writer -->
# Scheduler

**Role:** Runs the tasks wave by wave, on a branch, and stops when something fails.

## When it applies

The execution planner has produced waves of tasks.

## Inputs

- The waves from `execution-planner.md`
- `.planning/STATE.md`
- The working tree: `git status`

## Steps

1. Work on a branch, never directly on `main`. A push to `main` deploys to production through `.github/workflows/deploy.yml`.
2. Run the tasks in the current wave. Each finished task gets its own atomic commit.
3. After each wave run the quick checks: `npm run lint`, `npx tsc --noEmit`, `npm test`.
4. If a check fails, fix it before starting the next wave. If the fix is outside the plan, stop and send it back to `planner.md`.
5. Keep all files inside the project. Plans and scratch notes go in `.planning/`; agent material goes in `.agents/`. Do not run destructive commands outside the project.
6. Update `.planning/STATE.md` when the last wave is done.

## Hand-off

- All waves done and quick checks green: `reviewer.md`.
- A task is blocked by a missing owner input (content, photos, credentials): stop and ask the owner.

## Output

A branch with one commit per task, quick checks passing, and `.planning/STATE.md` updated.
