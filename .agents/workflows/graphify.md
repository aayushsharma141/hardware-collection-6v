---
name: graphify
description: Turn any folder of files into a navigable knowledge graph
---

<!-- generated-by: gsd-doc-writer -->
# Workflow: graphify

## Purpose

Build or refresh a knowledge graph of this repository so agents can answer architecture
questions ("what renders the catalogue?", "what calls `createLead`?") from a scoped
subgraph instead of reading raw files. The standing rule for using the graph is
`.agents/rules/graphify.md`.

## When to run

- Before a broad architecture or dependency review (`architecture_review`, `dependency_review`).
- After a refactor that moves or renames files under `src/`.
- Whenever `graphify-out/graph.json` is missing — it is gitignored, so a fresh clone or
  worktree never has it.

## Inputs

- Target path. If none is given, use `.` (the project root).
- The graphify skill at `~/.claude/skills/graphify/SKILL.md`. It lives in the user's home
  directory, not in this repo; if it is absent, stop and report that the workflow cannot run.

## Steps

1. Check whether `graphify-out/graph.json` exists at the project root.
2. If it exists and the request is a question, skip extraction and run
   `graphify query "<question>"` (use `graphify path "<A>" "<B>"` for relationships and
   `graphify explain "<concept>"` for a single concept).
3. If it does not exist, or a rebuild was asked for, follow the full pipeline in
   `~/.claude/skills/graphify/SKILL.md` against the target path.
4. After code changes in the same session, run `graphify update .` (AST-only, no API cost).
5. Exclude `_quarantine/`, `_archive/`, `node_modules/` and `.next/` from interpretation —
   they are not live code.

## Pass/fail criteria

- **Pass:** `graphify-out/graph.json` exists and a sample query about `src/app/` returns nodes.
- **Fail:** the skill is not installed, extraction errors, or the graph contains no nodes from `src/`.

## Output

- `graphify-out/` (gitignored, never committed): `graph.json`, `GRAPH_REPORT.md`, and any
  wiki the skill generates.
- If the run was part of a review, a short summary (date, target path, node/edge counts,
  notable findings) in `docs/reviews/graphify-YYYY-MM-DD.md`. Create `docs/reviews/` on first run.
