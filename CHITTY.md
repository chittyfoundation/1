---
uri: chittycanon://docs/tech/architecture/chittyprime-architecture
type: summary
status: DRAFT
---

# ChittyPrime Architecture

## Ecosystem Position

ChittyPrime is a foundation-layer builder fractal. It sits before implementation and execution, converting rough intent into a governed artifact that ChittyCanon, ChittySchema, ChittyCertify, ChittyRegister, and ChittyTrust can validate or promote.

## Core Flow

```text
Input Spec
→ Builder Scope
→ Fractal Decomposition
→ Build Packet
→ Scaffold Plan
→ Validate / Replay / Certify
→ Approve + Execute
```

## Seven Builder Layers

1. **Identity** — what the thing is
2. **Authority** — why it is allowed
3. **Connectivity** — what it connects to
4. **Execution** — how it runs
5. **Evidence** — how it proves what happened
6. **Evaluation** — how it is judged
7. **Evolution** — how it improves safely

## Current Implementation

- Shared TypeScript builder logic in `identity/src/`
- Cloudflare Worker API routes in `connectivity/api/`
- Builder JSON Schemas in `identity/schemas/`
- Drop-spec documentation in `identity/docs/`
- Root governance and ownership docs at repo root and `authority/owners/`

## Promotion Gating

Promotion remains blocked while the build packet emits unresolved blockers (see `identity/src/builder.ts`). The current implementation does **not** produce a numeric scorecard — `scorecard` is emitted as `null`. A scoring producer (rubrics, thresholds, judges) must be designed and implemented separately before promotion gates can rely on thresholds. Until then, gating is binary: any unresolved blocker prevents promotion.
