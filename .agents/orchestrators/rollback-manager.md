<!-- generated-by: gsd-doc-writer -->
# Rollback Manager

**Role:** Restores a working production site after a bad release, then hands the cause back for a proper fix. Nothing here runs automatically; a person or agent follows these steps when a problem is reported.

## When it applies

- A `deploy.yml` run fails.
- The owner, a visitor, or the Vercel runtime logs show the production site broken after a release.
- Leads stop arriving (`Lead` rows whose `telegramStatus` is `failed`).

## Inputs

- `docs/DEPLOYMENT.md`: rollback procedure and monitoring
- Recent deploys: `gh run list --workflow deploy.yml`
- Recent commits on `main`: `git log --oneline -10 main`
- The last `PROMOTE` bundle in `docs/evidence/` (`docs/evidence/latest-release.json`)
- Vercel runtime logs (structured JSON lines from `src/lib/logger.ts`)

## Steps

1. Decide whether the problem is code or content. If a Sanity document caused it, roll back that document in Sanity Studio (`/studio`) and stop.
2. For a code problem, roll back in Vercel to the last good production deployment, using the dashboard's Instant Rollback or:

   ```bash
   # vercel CLI is not a declared dependency; npx fetches it, as deploy.yml does
   npx vercel rollback <deployment-url> --token="$VERCEL_TOKEN"
   ```

3. Revert the bad commit on `main` (`git revert <sha>` and push). Without this the next push to `main` redeploys the broken code.
4. Check the database: a code rollback does not undo a hand-applied `Lead` schema change. Confirm the restored build works with the current table.
5. If leads failed to notify, retry them through `POST /api/leads/retry` with `{ "lead_id": "..." }`. It does not resend alerts already marked `sent`.
6. Find the cause: match the time the problem started with the deploy and commit history, and read the diff.
7. Open an issue with what broke, the commit, the cause, and what was rolled back (`gh issue create`).

## Hand-off

`intake.md` with the incident issue, so the fix goes through planning, review and the release gate like any other change.

## Output

Production restored, the bad commit reverted on `main`, and an incident issue describing cause and recovery.
