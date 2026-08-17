---
name: execution-planner
description: Tactical orchestrator that queries the Capability Graph (agent-manifest.yml), calculates resource budgets, and dispatches agents to fulfill a Mission Brief.
---

# Execution Planner Orchestrator Workflow

**Role:** Principal Engineering Architect / Dispatcher
**Trigger:** Handoff from Mission Planner or `PolicyFailed` event.

## Objective
To resolve the required capabilities for a Mission Brief by dynamically querying `agent-manifest.yml`, checking resource budgets in `resource-manager.yml`, and constructing a capability-matched execution pipeline.

## Steps

1. **Capability Discovery**
   - Ingest `MissionBrief.md`.
   - Query `.agents/capabilities/agent-manifest.yml` to match required capabilities (e.g., matching `WCAG21AA` → `accessibility-auditor`).

2. **Resource & Budget Pre-Flight**
   - Query `.agents/runtime/resource-manager.yml`.
   - Calculate estimated tokens, context window usage, parallelism limits, and budget ceiling.
   - Halt if estimated budget exceeds maximum threshold.

3. **Pipeline Construction**
   - Construct execution tracks (Parallel vs. Sequential).
   - Generate `ExecutionPipeline.json` mapping tasks to discovered agent capabilities.

4. **Handoff to Scheduler**
   - Hand off execution pipeline to `scheduler.md`: `/workflow scheduler`
