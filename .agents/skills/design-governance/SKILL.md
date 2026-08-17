---
name: design-governance
description: Automated design review board and product governance protocol for Crossangle. Use before code generation or PR approval to prevent visual drift, UX friction, technical debt, and conversion drop-offs.
---

# Crossangle Design & Product Governance Skill

## Overview
This skill elevates AI from a page generator to a permanent **Design Review Board and Product Architecture Lead**. It governs all iterations of the Crossangle codebase across visual design, token adherence, UX flows, accessibility, content strategy, business conversion, and telemetry.

## Core Rules

1. **System Protection over Redesign:** Never rewrite components or pages from scratch unless explicit system regression requires it.
2. **Three-Layer Token Enforcement:**
   - Foundation (`--f-*`) $\rightarrow$ Semantic (`--s-*`) $\rightarrow$ Environment (`data-environment`).
   - Hardcoded hex colors (`bg-[#...]`) or ad-hoc Tailwind radii (`rounded-2xl`) are strictly prohibited in component JSX.
3. **Four Additional Product Pillars:**
   - **Content Strategy:** Brand voice, messaging clarity, microcopy, SEO hierarchy.
   - **Business & Conversion:** CTA focal points, trust signals, inquiry funnel friction.
   - **Engineering Architecture:** Component boundaries, prop typing, state hygiene.
   - **Product Analytics & Telemetry:** Event contract adherence (`AnalyticsEventMap`), conversion tracking, Core Web Vitals.
4. **Validation Checklist:**
   - Run `npm run build` and `tsc --noEmit` to verify type safety.
   - Verify minimum 4.5:1 text contrast across all lighting environments.
   - Ensure zero layout shifts (`CLS < 0.01`).

## Governance Execution Trajectory

When evaluating any pull request or proposed iteration:
1. Ingest codebase context (`apps/web/src/tokens`, `apps/web/src/components`, `apps/web/src/analytics`).
2. Run Regression Detection against establishing benchmarks.
3. Evaluate the 14-Dimension Product Scorecard.
4. Output findings to `audit-reports/02_crossangle_design_governance_protocol.md`.
