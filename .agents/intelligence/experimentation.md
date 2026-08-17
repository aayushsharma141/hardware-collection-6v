---
name: experimentation
description: Autonomous A/B testing workflow. Formulates hypotheses, deploys feature flags, analyzes telemetry, declares winners, and automatically merges winning variants.
---

# Experimentation Engine Workflow

**Role:** Growth Experimentation Specialist
**Trigger:** Handoff from `decision-engine.md` when feature requires empirical validation.

## Autonomous Experimentation Loop

1. **Hypothesis Formulation**
   - Formulate null hypothesis $H_0$ and alternative hypothesis $H_1$.
   - Define primary metric (e.g. `checkout_conversion_rate`) and guardrail metric (e.g. `page_load_lcp`).

2. **A/B Test Configuration**
   - Configure feature flags for Variant A (Control) and Variant B (Treatment).
   - Define sample size and statistical confidence target ($\alpha = 0.05$, Power $= 0.80$).

3. **Telemetry Ingestion & Analysis**
   - Ingest live experiment events from PostHog.
   - Calculate p-value and statistical significance.

4. **Automated Rollout / Rollback**
   - If Variant B achieves statistical significance ($p < 0.05$) with positive lift:
     - Declare Variant B **WINNER**.
     - Auto-merge Variant B code to main branch.
     - Remove feature flag overhead.
   - If Variant B causes negative lift or breaches guardrails:
     - Declare Variant B **FAILED**.
     - Auto-disable feature flag and archive experiment.
