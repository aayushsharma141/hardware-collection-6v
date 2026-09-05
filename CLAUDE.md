# CLAUDE.md — Hardware Collection Agent Reference

Canonical instructions for AI agents and autonomous tooling working on this repository.

See [.agents/AGENTS.md](.agents/AGENTS.md) and [.agents/registry.yaml](.agents/registry.yaml) for the multi-agent registry, workflow specifications, and workspace boundaries.

---

## Common Commands

```bash
npm run dev                              # dev server at http://localhost:3000
npm run build                           # Next.js production build
npm run lint                            # ESLint 9
npx tsc --noEmit                        # TypeScript check (no emit)
npm test                                # Vitest unit test suite
npm run test:e2e                        # Playwright browser specs (tests/e2e)
npm audit --audit-level=critical        # dependency CVE audit
node scripts/audit-dependencies.cjs     # legacy design-token / button.tsx migration audit
npx tsx scripts/evidence-engine.ts --validate   # evidence platform gate
npx tsx scripts/release-verification.ts         # release quality gate (runs all of the above)
```

> `scripts/audit-dependencies.cjs` is **not** a CVE scanner despite its name — it scans
> for `ui/primitives/button` imports and legacy `var(--site-*)` tokens, and currently
> reports zero of both. Real vulnerability scanning is `npm audit`, enforced as GATE-05
> of the release pipeline.

---

## Codebase Structure

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before adding files. It maps
the request lifecycle and states which folder new code belongs in.

**Content ownership:** Sanity (`src/content/sanity/`) is the canonical content
source. `src/content/fallback/` is a resilience mechanism that keeps the site
rendering when Sanity is unreachable — never author content there.

`src/` has six concerns: `app/` (routes), `components/` (one folder per
domain, no loose files), `content/`, `hooks/`, `lib/` (domain subfolders), and
`types/`. `src/components/`, `src/content/` and `src/lib/` each carry a README
describing what belongs inside.

---

## Technical Stack

- **Framework**: Next.js 16, React 19 (App Router)
- **CMS**: Sanity CMS — `@sanity/vision`, `next-sanity`, embedded Studio at `/studio`
- **Database**: PostgreSQL via Prisma (`Lead` model — lead capture only)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons**: `lucide-react`
- **Language**: TypeScript 5
- **Deployment**: Vercel

---

## Agent Roles (`.agents/agents/`)

| File | Role |
|---|---|
| `planner.md` | Sprint and task roadmap |
| `architect.md` | System architecture, schema design, ADR enforcement |
| `frontend.md` | Next.js App Router, Tailwind CSS, component optimization |
| `backend.md` | Sanity schema, API routes, data migrations |
| `reviewer.md` | Quality audit, security, refactoring |

---

## Workflow Agents (`.agents/workflows/`)

| File | Purpose |
|---|---|
| `accessibility_review.md` | WCAG compliance and screen reader usability |
| `analytics_review.md` | Event tracking and conversion verification |
| `architecture_review.md` | System topology and code organization |
| `audit_workflow.md` | Cross-system automated verification |
| `browser_pov_audit.md` | Responsive design and visual layout |
| `dependency_review.md` | Dependency audit and CVE scanning |
| `engineering_governance_review.md` | Code quality and rule compliance |
| `graphify.md` | Component knowledge graph and relationship analysis |
| `performance_review.md` | Core Web Vitals, bundle size |
| `product_governance_review.md` | Product requirements and UX standards |
| `production_readiness.md` | Pre-launch quality gates |
| `security_review.md` | Secret scanning, hardening, key rotation |
| `testing_review.md` | Unit and end-to-end test validation |

---

## Quality Rules (`.agents/rules/`)

| File | Scope |
|---|---|
| `architecture.md` | Modular App Router and Sanity Studio layout |
| `coding.md` | Strict TypeScript, non-null guarantees, clean hooks |
| `git.md` | Atomic commits, structured PR descriptions |
| `security.md` | No hardcoded secrets, environment variable validation |
| `testing.md` | Verification before completion |

---

## Evidence Platform (`scripts/`)

- Release claims are validated against `scripts/evidence-engine.ts` and `scripts/release-verification.ts`.
- `release-verification.ts` runs six gates, all critical: lint, `tsc --noEmit`, unit tests,
  production build, `npm audit --audit-level=critical`, and evidence schema validation.
  A failure aborts the pipeline and records a `HOLD` decision.
- Evidence bundles in `docs/evidence/` record only measured stage results. They are
  Ed25519-signed, so they must never assert anything the pipeline did not actually observe.
