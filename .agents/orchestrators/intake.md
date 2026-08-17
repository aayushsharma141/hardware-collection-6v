---
name: intake
description: Entrypoint orchestrator that parses raw feature requests, identifies required domains, and standardizes the request into a formal objective before passing to the planner.
---

# Intake Orchestrator Workflow

**Role:** Product Owner / Triage Agent
**Trigger:** New feature request or major user prompt.

## Objective
To ingest unstructured user requests, validate them against the Product OS architecture, and produce a formal, standardized Request Brief that the Planner Orchestrator can estimate and break down.

## Steps

1. **Ingest & Parse**
   - Read the user's raw request.
   - Identify the core intent (Feature, Bug Fix, Refactor, Infrastructure).

2. **Domain Mapping**
   - Identify which domains this request touches (e.g., Frontend, Backend, Database, Design System).
   - Reference `.agents/policies/architecture.yml` to ensure the request aligns with current architectural constraints.

3. **Risk & Policy Pre-Check**
   - Identify immediate security, accessibility, or performance risks.
   - Reference `.agents/policies/design.yml` or relevant policies to flag required specialist reviews early.

4. **Generate Request Brief**
   - Output a formal Request Brief artifact containing:
     - **Title & Summary**
     - **Affected Domains**
     - **Policy Flags** (e.g., `Requires Security Review`)
   - Stop execution and hand off to the `planner` orchestrator by outputting the slash command: `/workflow planner`
