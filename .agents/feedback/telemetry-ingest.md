---
name: telemetry-ingest
description: Continuous feedback workflow that ingests production PostHog analytics and Vitals, turning them into prioritized roadmap tasks.
---

# Telemetry Ingest Workflow

**Role:** Data Analyst / Growth Engineer
**Trigger:** Scheduled cron job (e.g., weekly) or anomalous spike alert.

## Objective
To close the feedback loop between production usage and the Product OS backlog. This workflow ensures that the product evolves based on real data, not just feature requests.

## Steps

1. **Ingest Metrics**
   - Query the PostHog API for the strictly typed events defined in `apps/web/src/analytics/events.ts`.
   - Query Core Web Vitals (LCP, CLS, INP) for the trailing 7 days.

2. **Anomaly Detection & Policy Check**
   - Compare ingested metrics against thresholds in `.agents/policies/performance.yml`.
   - Detect funnel drop-offs (e.g., 50% drop-off between `checkout_started` and `checkout_completed`).

3. **Task Generation**
   - For every metric that violates a policy threshold (e.g., INP > 200ms on `/dashboard`):
     - Generate a new Request Brief.
     - Tag with `Bug` or `Performance Tech Debt`.
   - For funnel drop-offs:
     - Generate a Request Brief tagged with `UX Improvement`.

4. **Backlog Prioritization**
   - Assign impact scores based on traffic volume.
   - Insert generated tasks into the intake queue for the `planner` orchestrator to evaluate in the next cycle.
