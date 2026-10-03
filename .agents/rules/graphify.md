---
trigger: always_on
description: Consult the graphify knowledge graph in graphify-out/ (once generated) for codebase and architecture questions.
---

## graphify

graphify-out/ is generated, gitignored output: the knowledge graph exists only after running graphify on this project.

Rules:
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI) or `query_graph` (MCP). Use `graphify path "<A>" "<B>"` / `shortest_path` for relationships and `graphify explain "<concept>"` / `get_node` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` (generated alongside the graph) or raw grep output.
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- If graphify-out/GRAPH_REPORT.md exists, read it only for broad architecture review or when query/path/explain do not surface enough context
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
