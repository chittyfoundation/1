import { describe, expect, it } from 'vitest';

import { BUILDER_SCOPE_SCHEMA_FILE, createBuildEnvelope, createBuildPacket } from './builder.js';

const request = {
  input_type: 'spec' as const,
  target_artifact_type: 'service' as const,
  title: 'ChittyPrime Builder Fractal',
  raw_spec: 'Turn raw intent into a governed build packet that can be validated and certified.',
  constraints: {
    no_new_database: true,
    use_existing_scope_model: true,
  },
  desired_outputs: ['CHARTER.md', 'CHITTY.md', 'AGENTS.md', 'scope.json'],
  execution_mode: 'scaffold_only' as const,
};

describe('createBuildPacket', () => {
  it('decomposes a request into the seven ChittyPrime layers', () => {
    const packet = createBuildPacket(request);

    expect(packet.identity.name).toBe('chittyprime-builder-fractal');
    expect(packet.authority.schema_contracts).toContain(BUILDER_SCOPE_SCHEMA_FILE);
    expect(packet.connectivity.apis).toContain('POST /api/v1/builds');
    expect(packet.execution.runtime).toBe('cloudflare-workers');
    expect(packet.evidence.scope_artifacts).toEqual(request.desired_outputs);
    expect(packet.evolution.promotion_policy).toBe('certified_only');
  });

  it('emits explicit nulls for unknown fields (no fabricated data)', () => {
    const packet = createBuildPacket(request);

    // Build packet must NOT invent agent lists, workflows, miniloops, queues,
    // canon terms, rubrics, or scorecards. Those become real only when the
    // upstream services confirm them. See reviewer feedback on PR #1.
    expect(packet.authority.canon_terms).toBeNull();
    expect(packet.authority.policy_refs).toBeNull();
    expect(packet.connectivity.upstream_services).toBeNull();
    expect(packet.connectivity.events).toBeNull();
    expect(packet.connectivity.queues).toBeNull();
    expect(packet.execution.workflows).toBeNull();
    expect(packet.execution.agents).toBeNull();
    expect(packet.execution.miniloops).toBeNull();
    expect(packet.evaluation.rubrics).toBeNull();
    expect(packet.evolution.alchemist_enabled).toBeNull();
    expect(packet.scorecard).toBeNull();
  });

  it('surfaces blockers for every unresolved authority/connectivity/evaluation gap', () => {
    const packet = createBuildPacket(request);

    expect(packet.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'identity.canonical-uri-unassigned', layer: 'identity' }),
        expect.objectContaining({ id: 'authority.canon-terms-unregistered', layer: 'authority' }),
        expect.objectContaining({ id: 'authority.schema-contracts-unpublished', layer: 'authority' }),
        expect.objectContaining({ id: 'connectivity.upstream-bindings-undeclared', layer: 'connectivity' }),
        expect.objectContaining({ id: 'evaluation.scoring-not-implemented', layer: 'evaluation' }),
      ]),
    );
  });

  it('adds an execute-mode promotion blocker only when execute is requested', () => {
    const scaffold = createBuildPacket(request);
    const execute = createBuildPacket({ ...request, execution_mode: 'execute' });

    expect(scaffold.blockers.map((b) => b.id)).not.toContain('connectivity.promotion-integrations-missing');
    expect(execute.blockers.map((b) => b.id)).toContain('connectivity.promotion-integrations-missing');
  });

  it('normalizes titles into safe slugs and truncates long normalized specs', () => {
    const packet = createBuildPacket({
      ...request,
      title: '  *** Chitty__Prime!!! Builder ###  ',
      raw_spec: `  ${'builder    '.repeat(30)}  `,
    });

    expect(packet.identity.name).toBe('chitty-prime-builder');
    expect(packet.identity.description).not.toContain('  ');
    expect(packet.identity.description).toHaveLength(180);
    expect(packet.identity.description.endsWith('...')).toBe(true);
  });

  it('falls back to a safe slug when a title has no alphanumeric characters', () => {
    const packet = createBuildPacket({
      ...request,
      title: '!!!@@@###',
    });

    expect(packet.identity.name).toBe('unnamed-build');
    expect(packet.packet_id).toBe('packet_unnamed-build');
  });

  it('normalizes generated artifact paths to absolute-style paths', () => {
    const packet = createBuildPacket({
      ...request,
      desired_outputs: ['scope.json', 'templates/charter.md.hbs', '/AGENTS.md'],
    });

    expect(packet.generated_artifacts).toEqual([
      expect.objectContaining({ path: '/scope.json' }),
      expect.objectContaining({ path: '/templates/charter.md.hbs' }),
      expect.objectContaining({ path: '/AGENTS.md' }),
    ]);
  });
});

describe('createBuildEnvelope', () => {
  it('returns the decomposed envelope expected by the drop-spec API', () => {
    const envelope = createBuildEnvelope(request);

    expect(envelope.status).toBe('decomposed');
    expect(envelope.build_id).toBe('build_chittyprime-builder-fractal');
    expect(envelope.build_packet.generated_artifacts).toHaveLength(request.desired_outputs.length);
    expect(envelope.blockers.length).toBeGreaterThan(0);
  });
});
