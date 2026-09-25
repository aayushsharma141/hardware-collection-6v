# Key Rotation Strategy — Hardware Collection

## Objective

Quarterly, zero-downtime rotation of the credentials this project actually uses.

> **History:** this document previously described the Supabase infrastructure of an
> unrelated project ("CrossAngle Interior") — `SUPABASE_ANON_KEY` and
> `SUPABASE_SERVICE_ROLE_KEY`, neither of which exists here. It was inherited
> wholesale, along with the CI workflows that referenced it. This stack is
> Next.js 16 + Sanity + Prisma/Postgres on Vercel, with Resend and Telegram for
> lead notification and an Ed25519 key for signing release evidence.

## Schedule

`.github/workflows/key-rotation-reminder.yml` opens a tracking issue at 00:00 on
the 1st of January, April, July and October, and can be run on demand via
`workflow_dispatch`.

## Credential inventory

| Secret | Consumed by | Store | Blast radius if leaked |
|---|---|---|---|
| `EVIDENCE_PRIVATE_KEY` | `scripts/evidence-engine.ts` | GitHub Secrets | Release evidence bundles can be forged |
| `SANITY_API_TOKEN` | `src/app/api/seed/route.ts`, `src/content/sanity/client.ts` | Vercel | Read/write access to all CMS content |
| `SANITY_REVALIDATE_SECRET` | `src/app/api/revalidate/route.ts` | Vercel + sanity.io/manage | Forged cache-invalidation webhooks |
| `DATABASE_URL` | `src/lib/leads/createLead.ts` | Vercel | Full access to captured lead PII |
| `RESEND_API_KEY` | `src/lib/leads/email.ts` | Vercel | Send mail as the verified domain |
| `TELEGRAM_BOT_TOKEN` | `src/lib/leads/telegram.ts` | Vercel | Post to the staff alert channel |
| `VERCEL_TOKEN` | `.github/workflows/deploy.yml` | GitHub Secrets | Deploy arbitrary code to production |
| `GOOGLE_SHEET_WEBHOOK_URL` | `src/app/api/lead/route.ts` | Vercel | Write to the lead mirror sheet |

`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are **not**
secrets — they are public by construction and ship in the client bundle. They
need no rotation.

## Outstanding: the evidence signing key

`docs/evidence/private.key` is **tracked in git** and has been since commit
`472af97`. `scripts/evidence-engine.ts` reads it from disk whenever
`EVIDENCE_PRIVATE_KEY` is unset, so it is the live signing key. Treat it as
compromised until all of the following are done:

1. Generate a replacement keypair.
2. Store the private half **only** as the `EVIDENCE_PRIVATE_KEY` GitHub Secret.
3. `git rm --cached docs/evidence/private.key` and commit.
4. Purge it from history (`git filter-repo --path docs/evidence/private.key --invert-paths`),
   then force-push and have every collaborator re-clone.
5. Re-sign or invalidate the four existing bundles in `docs/evidence/`, all of
   which were signed with the exposed key.
6. Make `ensureEd25519Keys()` refuse the on-disk fallback when `CI` is set or
   `NODE_ENV === "production"`, so this cannot silently recur.

Rotating the key without step 4 is insufficient: the old key stays recoverable
from history and the old signatures stay verifiable.

## Zero-downtime rotation methodology

### 1. Preparation

- Announce the rotation; confirm no deploy or batch job is mid-flight.
- Note that Vercel applies environment-variable changes **on the next
  deployment**, not to running functions. Plan a redeploy into every rotation.

### 2. Rotation order

Rotate credentials that are read at request time before those read at build
time, so a partial rollout degrades rather than breaks:

1. **`TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`** — lowest risk. `/api/leads`
   already records `telegramStatus`/`emailStatus` as `failed` and still persists
   the lead, so a brief invalid window loses alerts, not leads. Replay any
   misses with `/api/leads/retry`.
2. **`SANITY_API_TOKEN`** — issue the new token in sanity.io/manage *before*
   revoking the old one; both are valid concurrently. Update Vercel, redeploy,
   then revoke.
3. **`SANITY_REVALIDATE_SECRET`** — must change in Vercel and on the webhook in
   sanity.io/manage together. `/api/revalidate` returns 500 with a clear log
   line when the variable is missing and 401 on a signature mismatch, so a
   mismatch is visible rather than silent. Content will serve stale until the
   ISR window (`revalidate: 60`) elapses.
4. **`DATABASE_URL`** — rotate the Postgres role password. Create a second role
   with the same grants, cut over, then drop the first. Never rotate in place;
   `createLead` has no retry and a failed insert loses the lead with a 500.
5. **`VERCEL_TOKEN`** — issue new, update the GitHub Secret, confirm one
   successful deploy, then revoke the old.
6. **`EVIDENCE_PRIVATE_KEY`** — see the section above. Rotating this
   invalidates prior signatures by design.

### 3. Verification

Run each of these after the redeploy:

- [ ] `npx tsx scripts/release-verification.ts` passes end to end.
- [ ] Submit a real lead: confirm the Postgres row, the Telegram message, and
      the Resend email all arrive.
- [ ] Publish a trivial change in Sanity Studio and confirm the site updates
      (proves the revalidate secret matches on both sides).
- [ ] Load `/collections` and one `/collections/[slug]` page and confirm CMS
      content renders, not fallback content. A silent drop to
      `src/content/fallback/` means the Sanity coordinates or token are wrong —
      `src/content/sanity/env.ts` logs a `[sanity]` warning in that case.

### 4. Record

Note the rotation date and who performed it on the tracking issue before
closing it.
