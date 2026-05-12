---
uri: chittycanon://docs/tech/architecture/chittyprime-architecture
type: summary
status: DRAFT
---

# ChittyPrime Architecture

## Ecosystem Position

ChittyPrime is a foundation-layer builder fractal. It sits before implementation and execution, converting rough intent into a governed artifact that ChittyCanon, ChittySchema, ChittyCertify, ChittyRegister, ChittyTrust, and ChittyScore can validate or promote.

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

## TY / VY / RY Loop

- **TY** checks whether identity is structurally coherent
- **VY** checks connectivity completeness
- **RY** checks authority and certification readiness

Promotion remains blocked until the scorecard crosses the configured threshold and the blocking authority items are resolved.
