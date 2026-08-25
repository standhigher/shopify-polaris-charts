// @vitest-environment node

import { readFileSync } from 'node:fs';

interface PackageManifest {
  engines?: Record<string, string>;
  exports?: Record<string, { import?: string; types?: string }>;
  files?: string[];
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version?: string;
}

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
) as PackageManifest;

describe('v1 compatibility contract', () => {
  it('pins the stable v1 package and runtime ranges', () => {
    expect(manifest.version).toBe('1.1.1');
    expect(manifest.engines?.node).toBe('>=20 <25');
    expect(manifest.peerDependencies).toMatchObject({
      react: '>=18.3 <20',
      'react-dom': '>=18.3 <20',
      recharts: '>=3 <4'
    });
  });

  it('publishes a React-free formatter subpath', () => {
    expect(manifest.exports?.['./formatters']).toEqual({
      import: './dist/formatters.js',
      types: './dist/formatters.d.ts'
    });
  });

  it('removes the Recharts 2 legacy release gate', () => {
    expect(manifest.scripts?.['recharts:legacy-smoke']).toBeUndefined();
  });

  it('publishes runtime, types, and reviewed v1 documentation only', () => {
    expect(manifest.files).toEqual(expect.arrayContaining([
      'dist',
      'docs/migration-v1.md',
      'docs/migration-v1.zh-CN.md',
      'docs/release-checklist.md',
      'docs/performance/v1.0-budget.md',
      'docs/public-api/index.d.ts',
      'docs/public-api/formatters.d.ts'
    ]));
    for (const forbidden of ['src', 'scripts', 'tests', 'storybook-static', 'playwright-report']) {
      expect(manifest.files).not.toContain(forbidden);
    }
  });

  it('runs every non-browser release gate before publishing', () => {
    const prepublish = manifest.scripts?.prepublishOnly ?? '';

    for (const script of [
      'api:check',
      'benchmark:analytics',
      'peer:smoke',
      'formatters:smoke',
      'next:smoke',
      'vite:smoke',
      'pack:dry-run'
    ]) {
      expect(prepublish).toContain(`npm run ${script}`);
    }
    expect(prepublish).not.toContain('test:browser');
  });
});
