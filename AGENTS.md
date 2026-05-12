# ChittyPrime Agents

No agents are currently registered for this service.

Service-local agents live in `identity/agents/`. Each agent file declares its canonical URI, capability_group, execution_class, authority, and bindings. Agents are registered with the ChittyAgent Orchestrator via `npm run bootstrap` (when an `identity/scripts/bootstrap.sh` exists in this repo).

Add agents only after their canonical URIs and runtime behavior are real and verifiable — do not list agents that have not yet been implemented and registered.
