# Crossangle Iterative Product Review Protocol Workflow

**Trigger:** `/workflow product_governance_review`  
**Purpose:** Automate pre-commit and post-iteration product governance to prevent AI design drift, UX regression, engineering decay, and business/conversion drop-offs.

---

## Execution Trajectory

Execute the following 11-step governance trajectory sequentially. Output all persistent results to `audit-reports/`.

1. **Step 1 — Deep Codebase Ingestion:** Study token architecture (`apps/web/src/tokens`), component primitives, router paths, layout rules, and analytics events.
2. **Step 2 — Regression Detection:** Check for radius drift, hardcoded hex colors, ad-hoc spacing, broken contrast, component duplications, and performance drops.
3. **Step 3 — 14-Dimension Scorecard:** Evaluate Visual Design, Brand Identity, Hierarchy, Navigation, Information Architecture, Trust, Accessibility, Performance, Motion, Responsiveness, Product Thinking, Content Strategy, Business & Conversion, and Engineering Architecture (1–10 scale).
4. **Step 4 — Component Governance:** Inspect primitive reuse, spacing compliance, typography adherence, ARIA accessibility, and variant consolidation.
5. **Step 5 — UX & Flow Governance:** Audit all user journeys (Landing, Portfolio, Estimator, Gallery, Inquiry, Auth, Admin, Dashboard, 404, Empty, Errors).
6. **Step 6 — Product Maturity Classification:** Rate maturity level (Level 1 Prototype through Level 6 World-Class Product).
7. **Step 7 — Design Debt Report:** Categorize accumulated design debt by severity (Critical, Important, Minor, Cosmetic) with resolution effort estimates.
8. **Step 8 — Technical & Architecture Debt Report:** Audit hardcoded values, duplicate logic, un-purged CSS, state bloat, and API structure.
9. **Step 9 — Content, Conversion & Telemetry Governance:** Review messaging clarity, lead capture funnels, CTA placement, PostHog event coverage, and A/B test readiness.
10. **Step 10 — Prioritized Strategy & Implementation Brief:** Generate 4-phase roadmap (Immediate, Next Sprint, Future, Vision) and a complete next-generation AI prompt.
11. **Step 11 — Self-Critique & Acceptance Checklist:** Challenge assumptions, eliminate weak recommendations, and produce a launch readiness score.

---

## Output Artifact Requirement

Every run of this workflow MUST generate a persistent report in `audit-reports/02_crossangle_design_governance_protocol.md` containing all 12 standardized output sections.
