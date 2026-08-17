# CLAUDE.md - Hardware Collection Developer & Agent Guidance

This file provides canonical instructions to AI models, Claude Code, and autonomous agents working on **Hardware Collection Sakchi**.

## Development Commands

### Common Tasks
- **Start Development Server**: `npm run dev` (Runs Next.js 16 dev server at `http://localhost:3000`)
- **Build for Production**: `npm run build` (Next.js production build)
- **Production Server**: `npm run start`
- **Lint Code**: `npm run lint` (ESLint 9 verification)
- **Run Audit Suite**: `node scripts/audit-dependencies.cjs`
- **Evidence Platform Gate**: `npx tsx scripts/evidence-engine.ts --validate`
- **Release Verification**: `npx tsx scripts/release-verification.ts`

---

## Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router & React 19)
- **CMS & Studio**: Sanity CMS (`@sanity/vision`, `next-sanity`, `sanity`) embedded under `/studio`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), Styled Components
- **Icons**: Lucide React (`lucide-react`)
- **Language**: TypeScript (`^5`)
- **Deployment**: Vercel Platform

---

## Multi-Agent Governance Ecosystem (`.agents/`)

This repository uses an integrated multi-agent system located in `.agents/`:

### Core Roles
- **Planner** (`.agents/agents/planner.md`): Sprint and task roadmap planning.
- **Architect** (`.agents/agents/architect.md`): System architecture, schema design, and ADR enforcement.
- **Frontend Engineer** (`.agents/agents/frontend.md`): Next.js App Router, Tailwind CSS, component optimization.
- **Backend Engineer** (`.agents/agents/backend.md`): Sanity CMS schema definitions, API routes, data migrations.
- **Code Reviewer** (`.agents/agents/reviewer.md`): Quality audit, security compliance, refactoring guidance.

### Specialized Workflow Agents (`.agents/workflows/`)
1. **Accessibility Review** (`accessibility_review.md`): WCAG compliance & screen reader usability.
2. **Analytics Review** (`analytics_review.md`): Event tracking and conversion verification.
3. **Architecture Review** (`architecture_review.md`): System topology & code organization.
4. **Audit Workflow** (`audit_workflow.md`): Automated cross-system verification.
5. **Browser POV Audit** (`browser_pov_audit.md`): Responsive design & visual layout review.
6. **Dependency Review** (`dependency_review.md`): Dependency audit & CVE vulnerability scanning.
7. **Engineering Governance** (`engineering_governance_review.md`): Code quality & rule compliance.
8. **Graphify** (`graphify.md`): Component knowledge mapping & relationship analysis.
9. **Performance Review** (`performance_review.md`): Core Web Vitals, page speed & bundle size optimization.
10. **Product Governance** (`product_governance_review.md`): Product requirements & UX standards.
11. **Production Readiness** (`production_readiness.md`): Pre-launch release quality gates.
12. **Security Review** (`security_review.md`): Hardening, secret scanning, key rotation.
13. **Testing Review** (`testing_review.md`): End-to-end and unit testing validation.

---

## Quality Rules & Guidelines (`.rules/`)

- `architecture.md`: Modular Next.js App Router & Sanity Studio layout rules.
- `coding.md`: Strict TypeScript safety, non-null guarantees, clean React hooks.
- `git.md`: Atomic commits, structured PR descriptions.
- `security.md`: Zero hardcoded secrets, environment variable validation.
- `testing.md`: Verification before completion.

---

## Evidence Platform & Release Verification (`scripts/`)

- All release claims are validated against `scripts/evidence-engine.ts` and `scripts/release-verification.ts`.
- Quality thresholds: zero critical vulnerability alerts, 100% build pass rate, verified Sanity CMS schema integrity.
