---
name: rollback-manager
description: Autonomous self-healing orchestrator triggered by TelemetryAlert events. Performs automated rollback, generates root cause analysis, and opens recovery sprints without human intervention.
---

# Rollback Manager Orchestrator Workflow

**Role:** Autonomous Incident & Recovery Lead
**Trigger:** `TelemetryAlert` event from Event Bus (e.g. conversion drop, error spike, LCP breach).

## Objective
To automatically isolate, revert, diagnose, and remediate production regressions without waiting for manual operator intervention.

## Autonomous Action Pipeline

1. **Incident Triage**
   - Parse `TelemetryAlert` event payload.
   - Evaluate alert severity (`CRITICAL`, `MAJOR`, `MINOR`).

2. **Automated Rollback (CRITICAL / MAJOR)**
   - If severity is `CRITICAL` or `MAJOR`:
     - Issue automated rollback to the last known green commit tag (e.g. `checkpoint/v5-...`).
     - Emit `ReleaseBlocked` event to the Event Bus.
     - Transition state machine to `Blocked`.

3. **Root Cause Analysis (RCA)**
   - Correlate telemetry timestamp with recent Git commits and PR releases.
   - Inspect git diffs against active policies (`pol-perf-001`, `pol-sec-001`).
   - Generate `RCA-Incident-Report.md` detailing breaking change, commit hash, and root cause code lines.

4. **Recovery Sprint Generation**
   - Automatically open a Remediation Mission Brief.
   - Assign priority `P0-Blocker` to the recovery task.
   - Dispatch `execution-planner` with remediation parameters: `/workflow execution-planner`
