# ChittyPrime

> **ChittyPrime: where intent becomes infrastructure.**

ChittyPrime is the first-builder fractal for ChittyOS. It turns rough intent—an idea, spec, workflow, schema, agent, or repo—into a governed build packet that can be validated, certified, registered, and executed.

## What this repo currently implements

- A concrete **builder.fractal** repo scaffold for ChittyPrime
- JSON Schemas for the builder scope, build packet, and drop-spec request envelope
- A **`POST /api/v1/builds`** endpoint that decomposes a raw spec into identity, authority, connectivity, execution, evidence, evaluation, and evolution layers
- Initial generated-artifact planning, blocker reporting, and TY/VY/RY score output

## Bootstrap builders

| Builder | Responsibility |
| --- | --- |
| You / product authority | Naming, doctrine, and final approval |
| ChittyCanon | Canon terms and canonical URI approval |
| ChittySchema | Scope and build-packet contracts |
| ChittyCertify | Certification gates for generated scaffolds |
| ChittyRegister | Scope registration after compliance |
| ChittyTrust / ChittyScore | TY / VY / RY scoring |
| ChittyPrime bootstrap agent | Initial scaffold generation |

## Build flow

```text
Raw intent
→ ChittyPrime
→ Build Packet
→ Scaffold
→ Validate
→ Certify
→ Execute
```

## API

### `POST /api/v1/builds`

Creates a builder scope from a raw specification and returns a decomposed build packet plus blockers and next actions.

Example request:

```json
{
  "input_type": "spec",
  "target_artifact_type": "service",
  "title": "ChittyPrime Builder Fractal",
  "raw_spec": "Turn rough intent into governed build packets.",
  "constraints": {
    "no_new_database": true,
    "use_existing_scope_model": true
  },
  "desired_outputs": [
    "CHARTER.md",
    "CHITTY.md",
    "AGENTS.md",
    "scope.json",
    "build-packet.schema.json"
  ],
  "execution_mode": "scaffold_only"
}
```

## Schemas

The initial builder contracts live in `identity/schemas`:

- `builder.fractal.schema.json`
- `build-packet.schema.json`
- `drop-spec-request.schema.json`

## Commands

```bash
npm install
npm run validate:fractal
npm run build
npm test
npm run lint
```
