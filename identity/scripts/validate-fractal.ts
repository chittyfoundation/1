import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const requiredPaths = [
  'README.md',
  'CHARTER.md',
  'CHITTY.md',
  'CLAUDE.md',
  'AGENTS.md',
  'package.json',
  'tsconfig.json',
  'scope.json',
  'identity/src',
  'identity/docs',
  'identity/schemas',
  'identity/scripts',
  'connectivity/api',
  'authority/owners',
  'scopes',
];

async function main(): Promise<void> {
  const errors: string[] = [];

  await Promise.all(
    requiredPaths.map(async (requiredPath) => {
      try {
        await access(path.join(repoRoot, requiredPath));
      } catch {
        errors.push(`Missing required path: ${requiredPath}`);
      }
    }),
  );

  let scope: {
    name?: string;
    scope_type?: string;
    canon_uri?: string;
  };

  try {
    scope = JSON.parse(await readFile(path.join(repoRoot, 'scope.json'), 'utf8')) as {
      name?: string;
      scope_type?: string;
      canon_uri?: string;
    };
  } catch (error) {
    console.error(
      `Failed to parse scope.json: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }

  if (scope.name !== 'chittyprime') {
    errors.push('scope.json name must be "chittyprime".');
  }

  if (scope.scope_type !== 'builder.fractal') {
    errors.push('scope.json scope_type must be "builder.fractal".');
  }

  if (scope.canon_uri !== 'chittycanon://core/services/chittyprime') {
    errors.push('scope.json canon_uri must be "chittycanon://core/services/chittyprime".');
  }

  if (errors.length > 0) {
    console.error('Fractal validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Fractal validation passed.');
}

main().catch((error) => {
  console.error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
