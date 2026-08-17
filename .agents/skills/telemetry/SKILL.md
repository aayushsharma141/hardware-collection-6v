---
name: telemetry
description: Specialist skill for governing analytics event schemas, PostHog telemetry, funnel tracking, and A/B test metadata contracts.
---

# Telemetry & Product Analytics Skill

## Principles
1. **Contract Enforcement:** All telemetry events must be declared in `apps/web/src/analytics/events.ts` under `AnalyticsEventMap`.
2. **Data Privacy:** Payloads must never contain PII, passwords, or raw user credentials.
3. **Funnel Validation:** Track every step of the Discovery Quiz, Estimator Path Selection, and Consultation Form submit.
