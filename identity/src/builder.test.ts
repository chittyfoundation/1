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
    expect(packet.execution.workflows).toContain('BuilderFractalWorkflow');
    expect(packet.evidence.scope_artifacts).toEqual(request.desired_outputs);
    expect(packet.evaluation.rubrics).toEqual(['TY', 'VY', 'RY']);
    expect(packet.evolution.requires_human_approval).toBe(true);
  });

  it('surfaces blockers and keeps promotion below threshold until they are resolved', () => {
    const packet = createBuildPacket(request);

    expect(packet.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ layer: 'authority' }),
        expect.objectContaining({ layer: 'connectivity' }),
      ]),
    );
    expect(packet.scorecard.meets_threshold).toBe(false);
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
});

describe('createBuildEnvelope', () => {
  it('returns the decomposed envelope expected by the drop-spec API', () => {
    const envelope = createBuildEnvelope(request);

    expect(envelope.status).toBe('decomposed');
    expect(envelope.build_id).toBe('build_chittyprime-builder-fractal');
    expect(envelope.build_packet.generated_artifacts).toHaveLength(request.desired_outputs.length);
  });
});
