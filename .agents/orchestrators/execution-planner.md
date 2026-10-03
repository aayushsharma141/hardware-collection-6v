<!-- generated-by: gsd-doc-writer -->
# Execution Planner

**Role:** Decides who does each task, which tasks can run in parallel, and which review workflows run against the result.

## When it applies

The planner has produced an ordered task list.

## Inputs

- The plan from `planner.md`
- Agent roles in `.agents/agents/` (`architect.md`, `planner.md`, `reviewer.md`)
- Review workflows in `.agents/workflows/`
- Project skills in `.agents/skills/`, for example `frontend-architecture`, `frontend-a11y`, `seo`, `prisma-client-api`
- `docs/ARCHITECTURE.md`

## Steps

1. Group tasks into waves. Tasks in the same wave must not edit the same files.
2. Assign tasks that change structure (new folders, new data flow, Sanity schema, Prisma model) to the architect role first, then implementation.
3. List the skills each task should load from `.agents/skills/`.
4. Pick the review workflows for the finished work by what it touches:

   | Change touches | Workflow |
   |:---|:---|
   | UI or layout | `accessibility_review.md`, `browser_pov_audit.md`, `performance_review.md` |
   | `src/app/api/`, environment variables, secrets | `security_review.md` |
   | `package.json` or the lockfile | `dependency_review.md` |
   | Folder structure or data flow | `architecture_review.md` |
   | Tracking or conversion paths | `analytics_review.md` |
   | Product scope or UX rules | `product_governance_review.md` |
   | Tests | `testing_review.md` |

5. Keep the plan small enough for one branch and one PR where possible.

## Hand-off

`scheduler.md`.

## Output

Waves of tasks with an owner role, skills to load, and the review workflows to run at the end.
