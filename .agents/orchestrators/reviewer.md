---
name: reviewer
description: Orchestrator that aggregates outputs from specialist agents and validates them against all machine-readable policies.
---

# Reviewer Orchestrator Workflow

**Role:** QA Lead / Compliance Officer
**Trigger:** Handoff from Scheduler Orchestrator.

## Objective
To validate all completed work against the machine-readable policies (design, accessibility, security, performance, architecture) using the standardized `ReviewResult` protocol.

## Steps

1. **Aggregate Results**
   - Collect all `ReviewResult.ts` structured outputs from the executed tasks.

2. **Policy Enforcement**
   - Validate the aggregated results against the YAML policies in `.agents/policies/`.
   - Ensure no critical violations (blockers) exist in:
     - `design.yml`
     - `accessibility.yml`
     - `security.yml`
     - `performance.yml`
     - `architecture.yml`

3. **Feedback Loop Routing**
   - If warnings or non-critical issues are found, log them as future technical debt.
   - If blockers are found, fail the review and route back to the `scheduler` for remediation, specifying exactly which agent needs to fix which file.

4. **Approve for Release**
   - If all policies pass, generate a "Ready for Release" certification.
   - Hand off to the `release-manager` orchestrator: `/workflow release-manager`
