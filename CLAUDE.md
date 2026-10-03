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

## Collections Architecture (locked — do not redesign)

The catalogue has **two public content routes** only:

```
/           → homepage
/collections → full showroom catalogue
```

The five showroom families (`handles-knobs`, `door-hardware`, `bathroom`,
`kitchen-wardrobes`, `furniture-hardware`) are **in-page sections**, not pages:

```
/collections
 ├── #handles-knobs
 ├── #door-hardware
 ├── #bathroom
 ├── #kitchen-wardrobes
 └── #furniture-hardware
```

**Never create `/collections/<slug>` as a route.** Any such URL is a legacy redirect
(308 → the appropriate anchor or `/collections`). The five families are anchors on
one page, not a route hierarchy.

**Grouping is driven exclusively by `primaryRail`.** The chain is:

```
product.categorySlug  →  category.primaryRail  →  showroom family
```

`src/lib/collections/showroom.ts` owns this logic. Never add keyword matching,
a hand-kept slug table, or any invented taxonomy. To move a category between
families, edit its `primaryRail` in Sanity Studio — no code change required.

**Decisions that are frozen:**

| Frozen | Reason |
|---|---|
| Two-route architecture | Tested and verified |
| `primaryRail` as sole input | Business taxonomy lives in CMS |
| 13 CMS categories as discovery vocabulary | Sub-categories are filters, not routes |
| Product Detail Drawer | Correct interaction model |
| WhatsApp as selection endpoint | Owner decision |
| `featured` field controls sort order only | No layout branching |
| Empty families hidden | Prevents headings over nothing |
| Density-responsive sections (1/2–4/5+) | Content maturity drives layout |

---

## Evidence Platform (`scripts/`)

- Release claims are validated against `scripts/evidence-engine.ts` and `scripts/release-verification.ts`.
- `release-verification.ts` runs six gates, all critical: lint, `tsc --noEmit`, unit tests,
  production build, `npm audit --audit-level=critical`, and evidence schema validation.
  A failure aborts the pipeline and records a `HOLD` decision.
- Evidence bundles in `docs/evidence/` record only measured stage results. They are
  Ed25519-signed, so they must never assert anything the pipeline did not actually observe.
