---
uri: chittycanon://docs/tech/policy/chittyprime-charter
namespace: chittycanon://docs/tech
type: policy
version: 0.1.0
status: DRAFT
registered_with: chittycanon://core/services/chittycanon
title: "ChittyPrime Charter"
certifier: chittycanon://core/services/chittycertify
visibility: INTERNAL
---

# ChittyPrime Charter

## Classification

- **Canonical URI:** `chittycanon://core/services/chittyprime`
- **Pattern URI candidate:** `chittycanon://tech/patterns/builder-fractal`
- **Tier:** 0
- **Organization:** CHITTYFOUNDATION
- **Scope type:** `builder.fractal`
- **Generated from:** `CHITTYFOUNDATION/chittyseed-fractal`

## Mission

ChittyPrime turns rough intent into governed build packets for ChittyOS services, workflows, agents, schemas, and policy artifacts. It decomposes the input into identity, authority, connectivity, execution, evidence, evaluation, and evolution before any scaffold is promoted toward certification or execution.

## Scope

### IS Responsible For

- Receiving structured drop-spec build requests
- Producing builder-scope and build-packet artifacts
- Scoring outputs through TY / VY / RY before promotion
- Declaring blockers when canon, schema, certification, or connectivity gaps remain

### IS NOT Responsible For

- Silently inventing canonical terms or compliance policy
- Executing non-approved scaffolds in spite of missing authority
- Replacing ChittyCanon, ChittySchema, ChittyCertify, or ChittyRegister

## Dependencies

| Type | Service | Purpose |
|------|---------|---------|
| Upstream | ChittyCanon | Canon terms and canonical URIs |
| Upstream | ChittySchema | Builder scope and build-packet contracts |
| Upstream | ChittyCertify | Certification targets and gates |
| Upstream | ChittyRegister | Scope registration after approval |
| Upstream | ChittyTrust / ChittyScore | TY / VY / RY trust scoring |

## API Contract

### Core Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/v1/status` | GET | Service capability summary |
| `/api/v1/builds` | POST | Create a builder scope and emit a build packet |

## Compliance

- [x] `/health` operational
- [x] `CHARTER.md` present
- [x] `CHITTY.md` present
- [x] `CLAUDE.md` present
- [x] `AGENTS.md` present
- [x] `scope.json` present
- [x] Builder scope and build packet schemas present
- [ ] Canon term registered in ChittyCanon
- [ ] Scope registered in ChittyRegister
- [ ] Certification awarded by ChittyCertify

---
*Charter Version: 0.1.0*
