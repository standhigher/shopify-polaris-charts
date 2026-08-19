// @vitest-environment node

import { readFileSync } from 'node:fs';

interface PackageManifest {
  engines?: Record<string, string>;
  exports?: Record<string, { import?: string; types?: string }>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version?: string;
}

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
) as PackageManifest;

describe('v1 compatibility contract', () => {
  it('pins the stable v1 package and runtime ranges', () => {
    expect(manifest.version).toBe('1.0.0');
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
});
