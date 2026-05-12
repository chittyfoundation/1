import { z } from 'zod';

export const SERVICE_NAME = 'chittyprime';
export const BUILDER_SCOPE_SCHEMA_FILE = 'builder.fractal.schema.json';
export const BUILD_PACKET_SCHEMA_FILE = 'build-packet.schema.json';
export const DROP_SPEC_REQUEST_SCHEMA_FILE = 'drop-spec-request.schema.json';
const MAX_SUMMARY_LENGTH = 180;
const MAX_SUMMARY_CONTENT_LENGTH = MAX_SUMMARY_LENGTH - 3;

const inputTypes = ['spec', 'idea', 'repo', 'workflow', 'schema', 'agent', 'document_model'] as const;
const artifactTypes = ['service', 'workflow', 'schema', 'agent', 'pipeline', 'doc_model', 'policy'] as const;
const executionModes = ['scaffold_only', 'approval_required', 'execute'] as const;

export const buildRequestSchema = z.object({
  input_type: z.enum(inputTypes),
  target_artifact_type: z.enum(artifactTypes),
  title: z.string().trim().min(1),
  raw_spec: z.string().trim().min(1),
  constraints: z.record(z.union([z.boolean(), z.number(), z.string()])).default({}),
  desired_outputs: z.array(z.string().trim().min(1)).min(1),
  execution_mode: z.enum(executionModes).default('scaffold_only'),
});

export type BuildRequest = z.infer<typeof buildRequestSchema>;

type BuildLayer = 'identity' | 'authority' | 'connectivity' | 'execution' | 'evidence' | 'evaluation' | 'evolution';

type GeneratedArtifact = {
  name: string;
  path: string;
  status: 'planned';
};

type Blocker = {
  id: string;
  layer: BuildLayer;
  description: string;
  severity: 'medium' | 'high';
};

// Build packet contains ONLY values derived from the user-supplied request,
// the seven layer skeleton, and explicit blockers/unknowns. Hard-coded
// fabricated lists of agents, miniloops, queues, workflows, or scorecards
// have been removed — those must come from real configuration once it exists.
type BuildPacket = {
  packet_id: string;
  builder_scope_id: string;
  source_spec_artifact_id: string;
  identity: {
    name: string;
    description: string;
    artifact_type: BuildRequest['target_artifact_type'];
    canonical_uri: string | null;
    domain: string | null;
    tier: number | null;
    owner: string;
    visibility: 'INTERNAL';
  };
  authority: {
    schema_contracts: string[];
    approval_required: boolean;
    legal_hold: boolean;
    restricted_data: boolean;
    canon_terms: null;
    policy_refs: null;
    certification_target: null;
  };
  connectivity: {
    apis: string[];
    upstream_services: null;
    downstream_services: null;
    events: null;
    queues: null;
    buckets: null;
    hyperdrive_bindings: null;
    auth_required: boolean;
  };
  execution: {
    runtime: 'cloudflare-workers';
    deployment_environments: string[];
    workflows: null;
    agents: null;
    miniloops: null;
    queues: null;
    schedules: null;
  };
  evidence: {
    scope_artifacts: string[];
    audit_required: boolean;
    scope_events: null;
    ledger_candidate_policy: null;
    retention_policy: null;
  };
  evaluation: {
    tests: string[];
    acceptance_criteria: null;
    rubrics: null;
    replay_sets: null;
    third_party_evaluator: null;
    minimum_score: null;
  };
  evolution: {
    promotion_policy: 'certified_only';
    alchemist_enabled: null;
    allowed_patch_types: null;
    requires_replay: null;
    requires_human_approval: null;
  };
  generated_artifacts: GeneratedArtifact[];
  blockers: Blocker[];
  scorecard: null;
};

type BuildEnvelope = {
  build_id: string;
  builder_scope_id: string;
  status: 'decomposed';
  build_packet_artifact_id: string;
  blockers: Blocker[];
  build_packet: BuildPacket;
};

function slugify(value: string): string {
  if (!value.trim()) {
    return 'unnamed-build';
  }

  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'unnamed-build';
}

function summarizeSpec(rawSpec: string): string {
  const normalized = rawSpec.replace(/\s+/g, ' ').trim();
  return normalized.length > MAX_SUMMARY_LENGTH
    ? `${normalized.slice(0, MAX_SUMMARY_CONTENT_LENGTH)}...`
    : normalized;
}

function createGeneratedArtifacts(desiredOutputs: string[]): GeneratedArtifact[] {
  return desiredOutputs.map((name) => ({
    name,
    path: name.startsWith('/') ? name : `/${name}`,
    status: 'planned',
  }));
}

function createBlockers(executionMode: BuildRequest['execution_mode']): Blocker[] {
  const blockers: Blocker[] = [
    {
      id: 'identity.canonical-uri-unassigned',
      layer: 'identity',
      description:
        'A canonical URI has not been assigned. ChittyCanon must register the term and confirm the canonical URI before promotion.',
      severity: 'high',
    },
    {
      id: 'authority.canon-terms-unregistered',
      layer: 'authority',
      description:
        'No canon terms have been registered for this builder output. ChittyCanon must accept the term set before any certification gate runs.',
      severity: 'high',
    },
    {
      id: 'authority.schema-contracts-unpublished',
      layer: 'authority',
      description:
        'ChittySchema must publish the builder scope and build-packet contracts before this scaffold can be certified.',
      severity: 'medium',
    },
    {
      id: 'connectivity.upstream-bindings-undeclared',
      layer: 'connectivity',
      description:
        'Workers service bindings for upstream ChittyOS services have not been declared in wrangler.jsonc. Service-to-service auth requires bindings, not tokens.',
      severity: 'high',
    },
    {
      id: 'evaluation.scoring-not-implemented',
      layer: 'evaluation',
      description:
        'TY / VY / RY scoring is not implemented in this build. Promotion remains blocked until a real scorecard producer exists.',
      severity: 'high',
    },
  ];

  if (executionMode === 'execute') {
    blockers.push({
      id: 'connectivity.promotion-integrations-missing',
      layer: 'connectivity',
      description:
        'Execute mode is blocked: ChittyCertify and ChittyRegister promotion integrations are not wired.',
      severity: 'high',
    });
  }

  return blockers;
}

export function createBuildPacket(input: BuildRequest): BuildPacket {
  const slug = slugify(input.title);
  const blockers = createBlockers(input.execution_mode);

  return {
    packet_id: `packet_${slug}`,
    builder_scope_id: `scope_${slug}`,
    source_spec_artifact_id: `artifact_${slug}_source`,
    identity: {
      name: slug,
      description: summarizeSpec(input.raw_spec),
      artifact_type: input.target_artifact_type,
      canonical_uri: null,
      domain: null,
      tier: null,
      owner: 'CHITTYFOUNDATION',
      visibility: 'INTERNAL',
    },
    authority: {
      schema_contracts: [BUILDER_SCOPE_SCHEMA_FILE, BUILD_PACKET_SCHEMA_FILE, DROP_SPEC_REQUEST_SCHEMA_FILE],
      approval_required: true,
      legal_hold: false,
      restricted_data: Boolean(input.constraints.legal_data_in_legal_space),
      canon_terms: null,
      policy_refs: null,
      certification_target: null,
    },
    connectivity: {
      apis: ['GET /health', 'GET /api/v1/status', 'POST /api/v1/builds'],
      upstream_services: null,
      downstream_services: null,
      events: null,
      queues: null,
      buckets: null,
      hyperdrive_bindings: null,
      auth_required: input.execution_mode === 'execute',
    },
    execution: {
      runtime: 'cloudflare-workers',
      deployment_environments: ['dev', 'staging', 'production'],
      workflows: null,
      agents: null,
      miniloops: null,
      queues: null,
      schedules: null,
    },
    evidence: {
      scope_artifacts: input.desired_outputs,
      audit_required: true,
      scope_events: null,
      ledger_candidate_policy: null,
      retention_policy: null,
    },
    evaluation: {
      tests: ['request schema validation', 'build packet generation', 'API contract coverage'],
      acceptance_criteria: null,
      rubrics: null,
      replay_sets: null,
      third_party_evaluator: null,
      minimum_score: null,
    },
    evolution: {
      promotion_policy: 'certified_only',
      alchemist_enabled: null,
      allowed_patch_types: null,
      requires_replay: null,
      requires_human_approval: null,
    },
    generated_artifacts: createGeneratedArtifacts(input.desired_outputs),
    blockers,
    scorecard: null,
  };
}

export function createBuildEnvelope(request: BuildRequest): BuildEnvelope {
  const buildPacket = createBuildPacket(request);

  return {
    build_id: `build_${buildPacket.identity.name}`,
    builder_scope_id: buildPacket.builder_scope_id,
    status: 'decomposed',
    build_packet_artifact_id: `artifact_${buildPacket.identity.name}_build_packet`,
    blockers: buildPacket.blockers,
    build_packet: buildPacket,
  };
}
