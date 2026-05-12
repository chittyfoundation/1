# CLAUDE.md

## Project Overview

ChittyPrime is the ChittyOS builder fractal. It turns rough intent into a governed build packet, scaffold plan, and validation-ready artifact set.

**Repo:** `CHITTYFOUNDATION/chittyprime`
**Deploy:** Cloudflare Workers at `chittyprime.chitty.cc`
**Stack:** Hono TypeScript, Zod
**Canonical URI:** `chittycanon://core/services/chittyprime` | Tier 0
**Generated from:** `CHITTYFOUNDATION/chittyseed-fractal`

## Repository Layout — Fractal Trinity

This repo follows the **ChittyOS fractal trinity** (identity / authority / connectivity), mirroring the data-layer scope primitive at the directory level. See `scope.json` for the scope manifest.

```
<repo>/
├── identity/                 # ChittyID layer — what this service IS
│   ├── src/                  # source code
│   ├── agents/               # subagent definitions (specific to this service)
│   ├── scripts/              # build / generation / validation scripts
│   ├── schemas/              # JSON Schema definitions for builder scopes and build packets
│   └── docs/                 # builder docs
│
├── authority/                # ChittyTrust + ChittyCert + ChittyCanon — weight
│   ├── canon/                # chittycanon:// citations
│   ├── certifications/       # ChittyCertify badges
│   └── owners/               # CODEOWNERS, governance
│
├── connectivity/             # ChittyConnect + ChittyRouter — interaction
│   ├── api/                  # inbound endpoints (Worker handlers)
│   ├── integrations/         # outbound hooks
│   ├── migrations/           # SQL per database
│   ├── releases/             # CHANGELOG, version tags
│   ├── deployments/          # deploy logs, beacon reports
│   ├── consumers/            # populated from Owner Manifest
│   └── upstreams/            # dependency declarations
│
├── scopes/                   # recursive fractal sub-services (each is a child scope)
│
├── scope.json                # fractal scope manifest at repo root
├── CHARTER.md                # API contract
├── CHITTY.md                 # architecture
├── AGENTS.md                 # builder agent inventory
├── CLAUDE.md                 # this file
├── package.json
├── tsconfig.json
└── wrangler.jsonc
```

## Common Commands

```bash
npm install
npm run validate:fractal
npm run build
npm test
npm run lint
```

## Per-Service Ownership Pattern (BINDING)

- Builder contracts live in `identity/schemas/`
- Drop-spec and builder docs live in `identity/docs/`
- Root governance lives in `CHARTER.md`, `CHITTY.md`, `AGENTS.md`, and `authority/owners/`

## No Mocks / No Fake Data / No Placeholder Endpoints (BINDING)

For this service:
- All routes execute real request validation and decomposition logic
- Tests exercise real builder logic and Hono routes without mocks
- Builder changes must keep `npm run validate:fractal`, `npm run build`, and `npm test` green

## Related Services

- **ChittyCanon** — Canon terms and canonical URI governance
- **ChittySchema** — Builder scope and build-packet contracts
- **ChittyCertify** — Compliance certification
- **ChittyRegister** — Scope registration
- **ChittyTrust / ChittyScore** — TY / VY / RY scoring
