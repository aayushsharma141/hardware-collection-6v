# npm Dependency Audit — Triage and Disposition

**Date:** 2026-09-26
**Branch:** `refactor/structure-legibility`
**Scope:** `npm audit` findings against the full dependency tree (1,546 packages: 1,150 prod, 279 dev, 151 optional, 13 peer)

---

## Summary

| | Before | After |
|---|---|---|
| Critical | 0 | 0 |
| High | 10 | 7 |
| Moderate | 11 | 12 |
| **Total** | **21** | **19** |

`npm audit fix` (without `--force`) resolved three root advisories. **No change was made to `package.json`** — every declared version range is untouched; only the lockfile moved. That lockfile move is not small, though: 237 packages changed version, including `sanity` 6.9.1 → 6.16.0. See [What `npm audit fix` changed](#2-what-npm-audit-fix-changed) before approving.

**Every remaining advisory is unreachable from shipped code.** All six sit in command-line tooling under `sanity` or `prisma` and are verified absent from the production build output.

**Recommendation: keep the release gate at `--audit-level=critical`. Do not tighten it to `high`.** Reasoning in [Gate recommendation](#gate-recommendation).

---

## 1. Triage table

The 21 findings are 9 packages carrying actual advisories plus 12 that `npm audit` lists only because they depend on one. The table covers the 9 real ones.

| Advisory package | Severity | Pulled in by | Path | Reachable from shipped code | Disposition |
|---|---|---|---|---|---|
| `brace-expansion` | high | (leaf, many parents) | dev tooling | No | **Fixed** |
| `fast-uri` | high | (leaf, many parents) | dev tooling | No | **Fixed** |
| `undici` | high | `sanity` → `@sanity/cli` → `@module-federation/dts-plugin` | dev-only subtree | No | **Fixed** |
| `adm-zip` | high | `sanity` → `@sanity/cli` → `@sanity/workbench-cli` → `@module-federation/*` | dev-only subtree | No | Accepted risk |
| `js-yaml` | high | `sanity` → `@sanity/cli` → `@vercel/frameworks` | dev-only subtree | No | Accepted risk |
| `smol-toml` | high | `sanity` → `@sanity/cli` → `@vercel/frameworks` | dev-only subtree | No | Accepted risk |
| `mysql2` | high | `prisma` (devDependency) | dev-only, **and an unused database driver** | No | Accepted risk |
| `deepmerge-ts` | high | `prisma` → `@prisma/config` (devDependency) | dev-only | No | Accepted risk |
| `uuid` | moderate | `sanity` → `@sanity/cli` → `typeid-js` | dev-only subtree | No | Accepted risk |

A note on `sanity`: it is a **runtime** dependency, because the Studio is mounted at `src/app/studio/[[...tool]]`. But the vulnerable packages all hang off `@sanity/cli`, the command-line tooling, which the Studio browser bundle does not import. The distinction is the whole basis of the reachability finding below.

---

## 2. What `npm audit fix` changed

Resolved: `brace-expansion`, `fast-uri`, `undici`. One new propagation-only entry appeared (`@sanity/runtime-cli`), which is why moderate went 11 → 12 while high went 10 → 7.

**`npm audit fix` rebuilt a large part of the tree — 237 packages changed version, including seven direct dependencies.** `package.json` is untouched and every bump is inside an already-declared `^` range, so none is breaking by semver. But this is a wider change than "a security patch", and it should be reviewed as such:

| Direct dependency | Before | After |
|---|---|---|
| `sanity` | 6.9.1 | **6.16.0** |
| `@sanity/vision` | 6.9.1 | **6.16.0** |
| `next-sanity` | 13.3.1 | 13.3.4 |
| `prisma` | 7.9.1 | 7.10.0 |
| `motion` | 13.1.0 | 13.4.4 |
| `zod` | 4.4.3 | 4.6.5 |
| `zustand` | 5.0.14 | 5.0.15 |

The one that deserves attention is **`sanity` 6.9.1 → 6.16.0** — seven minor releases of the CMS and Studio on a launch-frozen project. It is within `^6.9.1`, so any fresh `npm install` would already have picked it up, and the production build succeeds with the Studio route intact. It is called out here because the reviewer should decide whether that much Studio movement is wanted right now, not discover it later.

If it is not wanted, the narrower alternative is to pin `sanity` and `@sanity/vision` to 6.9.1 and take only the three advisory fixes. That costs nothing in security terms — none of the three resolved advisories come from Sanity.

`npm` blocked three install scripts during the fix (`unrs-resolver`, `prisma` preinstall, `@prisma/engines` postinstall). This was confirmed harmless: `npm run postinstall` regenerates Prisma Client v7.10.0 successfully and the production build passes.

One residual wrinkle: `prisma` (CLI) is now 7.10.0 while `@prisma/client` remains 7.9.1. `prisma generate` and the build both succeed, but keeping the two in lockstep is the supported configuration — worth aligning on the next dependency pass.

### Gate results after the fix

| Gate | Result |
|---|---|
| `npm run lint` | 0 errors, 30 warnings (unchanged from before) |
| `npx tsc --noEmit` | clean |
| `npm test` | 14 files, 78 tests passing |
| `npm run build` | succeeds, all 69 routes generated |

---

## 3. Reachability evidence

Reachability was tested against the actual production build output, not inferred from the dependency graph. Searching `.next/server` (85 MB) and `.next/static` (11 MB) for each vulnerable module:

| Module | References in build output |
|---|---|
| `adm-zip` | 0 |
| `js-yaml` | 0 |
| `smol-toml` | 0 |
| `deepmerge-ts` | 0 |
| `mysql2` | 0 |
| `@module-federation/*` | 0 |
| `@vercel/frameworks` | 0 |
| `@sanity/cli` | 0 |

An initial search appeared to show four `@sanity/cli` hits in the client bundle. On inspection these were `@sanity/client` deprecation strings — a different package — matching on the shared `@sanity/cli` prefix. The corrected count is zero.

---

## 4. Exploitability in this application's context

This is a marketing and lead-capture site: a Next.js App Router frontend, read-only Sanity CMS queries, and a single Prisma `Lead` write path. There is no cart, no checkout, no payments, no customer accounts.

**`mysql2` — not exploitable, and the driver is not even used.** The advisory (`GHSA-3f6p-5ww8-9rcr`) is an auth-plugin downgrade that leaks plaintext credentials to a malicious MySQL server. This project uses **PostgreSQL** via `@prisma/adapter-pg` and `pg`. `mysql2` is bundled by the Prisma CLI for connectors it supports; this code path never executes, and there is no MySQL server to be downgraded against.

**`adm-zip`, `js-yaml`, `smol-toml`, `deepmerge-ts`, `uuid` — not exploitable.** These are denial-of-service and resource-exhaustion bugs (plus one symlink-overwrite in `adm-zip`, one prototype-pollution in `js-yaml`) triggered by parsing attacker-controlled input. They live in build and CLI tooling that only ever processes repository-local files, run by a developer or by CI on a trusted checkout. No site visitor can reach them, and no request path invokes them.

The general point: `npm audit` reports on the dependency graph and has no concept of reachability. A DoS bug in a CLI that only a maintainer runs against their own files is not the same class of risk as the same bug in a request handler, but audit scores them identically.

---

## 5. Why the rest cannot simply be fixed

`npm audit fix --force` was **not** run. Its proposed remedies are **major downgrades**, not upgrades:

| Package | Installed | npm's "fix" | |
|---|---|---|---|
| `sanity` | 6.9.1 | 5.14.1 | major **downgrade** |
| `prisma` | 7.9.1 | 6.19.3 | major **downgrade** |
| `@sanity/vision` | 6.9.1 | 5.31.2 | major **downgrade** |
| `next-sanity` | 13.3.1 | 11.6.13 | major **downgrade** |

This happens because the advisory ranges cover the current major line. For `sanity` the affected range is `>=5.14.2-alpha.14` — open-ended, so every 6.x release including the newest (6.16.0) is in scope and **no patched forward release exists**. For `prisma` the range ends at `8.1.0-dev.6`, so a fix would need a stable 8.x; only `-dev` prereleases are published.

Downgrading Sanity by a major version on a launch-frozen project, to remediate unreachable DoS bugs in CLI tooling, would trade real breakage risk for no actual security gain. It is the wrong trade.

### The `overrides` option, and why it is also not recommended yet

Patched versions of the individual transitive packages do exist (`adm-zip` 0.6.1, `deepmerge-ts` 8.0.2, `mysql2` 3.24.4), so an npm `overrides` block could force them up without touching `sanity` or `prisma` themselves.

This is worth keeping on the table, but not doing now. Overriding the internals of the Sanity CLI risks breaking Studio tooling in ways `npm audit` will never report, and the bugs being fixed are unreachable. That is accepting real breakage risk to close theoretical exposure.

---

## 6. Peer-dependency mismatch

`@portabletext/editor` (nested under `sanity`) requires `react ^19.2.8`; the tree pins `react` and `react-dom` at exactly `19.2.4`.

After the audit fix, top-level `npm ls` exits 0 — but `npm ls --all` still exits 1, which is what `cyclonedx-npm` invokes. **The `--ignore-npm-errors` flag on the SBOM CI step is therefore still required.**

Bumping `react`/`react-dom` to 19.2.8 would clear it, and 19.2.8 is published. The exact pin (no caret, unlike every other dependency) looks deliberate, so this was **not** changed. It should be a conscious decision, not a side effect of an audit pass.

---

## Gate recommendation

**Keep `--audit-level=critical`. Do not tighten to `high`.**

Tightening to `high` today would fail the pipeline on 7 advisories that are all unreachable from shipped code and all unfixable without a major downgrade of Sanity or Prisma. That produces a permanently red gate with no available remedy — which trains everyone to ignore it, and is strictly worse than a gate that means something.

Revisit when either condition is met:

1. **Sanity ships a 6.x release with patched CLI dependencies.** Track the `>=5.14.2-alpha.14` advisory range closing.
2. **Prisma ships a stable 8.x.** The advisory range already ends at `8.1.0-dev.6`, so a stable 8.1.0 would clear both `deepmerge-ts` and `mysql2`.

Once either lands, re-run this triage. If the high count reaches zero, tighten GATE-05 to `high` in both `scripts/release-verification.ts` and `.github/workflows/ci.yml` in the same change.

Until then the honest position is the current one: block on critical, and review high and moderate deliberately, as here, rather than pretending a number in CI is doing that work.

---

## Appendix — commands

```bash
npm audit --json                    # full advisory data
npm audit fix                       # non-breaking fixes only
npm ls --all                        # peer-dependency state
npm run lint && npx tsc --noEmit && npm test && npm run build
```
