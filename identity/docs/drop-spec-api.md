# Drop-Spec API

`POST /api/v1/builds` accepts a structured build request and returns:

- `build_id`
- `builder_scope_id`
- `status`
- `build_packet_artifact_id`
- `blockers`
- `next_actions`
- `build_packet`

The request envelope is defined by `identity/schemas/drop-spec-request.schema.json`.
