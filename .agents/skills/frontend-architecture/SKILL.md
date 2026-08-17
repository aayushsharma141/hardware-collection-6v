---
name: frontend-architecture
description: Specialist skill for governing React components, TypeScript props, Zustand state stores, and layout primitives in Crossangle.
---

# Frontend Architecture Skill

## Principles
1. **Separation of Concerns:** UI primitives (`Container`, `Surface`, `Button`) must be purely presentational. Domain logic lives in hooks (`hooks/`) or stores (`stores/`).
2. **Token Strictness:** Components must consume `--s-*` semantic CSS variables. Never introduce hardcoded hex colors or Tailwind pixel utilities.
3. **Type Safety:** All props must be explicitly typed with strict TypeScript interfaces. Zero `any` types allowed.
