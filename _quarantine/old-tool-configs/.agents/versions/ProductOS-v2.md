# Product OS v2 Architecture Specification

## Status: Active & Operational
**Version:** 2.0.0

---

## Architecture Overview: The 8 Layers

Product OS v2 operates across an 8-layer unified runtime engine:

```
┌───────────────────────────────────────────────────────────────┐
│ 1. KNOWLEDGE LAYER (ADRs, Policies, Graphify Knowledge Graph)  │
├───────────────────────────────────────────────────────────────┤
│ 2. MISSION LAYER (Mission Planner, Strategic Intent)          │
├───────────────────────────────────────────────────────────────┤
│ 3. PLANNING LAYER (Execution Planner, Capability Graph)       │
├───────────────────────────────────────────────────────────────┤
│ 4. EXECUTION LAYER (Specialist Agents: Frontend, Backend, UI) │
├───────────────────────────────────────────────────────────────┤
│ 5. GOVERNANCE LAYER (Executable YAML Policies, Confidence)    │
├───────────────────────────────────────────────────────────────┤
│ 6. RUNTIME LAYER (Event Bus, State Machine, Resource Manager) │
├───────────────────────────────────────────────────────────────┤
│ 7. LEARNING LAYER (Telemetry Ingestion, Production Feedback)  │
├───────────────────────────────────────────────────────────────┤
│ 8. RELEASE LAYER (Release Manager, Rollback Manager, DoD)     │
└───────────────────────────────────────────────────────────────┘
```

---

## 1. Event-Driven Autonomy
The system triggers execution via the **Event Bus** (`.agents/runtime/event-bus.yml`) reacting to events: `GitPush`, `FeatureRequested`, `ArchitectureChanged`, `TelemetryAlert`, `ReleaseCandidateCreated`, `PolicyFailed`, `ReleaseApproved`, `ReleaseBlocked`.

## 2. Deterministic State Machine
Features transition through formal lifecycle states governed by `.agents/runtime/state-machine.yml`:
`Draft` → `Planned` → `Architected` → `Implementation` → `Review` → `Blocked` → `Approved` → `Released` → `Monitoring` → `Archived`.

## 3. Dynamic Capability Graph
Agents self-advertise capabilities in `.agents/capabilities/agent-manifest.yml`. The `execution-planner` dynamically discovers and routes tasks based on capabilities rather than static mappings.

## 4. Confidence Engine & Executable Logic
Policy guardrails in `.agents/policies/` use executable logic (`when:`, `require:`, `otherwise:`). Agent outputs use `ReviewResult.ts` with explicit `confidence` scoring and `needsHumanReview` flags.

## 5. Resource & Pre-Flight Budgeting
Before execution, `.agents/runtime/resource-manager.yml` enforces token limits, USD cost ceilings, context window limits, and max parallelism.

## 6. Self-Healing & Rollback Intelligence
If a `TelemetryAlert` is fired, the `.agents/orchestrators/rollback-manager.md` executes autonomous rollback to a safe checkpoint, generates a Root Cause Analysis (`RCA-Incident-Report.md`), and opens a recovery sprint automatically.

## 7. OS Self-Evaluation
Product OS monitors its own performance via `.agents/telemetry/governance-dashboard.md`, tracking architecture compliance (98%), false positive rates (2%), and human override rates (4%).
