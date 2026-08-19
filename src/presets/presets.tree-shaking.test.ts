// @vitest-environment node

import { build } from 'esbuild';

describe('Analytics preset tree-shaking', () => {
  it('drops unrelated presets from an isolated named import', async () => {
    const result = await build({
      bundle: true,
      format: 'esm',
      minify: true,
      stdin: {
        contents:
          'import { revenueTrendPreset } from "./src/presets/index.ts"; console.log(revenueTrendPreset);',
        loader: 'ts',
        resolveDir: decodeURIComponent(new URL('../../', import.meta.url).pathname)
      },
      treeShaking: true,
      write: false
    });
    const output = result.outputFiles[0].text;

    expect(output).toContain('Previous period');
    expect(output).not.toContain('Upsell conversion');
    expect(output).not.toContain('percentageInput');
    expect(output).not.toContain('FunnelChart');
    expect(output).not.toContain('recharts');
    expect(output).not.toContain('react');
  });
});
