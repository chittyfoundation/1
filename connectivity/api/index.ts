import { Hono } from 'hono';

import { SERVICE_NAME, buildRequestSchema, createBuildEnvelope } from '../../identity/src/builder.js';

interface Env {
  ENVIRONMENT: string;
  SERVICE_NAME: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/health', (c) => {
  return c.json({ status: 'ok', service: c.env.SERVICE_NAME || SERVICE_NAME });
});

app.get('/api/v1/status', (c) => {
  return c.json({
    status: 'ok',
    service: c.env.SERVICE_NAME || SERVICE_NAME,
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
    capabilities: ['builder.fractal', 'build-packet', 'drop-spec-api'],
  });
});

app.post('/api/v1/builds', async (c) => {
  const json = await c.req.json();
  const parsed = buildRequestSchema.safeParse(json);

  if (!parsed.success) {
    return c.json(
      {
        status: 'invalid_request',
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      400,
    );
  }

  return c.json(createBuildEnvelope(parsed.data), 202);
});

export default app;
