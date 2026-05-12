import { z } from 'zod';

export const SERVICE_NAME = 'chittyprime';
export const BUILDER_SCOPE_SCHEMA_FILE = 'builder.fractal.schema.json';
export const BUILD_PACKET_SCHEMA_FILE = 'build-packet.schema.json';
export const DROP_SPEC_REQUEST_SCHEMA_FILE = 'drop-spec-request.schema.json';

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
  layer: Extract<BuildLayer, 'authority' | 'connectivity'>;
  description: string;
  severity: 'medium' | 'high';
};

type NextAction = {
  task: string;
  output: string;
};

type Scorecard = {
  ty: number;
  vy: number;
  ry: number;
  threshold: number;
  meets_threshold: boolean;
};

type BuildPacket = {
  packet_id: string;
  builder_scope_id: string;
  source_spec_artifact_id: string;
  identity: {
    name: string;
    description: string;
    artifact_type: BuildRequest['target_artifact_type'];
    canonical_uri: string;
    domain: string;
    tier: number;
    owner: string;
    visibility: 'INTERNAL';
  };
  authority: {
    canon_terms: string[];
    schema_contracts: string[];
    policy_refs: string[];
    approval_required: boolean;
    certification_target: 'Certified';
    legal_hold: boolean;
    restricted_data: boolean;
  };
  connectivity: {
    apis: string[];
    events: string[];
    queues: string[];
    buckets: string[];
    hyperdrive_bindings: string[];
    upstream_services: string[];
    downstream_services: string[];
    auth_required: boolean;
  };
  execution: {
    runtime: 'cloudflare-workers';
    workflows: string[];
    agents: string[];
    miniloops: string[];
    queues: string[];
    schedules: string[];
    deployment_environments: string[];
  };
  evidence: {
    scope_events: string[];
    scope_artifacts: string[];
    audit_required: boolean;
    ledger_candidate_policy: 'accepted_outputs';
    retention_policy: string;
  };
  evaluation: {
    acceptance_criteria: string[];
    rubrics: string[];
    tests: string[];
    replay_sets: string[];
    third_party_evaluator: boolean;
    minimum_score: number;
  };
  evolution: {
    alchemist_enabled: boolean;
    allowed_patch_types: string[];
    requires_replay: boolean;
    requires_human_approval: boolean;
    promotion_policy: 'certified_only';
  };
  generated_artifacts: GeneratedArtifact[];
  blockers: Blocker[];
  next_actions: NextAction[];
  scorecard: Scorecard;
};

type BuildEnvelope = {
  build_id: string;
  builder_scope_id: string;
  status: 'decomposed';
  build_packet_artifact_id: string;
  blockers: Blocker[];
  next_actions: NextAction[];
  build_packet: BuildPacket;
};

const upstreamServices = [
  'chittycanon',
  'chittyschema',
  'chittycertify',
  'chittyregister',
  'chittytrust',
  'chittyscore',
];

const scaffoldAgents = [
  'SpecIntakeAgent',
  'FractalDecomposerAgent',
  'CanonMapperAgent',
  'SchemaMapperAgent',
  'ConnectivityMapperAgent',
  'ScaffoldAgent',
  'ComplianceAgent',
  'EvaluatorAgent',
  'AlchemistAgent',
];

const miniloops = [
  'SpecNormalizationLoop',
  'FractalDecompositionLoop',
  'ScaffoldGenerationLoop',
  'ComplianceValidationLoop',
  'ReplayValidationLoop',
  'AlchemistImprovementLoop',
];

const nextActions: NextAction[] = [
  {
    task: 'Create Builder Fractal scope profile',
    output: BUILDER_SCOPE_SCHEMA_FILE,
  },
  {
    task: 'Create Build Packet schema',
    output: BUILD_PACKET_SCHEMA_FILE,
  },
  {
    task: 'Create drop-spec API envelope',
    output: 'POST /api/v1/builds contract',
  },
  {
    task: 'Create CHARTER/CHITTY/AGENTS templates',
    output: 'templates/*.hbs',
  },
  {
    task: 'Run ChittyAgent Fabric spec through Builder as first fixture',
    output: 'build packet + scaffold diff',
  },
];

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || 'unnamed-build';
}

function summarizeSpec(rawSpec: string): string {
  const normalized = rawSpec.replace(/\s+/g, ' ').trim();
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function createGeneratedArtifacts(desiredOutputs: string[]): GeneratedArtifact[] {
  return desiredOutputs.map((name) => ({
    name,
    path: name.includes('/') ? name : `/${name}`,
    status: 'planned',
  }));
}

function createBlockers(executionMode: BuildRequest['execution_mode']): Blocker[] {
  return [
    {
      id: 'canon-registration',
      layer: 'authority',
      description:
        'ChittyCanon must register the `chitty.prime.builder` term and confirm the canonical URI before promotion.',
      severity: 'high',
    },
    {
      id: 'schema-publication',
      layer: 'authority',
      description:
        'ChittySchema must publish the builder scope and build-packet contracts before this scaffold can be certified.',
      severity: 'medium',
    },
    {
      id: 'promotion-integrations',
      layer: 'connectivity',
      description:
        executionMode === 'execute'
          ? 'Execute mode is blocked until ChittyCertify and ChittyRegister promotion integrations are wired.'
          : 'Promotion remains blocked until ChittyCertify and ChittyRegister integrations are wired.',
      severity: 'medium',
    },
  ];
}

function createScorecard(blockers: Blocker[]): Scorecard {
  const threshold = 0.9;
  const ty = 0.96;
  const vy = blockers.some((blocker) => blocker.layer === 'connectivity') ? 0.74 : 0.93;
  const ry = blockers.some((blocker) => blocker.layer === 'authority') ? 0.7 : 0.94;

  return {
    ty,
    vy,
    ry,
    threshold,
    meets_threshold: ty >= threshold && vy >= threshold && ry >= threshold,
  };
}

export function createBuildPacket(input: BuildRequest): BuildPacket {
  const slug = slugify(input.title);
  const canonicalUri = `chittycanon://core/services/${slug}`;
  const blockers = createBlockers(input.execution_mode);
  const scorecard = createScorecard(blockers);

  return {
    packet_id: `packet_${slug}`,
    builder_scope_id: `scope_${slug}`,
    source_spec_artifact_id: `artifact_${slug}_source`,
    identity: {
      name: slug,
      description: summarizeSpec(input.raw_spec),
      artifact_type: input.target_artifact_type,
      canonical_uri: canonicalUri,
      domain: `${slug}.chitty.cc`,
      tier: 0,
      owner: 'CHITTYFOUNDATION',
      visibility: 'INTERNAL',
    },
    authority: {
      canon_terms: ['chitty.prime.builder', 'builder.fractal', `${input.target_artifact_type}.scaffold`],
      schema_contracts: [BUILDER_SCOPE_SCHEMA_FILE, BUILD_PACKET_SCHEMA_FILE, DROP_SPEC_REQUEST_SCHEMA_FILE],
      policy_refs: [
        'chittycanon://tech/patterns/builder-fractal',
        'chittycanon://core/services/chittyschema#meta/repo-scope',
        'chittycanon://core/services/chittyschema#meta/fractal-layout',
      ],
      approval_required: true,
      certification_target: 'Certified',
      legal_hold: false,
      restricted_data: Boolean(input.constraints.legal_data_in_legal_space),
    },
    connectivity: {
      apis: ['GET /health', 'GET /api/v1/status', 'POST /api/v1/builds'],
      events: ['scope_events.build.created', 'scope_events.build.validated'],
      queues: ['builder-validation-queue', 'builder-replay-queue'],
      buckets: ['chittyprime-build-packets', 'chittyprime-artifacts'],
      hyperdrive_bindings: ['CHITTYOS_CORE_DB'],
      upstream_services: upstreamServices,
      downstream_services: input.target_artifact_type === 'service' ? [slug] : [],
      auth_required: input.execution_mode === 'execute',
    },
    execution: {
      runtime: 'cloudflare-workers',
      workflows: ['BuilderFractalWorkflow'],
      agents: scaffoldAgents,
      miniloops,
      queues: ['builder-validation-queue', 'builder-replay-queue'],
      schedules: [],
      deployment_environments: ['dev', 'staging', 'production'],
    },
    evidence: {
      scope_events: ['build.created', 'build.decomposed', 'build.validated'],
      scope_artifacts: input.desired_outputs,
      audit_required: true,
      ledger_candidate_policy: 'accepted_outputs',
      retention_policy: 'Retain build packets, validation reports, and approval evidence for replay and certification.',
    },
    evaluation: {
      acceptance_criteria: [
        'The raw spec produces a builder scope.',
        'The builder scope decomposes into the seven ChittyPrime layers.',
        'The build packet lists blockers for missing authority, schema, or connectivity.',
        'Generated artifacts remain explicit and reviewable.',
      ],
      rubrics: ['TY', 'VY', 'RY'],
      tests: ['request schema validation', 'build packet generation', 'API contract coverage'],
      replay_sets: [`${slug}-baseline`],
      third_party_evaluator: false,
      minimum_score: 0.9,
    },
    evolution: {
      alchemist_enabled: true,
      allowed_patch_types: ['prompt', 'schema', 'routing', 'rubric', 'model_policy', 'docs'],
      requires_replay: true,
      requires_human_approval: true,
      promotion_policy: 'certified_only',
    },
    generated_artifacts: createGeneratedArtifacts(input.desired_outputs),
    blockers,
    next_actions: nextActions,
    scorecard,
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
    next_actions: buildPacket.next_actions,
    build_packet: buildPacket,
  };
}
