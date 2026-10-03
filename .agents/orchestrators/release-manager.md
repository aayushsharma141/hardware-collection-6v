<!-- generated-by: gsd-doc-writer -->
# Release Manager

**Role:** Runs the release gate, records the evidence, and merges to `main`, which deploys to production.

## When it applies

The reviewer has approved a PR and CI is green.

## Inputs

- The approved PR: `gh pr view <number>`
- `scripts/release-verification.ts`
- `docs/evidence/` and `docs/evidence/SIGNING.md`
- `docs/DEPLOYMENT.md`
- `.github/workflows/deploy.yml`
- `.agents/workflows/production_readiness.md`

## Steps

1. Run `production_readiness.md` for releases that change user-facing behaviour.
2. On the PR branch, with a clean working tree, run the release gate:

   ```bash
   # tsx is not a declared dependency; npx downloads it on first use
   npx tsx scripts/release-verification.ts
   ```

   It runs six critical gates in order: lint, `tsc --noEmit`, unit tests, production build, `npm audit --audit-level=critical`, and evidence schema validation. The first failure stops the run and records `HOLD`. All six passing records `PROMOTE`. Either way a signed bundle is written to `docs/evidence/` (signing needs `EVIDENCE_PRIVATE_KEY`; see `docs/evidence/SIGNING.md`).
3. On `HOLD`, send the failure back to `scheduler.md`. Do not merge.
4. On `PROMOTE`, commit the new evidence bundle. The bundle must only contain what the pipeline measured; never edit it by hand.
5. Check whether the change needs a manual production step before deploy, such as a `Lead` schema change or a new environment variable in Vercel (see `docs/DEPLOYMENT.md`).
6. Merge the PR (`gh pr merge <number>`). The push to `main` triggers `deploy.yml`, which deploys to Vercel with `vercel --prod`. `deploy.yml` does not wait for `ci.yml`, so merge only after CI has passed on the PR.
7. Check the deploy: `gh run list --workflow deploy.yml`, then load the changed pages on the production site.
8. Update `.planning/STATE.md` and close the related issues.

## Definition of done

All six release gates pass, the evidence bundle is committed, the docs for the changed area are updated, the deploy succeeded, and `.planning/STATE.md` is current.

## Hand-off

- Deploy fails or production is broken: `rollback-manager.md`.
- Otherwise the cycle ends.

## Output

A merged PR, a `PROMOTE` evidence bundle in `docs/evidence/`, a successful `deploy.yml` run, and updated `.planning/STATE.md`.
