import { describe, expect, it } from 'vitest';

import app from '../../connectivity/api/index.ts';

const env = {
  ENVIRONMENT: 'test',
  SERVICE_NAME: 'chittyprime',
};

describe('ChittyPrime API', () => {
  it('serves health', async () => {
    const response = await app.request('/health', {}, env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      service: 'chittyprime',
    });
  });

  it('creates a build packet from a drop-spec request', async () => {
    const response = await app.request(
      '/api/v1/builds',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          input_type: 'spec',
          target_artifact_type: 'service',
          title: 'ChittyAgent Fractal Workflow Fabric',
          raw_spec: 'Build a governed scaffold for the ChittyAgent Fractal Workflow Fabric.',
          constraints: {
            no_new_database: true,
            use_existing_scope_model: true,
          },
          desired_outputs: ['CHARTER.md', 'CHITTY.md', 'AGENTS.md', 'scope.json'],
          execution_mode: 'scaffold_only',
        }),
      },
      env,
    );

    expect(response.status).toBe(202);

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        status: 'decomposed',
        build_packet: expect.objectContaining({
          identity: expect.objectContaining({
            name: 'chittyagent-fractal-workflow-fabric',
          }),
          generated_artifacts: expect.arrayContaining([
            expect.objectContaining({ name: 'CHARTER.md' }),
          ]),
        }),
      }),
    );
  });

  it('rejects invalid build requests', async () => {
    const response = await app.request(
      '/api/v1/builds',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          input_type: 'spec',
          title: 'missing artifact type',
          raw_spec: 'invalid',
          desired_outputs: ['scope.json'],
        }),
      },
      env,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        status: 'invalid_request',
      }),
    );
  });
});
