<!-- generated-by: gsd-doc-writer -->
# Reviewer

**Role:** Checks finished work before it is merged, runs the chosen review workflows, and opens or updates the pull request.

## When it applies

The scheduler has finished all waves on a branch.

## Inputs

- The branch diff: `git diff main...HEAD`
- The review workflows chosen by `execution-planner.md`
- The definition of done in `planner.md`
- `docs/ARCHITECTURE.md`, `docs/TESTING.md`
- CI results on the PR: `gh pr checks <number>`

## Steps

1. Read the diff. Check that new files sit where `docs/ARCHITECTURE.md` and the folder READMEs say they belong, and that no content was added to `src/content/fallback/`.
2. Run the checks locally: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`. Run `npm run test:e2e` if the change affects a browser flow.
3. Run each chosen workflow in `.agents/workflows/`. `engineering_governance_review.md` and `testing_review.md` apply to every change.
4. Sort findings into blockers and follow-ups. Blockers go back to `scheduler.md` with the file and the fix needed. Follow-ups become GitHub issues (`gh issue create`).
5. Confirm the docs for the changed area were updated.
6. Open or update the PR with `gh pr create` / `gh pr edit`. The description says what changed, why, and how it was checked. Wait for `ci.yml`, `secret-scan.yml` and `security.yml` to pass on the PR.

## Hand-off

- No blockers and CI green: `release-manager.md`.
- Blockers: back to `scheduler.md`.

## Output

A PR with passing CI, a review summary, and issues for any follow-ups.
