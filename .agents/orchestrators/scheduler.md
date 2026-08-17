---
name: scheduler
description: Orchestrator that determines task parallelization and sequential execution, delegating to specialist agents.
---

# Scheduler Orchestrator Workflow

**Role:** Delivery Manager / Dispatcher
**Trigger:** Handoff from Planner Orchestrator.

## Objective
To coordinate the execution of the tasks defined in the Execution Plan, dispatching work to specialist agents and managing dependencies.

## Steps

1. **Ingest Execution Plan**
   - Read the Execution Plan produced by the Planner.

2. **Task Dispatch**
   - For each task in the current execution phase:
     - If the task is ready (dependencies met), dispatch it to the designated specialist agent.
     - Provide the specialist agent with the task definition and relevant context.

3. **Monitor & Wait**
   - Wait for specialist agents to complete their tasks.
   - Collect the `ReviewResult` or completion artifacts from the agents.

4. **Phase Advancement**
   - Once all tasks in a phase are complete, move to the next phase.
   - If any task fails, halt and request human intervention or trigger a remediation workflow.

5. **Handoff to Reviewer**
   - When all execution phases are complete, aggregate the results and hand off to the `reviewer` orchestrator: `/workflow reviewer`
